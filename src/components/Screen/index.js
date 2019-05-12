import React, {Component} from 'react';
import  './Screen.css';
import * as SocketClient from '../Socket';
import {withAuthorization} from '../Session';
import Chart from './Chart';
// import ChartRadar from './ChartRadar';
// import SpeedOmeter from './SpeedOmeter';
import ReactSpeedometer from 'react-d3-speedometer';
import BarChart, {DEFAULT_CHART_OPTION} from './ChartBar';
// import HeatmapChart from './ChartHeatMap';
// import TabVisibility from 'react-tab-visibility';

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
                volume: defaultVolume('Buy Volume'),
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
        if(document.hidden) return;
        if(data) {
            let {sell, buy, diff} = this.state;
            sell.trend.volume = parseFloat(data[0]).toFixed(2);
            buy.trend.volume = parseFloat(data[2]).toFixed(2);
            diff.rate = parseFloat(data[1]).toFixed(2);
            this.setState({sell, buy, diff});
        }
    }

    onTradeData = (data) => {
        if(document.hidden) return;
        if(data) {
            let {sell, buy} = this.state;
            sell.volume.volume = parseFloat(data[0]).toFixed(2);
            buy.volume.volume = parseFloat(data[2]).toFixed(2);
            this.setState({sell, buy});
        }
    }

    onTradeRecords = (data) => {
        if(document.hidden) return;
        var tickers = Object.keys(data);
        let {sell, buy, sells, buys} = this.state;
        tickers.forEach(ticker => {       
            var value = data[ticker];
            ticker = parseFloat(ticker);
            sell.tickers[ticker] = parseFloat(value.sell).toFixed(2);
            buy.tickers[ticker] = parseFloat(value.buy).toFixed(2);
            
            var index = TIMES.indexOf(ticker);
    
            var diff = (new Date().getTime() - value.current);
    
            if (index >= 0 && diff > 1000) {
                var scale = diff / (value.next - value.current);
                var rate = (60 / ticker) / scale;
                var normalizeBuy = ((value.buy * rate) / SCALE).toFixed(2);
                var normalizeSell = ((value.sell * rate) / SCALE).toFixed(2);
    
                sells.splice(index, 1, -normalizeSell);
                buys.splice(index, 1, normalizeBuy);
            }
    
        });
      
        this.setState({sell, buy, sells, buys}, this.updateSeries);   
    }

    onSignals = (signals) => {
        // console.log('onSignals', signals);
        if(document.hidden) return;
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

    subscribe = () => {
        console.log('subscribe');
        SocketClient.subscribeChannel(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        SocketClient.subscribeChannel(SocketClient.CHANNEL_SIGNALS, this.onSignals);
       
        
    }

    unsubscribe = () => {
        console.log('unsubscribe');
        SocketClient.unsubscribe(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        SocketClient.unsubscribe(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        SocketClient.unsubscribe(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        SocketClient.unsubscribe(SocketClient.CHANNEL_SIGNALS, this.onSignals);
      
    }

    componentDidMount() {
        this.mounted = true;
        console.log('componentDidMount');
        this.subscribe();
        
    }

    componentWillUnmount() {
        this.mounted = false;
        console.log('componentWillUnmount');
        this.unsubscribe();
    }

   
    render() {
   
        const {sell, buy, diff, series, signals} = this.state;
     
        const sellMeterOptions = {
            segments:signals.count,
            value: signals.dump,
            maxValue: signals.count,
            needleColor:"#0080ff",
            startColor: "#ff8000",
            endColor: "#ff0000",
            currentValueText:"LEVEL ${value}"
        };

        const buyMeterOption = {
            needleColor:"red",
            // startColor:"green",
            // endColor:"blue",
            startColor:"#bfff00",
            endColor:"green",
            segments:signals.count,
            maxValue: signals.count,
            value:signals.pump,
            currentValueText:"LEVEL ${value}"
        };

        return(<div className="justify-content-md-center" >
            <TrendContainer sell={sell.trend} buy={buy.trend} diff={diff}/>
            <TickerContainer sellTickers={sell.tickers} buyTickers={buy.tickers} series={series}/>
            {signals.count &&  (<MeterContainer sellMeter={sellMeterOptions} buyMeter={buyMeterOption}/>)}
        </div>);
    }
}


const TrendContainer = ({sell, buy, diff}) => (<div className="row justify-content-sm-center">
    <div className="col-md-4 col-lg-3 text-center">
        <VolumeBar {...sell} />
    </div>
    <div className="col-md-4 col-lg-3 text-center">
        <VolumeRate {...diff}></VolumeRate>
    </div>
    <div className="col-md-4 col-lg-3 text-center" >
        <VolumeBar {...buy} />
    </div>
</div>);

const MeterContainer = ({sellMeter, buyMeter}) => (<div className="row justify-content-sm-center">
    <div className="col-md-5 col-lg-3 text-center"><ReactSpeedometer {...sellMeter}/></div>
    <div className="col-md-1 col-lg-3 text-center"></div>
    <div className="col-md-5 col-lg-3 text-center"> <ReactSpeedometer {...buyMeter}/></div>
</div>);

const TickerContainer = ({sellTickers, buyTickers, series}) => (<div className="row h3 justify-content-sm-center">
    <div className="col-sm-5 order-sm-2 order-md-2 order-lg-1 col-lg-3 text-center">
        <Tickers tickers={sellTickers} />
    </div>
    <div className="col-sm-10 order-sm-1 order-md-1 order-lg-2 col-lg-3 text-center">
        <Chart series={series}  ></Chart>
    </div>
    <div className="col-sm-5 order-sm-3 order-md-3 order-lg-3 col-lg-3 text-center">
        <Tickers tickers={buyTickers} />
    </div>
</div>);

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


const condition = authUser => !!authUser;

export default withAuthorization(condition)(ScreenPage);