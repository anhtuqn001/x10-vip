import React, {Component} from 'react';
import  './Screen.css';
import * as SocketClient from '../Socket';
import {withAuthorization} from '../Session';
import Chart from './Chart';
// import ChartRadar from './ChartRadar';
// import SpeedOmeter from './SpeedOmeter';
import ReactSpeedometer from 'react-d3-speedometer';
import BarChart, {DEFAULT_CHART_OPTION} from './ChartBar';
import HeatmapChart from './ChartHeatMap';

const TIMES = [60, 180, 300, 1800, 3600, 21600, 86400];
const  SCALE = 50;

const TICKERS = {
    60: "1m",
    180: "3m",
    300: "5m",
    1800: "30m",
    3600: "1h",
    21600: "6h",
    86400: "1d",
};

const INIT_TICKERS = Object.keys(TICKERS).reduce(function (prev, curr) {
    prev[curr] = 0;
    return prev;
}, {});

const INIT_TICKER_STATS = Object.keys(TICKERS).reduce(function (prev, curr) {
    prev[curr] = {
        buy: 0, sell: 0, current: 0, next: 0,
        stats_buy: { hi: 0, lo: 0, count: 0, avg: 0, e: 0 },
        stats_sell: { hi: 0, lo: 0, count: 0, avg: 0, e: 0 },
    };
    return prev;
}, {});

class ScreenPage extends Component {
    constructor(props) {
        super(props);

        var defaultVolume = (name) => ({name, volume: 0});
        //colors: ['#FF4560', '#008FFB'],
        this.state = {
            sell: {
                trend: {...defaultVolume('Trend of Selling'), chartOptions: {colors: ['#FF4560', '#008FFB'],}},
                volume: defaultVolume('Sell Volume'),
                tickers: {...INIT_TICKERS},
            },
            buy: {
                trend: defaultVolume('Trend of Buying'),
                volume: defaultVolume('Sell Volume'),
                tickers: {...INIT_TICKERS},
            },
            diff: {
                name: 'Buy&Sell Ratio',
                rate: 0
            },
            stats: {...INIT_TICKER_STATS},
            series: [{
                name: 'Sells',
                data: [0, 0, 0, 0, 0, 0, 0]
            }, {
                name: 'Buys',
                data: [0, 0, 0, 0, 0, 0, 0]
            }],
            sells: [0, 0, 0, 0, 0, 0, 0],
            buys:[0, 0, 0, 0, 0, 0, 0],
            signals: {
                pump: 0, dump: 0, count: 0
            }
        };
    }

    onOrderData = (data) => {
        if(data) {
            let {sell, buy, diff} = this.state;
            sell.trend.volume = parseFloat(data[0]).toFixed(2);
            buy.trend.volume = parseFloat(data[2]).toFixed(2);
            diff.rate = parseFloat(data[1]).toFixed(2);
            this.setState({sell, buy, diff});
        }
    }

    onTradeData = (data) => {
        if(data) {
            let {sell, buy} = this.state;
            sell.volume.volume = parseFloat(data[0]).toFixed(2);
            buy.volume.volume = parseFloat(data[2]).toFixed(2);
            this.setState({sell, buy});
        }
    }

    onTradeRecords = (data) => {
        var ticker = data.timer;
        let {sell, buy, sells, buys} = this.state;
        var value = data.value;
        sell.tickers[ticker] = parseFloat(value.sell).toFixed(2);
        buy.tickers[ticker] = parseFloat(value.buy).toFixed(2);
        

        var index = TIMES.indexOf(ticker);

        var diff = (new Date().getTime() - value.current);

        if (index >= 0 && diff > 1000) {
            var scale = diff / (value.next - value.current);
            var rate = (60 / ticker) / scale;
            var normalizeBuy = ((value.buy * rate) / SCALE).toFixed(2);
            var normalizeSell = ((value.sell * rate) / SCALE).toFixed(2);

            // app.series[0].data.splice(index, 1, -normalizeSell);
            // app.series[1].data.splice(index, 1, normalizeBuy);
            sells.splice(index, 1, -normalizeSell);
            buys.splice(index, 1, normalizeBuy);
        }

        this.setState({sell, buy, sells, buys});   
    }

    onSignals = (signals) => {
        // console.log('onSignals', signals);
        this.setState({signals});
    }

    updateSeries = () => {

        let {buys, sells} = this.state;
       
        let series = [{
            name: 'Sells',
            data: sells.slice()
        }, {
            name: 'Buys',
            data: buys.slice()
        }];
        
        this.setState({series});
    };

    componentDidMount() {
        SocketClient.subscribeChannel(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_SIGNALS, this.onSignals);
        this.interval = setInterval(this.updateSeries, 1000);
    }

    componentWillUnmount() {
        SocketClient.unsubscribe(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        SocketClient.unsubscribe(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        SocketClient.unsubscribe(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        SocketClient.unsubscribe(SocketClient.CHANNEL_SIGNALS, this.onSignals);
        clearInterval(this.interval);
    }

    render() {
        // console.log('render');
        // console.log(signals.count);
        const {sell, buy, diff, series, signals} = this.state;
      
        const sellMeterOptions = {
            segments:signals.count,
            value: signals.dump,
            maxValue: signals.count,
            startColor: "#33CC33",
            endColor: "#FF471A",
            currentValueText:"DUMP ${value}"
        };

        const buyMeterOption = {
            needleColor:"red",
            startColor:"green",
            segments:signals.count,
            maxValue: signals.count,
            value:signals.pump,
            endColor:"blue",
            currentValueText:"PUMP ${value}"
        };

        return(<div className="row justify-content-md-center">
            {signals.count && (<Stats {...sell} meter={sellMeterOptions} />)}
            <div className="col-md-4 col-lg-3  text-center h3">
                <VolumeRate {...diff}></VolumeRate>
                <Chart series={series}  ></Chart>
                {/* <HeatmapChart/> */}
            </div>
            {signals.count && (<Stats {...buy} meter={buyMeterOption}/>)}
        </div>);
    }
}

const Tickers = ({tickers}) => (
    <React.Fragment>
        {Object.keys(tickers).map(ticker => (
            <p className="tickers" key={ticker}>
                {TICKERS[ticker] || ticker}<span>{tickers[ticker]}</span>
            </p>
        ))}
    </React.Fragment>);

const Volume = ({name,volume}) => (<div className="h3 pt-3">
    <p className="title">{name}</p>
    <p className="m-3">{volume}</p>
</div>);

const VolumeBar = ({name, volume, chartOptions}) => {
    var options = Object.assign({}, {...DEFAULT_CHART_OPTION}, chartOptions || {});
    options.xaxis.categories = [name];
    
    let series = [{data: [parseFloat(volume)]}];

    return (<div className="h3">
        <p className="title">{name}</p>
        <BarChart options={options} series={series} />
    </div>);
};

const VolumeRate = ({name, rate}) => (<div className="h3 pt-3">
     <p>{name}</p>
    <div  className={rate > 0? "green": "red"} >
        {rate}%
    </div>
</div>);


const Stats = ({trend, volume, tickers, meter}) => (
    <div className="col-md-4 col-lg-3 text-center h3">
        {/* <Volume {...trend} /> */}
        <VolumeBar {...trend} />
        <Volume {...volume} />
        <Tickers tickers={tickers} />
        <ReactSpeedometer {...meter}/>
    </div>);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(ScreenPage);