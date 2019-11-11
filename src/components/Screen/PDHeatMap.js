import React, { Component} from 'react';
import ReactApexChart from 'react-apexcharts';
var numOfSegment = 20;
const TICK_PER_HOUR = 1000 * 60 * 60;

const PD_TICKERS = [TICK_PER_HOUR * 1, TICK_PER_HOUR * 3, TICK_PER_HOUR * 6, TICK_PER_HOUR * 12, TICK_PER_HOUR * 24];
const PD_TICKER_NAMES = {
    [TICK_PER_HOUR * 1]: '1h',
    [TICK_PER_HOUR * 3]: '3h',
    [TICK_PER_HOUR * 6]: '6h',
    [TICK_PER_HOUR * 12]: '12h',
    [TICK_PER_HOUR * 24]: '24h',
};

 var toHHMMSS = (sec_num) => {
    sec_num = sec_num || 0;
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = Math.floor(sec_num - (hours * 3600) - (minutes * 60));

    hours = (hours + '').padStart(2,'0');
    minutes = (minutes + '').padStart(2,'0');
    seconds = (seconds + '').padStart(2,'0');

    return `${hours}:${minutes}:${seconds}`;
};



export default class PDHeatmap extends Component {
    constructor(props) {
        super(props);

        var {exchanges} = props;
        var categories = this.generateCategories(exchanges);
        this.data = categories.map(e => 0);
        this._pd = {
            p: 0, d: 0, pt: 0, dt: 0
        };
        // var color = props.type === 'p' ? '#008FFB' : '#FF4560';
        var color = '#FF4560';
        this.state = {
            options: {
                title: {
                    text: (this.props.title || "Level History"),
                    align: 'center'
                },
                chart: {
                    width: '100%',
                    toolbar: {
                        show: false
                      }
                },
              plotOptions: {
                bar: {
                  horizontal: true,
                  distributed: true,
                    dataLabels: {
                        position: 'bottom', // top, center, bottom
                    },
                }
              },
              dataLabels: {
                enabled: true,
                formatter: this.formatter,
                textAnchor: 'start',
                offsetX: 0,
                style: {
                    colors: ['#0']
                },
              },
              xaxis: {
                categories:categories,
              }
            },
            series: [{
              data: this.data
            }],
            fill: {
                colors: [color],
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: "horizontal",
                    shadeIntensity: 0.5,
                }
            },
            
          }
    }

    formatter = (value, { seriesIndex, dataPointIndex, w }) => {
        // var rate = keys[dataPointIndex] / 60;
        // return formatNumber(Math.abs(value * rate * SCALE));
        if(this.state.data) {
            var td = this.state.data[this.props.ticker][this.props.counter];
            var total =  td[1 + dataPointIndex*2];
            var next = 2 + dataPointIndex*2;
            if(next < td.length) total += td[next];
            return `${toHHMMSS(value)} \t-\t ${total}`;
        }
        return value;
        
    };

    generateCategories(count) {
        var categories = [];
        
        for(var i = 0; i < count; i++) categories.push(`Level ${i * 2 + 1}-${i * 2 + 2}`);
        
        return categories;
    }

    render() {
        return (
            <div id="chart">
              <ReactApexChart options={this.state.options} series={this.state.series} type="bar" height="350" />
            </div>);
    }

    sync = (data) => {
        var {ticker, type} = this.props;
        var tickerData = data.data[ticker][type];
        var newData = this.data.map((v, i) => {
            return tickerData[1 + i*2] + tickerData[2 + i*2];
        });
       
        this.setState({
            series: [{
                data: newData
            }], 
            ...data
        });
    }

    

    pull(data) {
       
        var {pump, dump}  = data;
        var p = pump !== this._pd.p ? 1 : 0;
        var d = dump !== this._pd.d ? 1 : 0;
        var pumpTime = 0, dumpTime = 0;
        var current = new Date().getTime();

        if(p) {
            if(this._pd.pt) pumpTime = (current - this._pd.pt)/1000;
            this._pd.pt = current;
            // console.log('pump', this._pd.p, 'duration', pumpTime);
        }

        if(d) {
            if(this._pd.dt) dumpTime = (current - this._pd.dt)/1000;
            this._pd.dt = current;
            // console.log('dump', this._pd.d, 'duration', dumpTime);
        }

         var {tickers} = this.state;
         var tickersData = this.state.data;

         for(var i = 0; i < tickers.length; i++) {
            var ticker = tickers[i];
            var tickerData = tickersData[ticker];

            if(tickerData.next < current) {
                tickerData = this.resetTicker(current, ticker);
                tickersData[ticker] = tickerData;
            }
            tickerData.p[pump] += p;
            tickerData.d[dump] += d;
            tickerData.pt[this._pd.p] += pumpTime;
            tickerData.dt[this._pd.d] += dumpTime;
        }

        // if(p + d > 0) console.log(p, d);
        this._pd.p = data.pump;
        this._pd.d = data.dump;

        var td = tickersData[this.props.ticker][this.props.type];
        var newData = this.data.map((v, i) => {
            var val = td[1 + i*2];
            var next = 2 + i*2;
            if(next < td.length) val += td[next];
            return val;
        });
       
        this.setState({
            series: [{
                data: newData
            }]
        });
    }

    resetTicker(currentTime, ticker) {
        var p = []; for(var i = 0; i < numOfSegment; i++) p.push(0);
        var d = p.slice();
        var pt = p.slice();
        var dt = p.slice();

        let current = Math.floor(currentTime / ticker) * ticker;
        let next = current + ticker;
        
        return {current, next, p, d, pt, dt};
    }
}

export {PD_TICKERS, PD_TICKER_NAMES};