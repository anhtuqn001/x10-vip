import React, { Component} from 'react';
import Chart from 'react-apexcharts';

var numOfSegment = 30;
var rangeOfPrice = 3000;
var segmentSize = rangeOfPrice / numOfSegment;

var tickerLabels = ['3h', '6h', '12h', '24h'];
var prices = [];

const TICK_PER_HOUR = 1000 * 60 * 60;
const TICKERS = [TICK_PER_HOUR * 3, TICK_PER_HOUR * 6, TICK_PER_HOUR * 12, TICK_PER_HOUR * 24];
const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number);
}


class BitMEXHeatmap extends Component {
    constructor(props) {
        super(props);
        
        this.myRef = React.createRef();

        var {data} = this.props;

        var {  config, heatmap, tickers } = data;

        this._tickers = tickers;
        this._tickersData = heatmap;
        prices = data.prices;

        this.config = config;

        var categories = this.generateCategories(config);
        var ticker = TICKERS[0];

        console.log(heatmap);
     
        var color = '#FF4560';
        this.state = {
            options: {
                title: {
                    text: "Buy/Sell Bitmex",
                    align: 'center'
                },
                chart: {
                    width: '100%',
                    toolbar: {
                        show: false
                    },
                    stacked: true,
                },
              plotOptions: {
                bar: {
                    horizontal: true,
      
                    barHeight: '100%',
                    // distributed: true,
                    dataLabels: {
                        position: 'bottom', // top, center, bottom
                    },
                },
              },
              colors: ['#008FFB','#FF4560'],
              dataLabels: {
                enabled: true,
                textAnchor: 'start',
                formatter: function(val, {seriesIndex, dataPointIndex}) {
                    var side =  seriesIndex === 0 ? 'Sell' : 'Buy';
                    return `\t\t ${prices[side][dataPointIndex]} (${formatNumber(val)})` 
                },
                offsetX: 0,
                style: {
                    colors: ['#0']
                },
                // dropShadow: {
                //   enabled: true
                // }
              },
              stroke: {
                width: 1,
                colors: ['#fff']
                },
              xaxis: {
                categories:categories,
                minHeight: 70,
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    cssClass: 'apexcharts-xaxis-label',
                },
              },
              yaxis: {
                labels: {
                    show: true
                }
              },
            },
            series: this.getUpdateSeries(heatmap, ticker),
            fill: {
                colors: [color],
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: "horizontal",
                    shadeIntensity: 0.5,
                }
            },
            ticker: TICKERS[0],
            ...data
        };

        this.getFormattedDate = this.getFormattedDate.bind(this);
        this.processTrade = this.processTrade.bind(this);
    }

    componentDidMount() {

        this.socket = new WebSocket('wss://www.bitmex.com/realtime?subscribe=trade,insert:XBTUSD');
        this.socket.onopen = () => {
            console.log('ws', 'bitmex', 'open');
        };
        this.socket.onmessage = (msg) => {
            var data = JSON.parse(msg.data);
            if (data.action === 'insert') {
                this.processTrade(data.data);
            }

        };
        this.socket.onclose = () => {
            console.log('ws', 'bitmex', 'close');
        };
        this.socket.onerror = (err) => {
            console.error('ws', 'bitmex', err);
        };

        var client = this;
        this.intervalId = setInterval(() => {
            var series = client.getUpdateSeries(client._tickersData, client.state.ticker);
            client.setState({
                series
            });
            // client.myRef.current.chart.updateSeries(_tickerData);
            // client.myRef.current.chart.updateSeries(series);
            
        }, 1000);
    }

    componentWillUnmount() {
        this.socket.close();
        clearInterval(this.intervalId);
    }

    getFormattedDate(date) {

        let formattedDate = date.toISOString().substr(0, 10);
        return formattedDate;
    }

    generateCategories(config) {
        var categories = [];
        var { min, size } = config;
        for (var i = 0; i < config.n; i++) {
            categories.push(`${min}-${min + size}`);
            min += size;
        };
        return categories;
    }

    initTicker() {
        var v = [];
        for (var i = 0; i < numOfSegment; i++) {
            v.push(0);
        }
        return v;
    }

    processTrade(results) {
       
        var config = this.config;
        var current = new Date().getTime();
        var client = this;
        
        var n = results.length-1;
        var trdMatchID = results[n].trdMatchID;

        for(var k = 0; k < results.length; k++) {
            var trade = results[k];

            if(trade.trdMatchID === this.trdMatchID) continue;

            var {price, side, size} = trade;
            if(trade.symbol === 'XBTUSD') {
                // console.log(price);
                var index;
                if (price < config.min) {
                    index = 0;
                } else if (price > config.max) {
                    index = numOfSegment - 1;
                } else {
                    index = Math.floor((price - config.min) / segmentSize);
                }
                
                prices[side][index] = price;
                // console.log(side, size);
               
                for (var i = 0; i < client._tickers.length; i++) {
                    var ticker = client._tickers[i];
                    var tickerData = client._tickersData[ticker];
    
                    if (tickerData.next < current) {
                        tickerData = client.resetTicker(current, ticker);
                        client._tickersData[ticker] = tickerData;
                    }
    
                    tickerData[side].counters[index]++;
                    tickerData[side].volumes[index] += size;
                }
            }
        }
        this.trdMatchID = trdMatchID;
    }

    getUpdateSeries = (heatmap, ticker) => {
        return [{
            name: 'Buy',
            data: heatmap[ticker]["Buy"].volumes.slice(0, numOfSegment)
        }, {
            name: 'Sell',
            data: heatmap[ticker]["Sell"].volumes.slice(0, numOfSegment)
        }];
    }

    resetTicker(currentTime, ticker) {
        let current = Math.floor(currentTime / ticker) * ticker;
        let next = current + ticker;
        return {
            current,
            next,
            counters: this.initTicker()
        };
    }

    render() {
        var ticker = this.state.ticker;
        var tabs = tickerLabels.map((t,index) => {
            var tick = TICKERS[index];
            var clazz = tick === ticker?'btn btn-secondary active':'btn btn-secondary';
            return (<button key={index} 
                onClick={()=>{this.setState({ticker: tick})}}
                type="button" 
                className={clazz}>
                {t}
                </button>);
        });
 
        return (<div>
               <div className="row justify-content-center">
                    <div className="btn-group" role="group">
                        {tabs}
                    </div>
               </div>

                <div id="bitmex">
                    <Chart 
                        options={this.state.options} 
                        series={this.state.series} 
                        type="bar" 
                        height="700" />
                </div>
        </div>);
    }
}

export default BitMEXHeatmap;