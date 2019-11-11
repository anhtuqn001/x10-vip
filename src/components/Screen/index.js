import React, {Component} from 'react';
import  './Screen.css';
import Socket, * as SocketClient from '../Socket';
import {withSubscription} from '../Session';

import ReactSpeedometer from 'react-d3-speedometer';

import BarStackedOption, {getDataPointValue} from './ChartOptions/BarStackedPctOption';
import Chart from 'react-apexcharts';
import {TIMES, SCALE, TICKERS} from './Ticker';
import {VolumeBarStacked} from './Volume';
import {OneColumnRow, TwoColumnRow} from './Layout';

import {Subscription} from '../Account';
import BitMEXHeatmap from './BitMEXHeatmap';
import TradingViewWidget from 'react-tradingview-widget';
import PDHeatmap, {PD_TICKERS, PD_TICKER_NAMES} from './PDHeatMap';
import heatmapPD from './defaultHMPD';
console.log('defaultHMPD', heatmapPD);

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

var defaultVolume = (name) => ({name, volume: 0});

const DATA = {
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

class ScreenPage extends Component {
    constructor(props) {
        super(props);
        
        this.pRef = React.createRef();
        this.dRef = React.createRef();

        const sellMeterOptions = {
            needleColor:"#0080ff",
            startColor: "#ff8000",
            endColor: "#ff0000",
        };

        const buyMeterOption = {
            needleColor:"red",
            startColor:"#bfff00",
            endColor:"green",
        };

     
        this.state ={...DATA, 
            currentTab: 'pd',
            sellMeterOptions,
            buyMeterOption,
            heatmapPD,
            ticker: 3600000,
        };

        this.socket = new Socket();
        
    }
   
    onOrderData = (data) => {
        if(document.hidden) return;
        if(data) {
            let {sell, buy, diff} = DATA;
            sell.trend.volume = parseFloat(data[0]).toFixed(2);
            buy.trend.volume = parseFloat(data[2]).toFixed(2);
            diff.rate = parseFloat(data[1]).toFixed(2);
            // this.setState({sell, buy, diff});
            Object.assign(DATA, {sell, buy, diff});
        }
    }

    onTradeData = (data) => {
        if(document.hidden) return;
        if(data) {
            // let {sell, buy} = this.state;
            let {sell, buy} = DATA;
            sell.volume.volume = parseFloat(data[0]).toFixed(2);
            buy.volume.volume = parseFloat(data[2]).toFixed(2);
            // this.setState({sell, buy});
            Object.assign(DATA, {sell, buy});
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
                sells.splice(index, 1, normalizeSell);
                buys.splice(index, 1, normalizeBuy);
                // console.log(normalizeSell);
            }
        });
        Object.assign(DATA, {sells, buys});
        
    }

    onSignals = (signals) => {
        // console.log('onSignals', signals);
        if(document.hidden) return;
        this.setState({signals});
        if(this.pRef.current != null) this.pRef.current.pull(signals);
        if(this.dRef.current != null) this.dRef.current.pull(heatmapPD);
    }

    onHeatmap = (heatmap) => {
        // console.log('heatmap', data);
        this.setState({heatmap})
        
        // this.bitmex.start();

    };

    onHeatmapPD = (heatmapPD) => {
        console.log('heatmapPD', heatmapPD);
        if(this.pRef.current != null) this.pRef.current.sync(heatmapPD);
        if(this.dRef.current != null) this.dRef.current.sync(heatmapPD);
        this.setState({heatmapPD});
    }

    subscribe = () => {
        console.log('subscribe');
        
        this.socket.subscribeChannel(SocketClient.CHANNEL_HEATMAP, this.onHeatmap);
        this.socket.subscribeChannel(SocketClient.CHANNEL_HEATMAP_PD, this.onHeatmapPD);
        this.socket.subscribeChannel(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        this.socket.subscribeChannel(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        this.socket.subscribeChannel(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        this.socket.subscribeChannel(SocketClient.CHANNEL_SIGNALS, this.onSignals);   
        
        this.interval = setInterval(this.updateData, 1000);
    }

    unsubscribe = () => {
        console.log('unsubscribe');
        this.socket.unsubscribe(SocketClient.CHANNEL_HEATMAP, this.onHeatmap);
        this.socket.unsubscribe(SocketClient.CHANNEL_HEATMAP_PD, this.onHeatmapPD);
        this.socket.unsubscribe(SocketClient.CHANNEL_ORDER_DATA, this.onOrderData);
        this.socket.unsubscribe(SocketClient.CHANNEL_TRADE_DATA, this.onTradeData);
        this.socket.unsubscribe(SocketClient.CHANNEL_TRADE_RECORDS, this.onTradeRecords);
        this.socket.unsubscribe(SocketClient.CHANNEL_SIGNALS, this.onSignals);
        clearInterval(this.interval);
    }

    updateData = () => {
        if(document.hidden) return;
        // console.log('updateData');
        let {sell, buy, diff, sells, buys} = DATA;
        // this.setState({sells, buys}, this.updateSeries);   
        let series = [{
            name: 'Sells',
            data: sells.slice()
        }, {
            name: 'Buys',
            data: buys.slice()
        }];
        this.setState({sell, buy, diff, sells, buys, series});
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
        this.socket.close();
        window.hidePurchasePage();
    }

    render() {
        
        const {sell, buy, diff, series, signals, sellMeterOptions, buyMeterOption} = this.state;
        
        sellMeterOptions.segments = signals.count;
        sellMeterOptions.maxValue = signals.count;
        sellMeterOptions.value = signals.dump;
       
        buyMeterOption.segments = signals.count;
        buyMeterOption.maxValue = signals.count;
        buyMeterOption.value = signals.pump;
        var ticker = this.state.ticker;

        var tabs = PD_TICKERS.map((t,index) => {
            return (<button key={index} type="button" className={"btn btn-secondary" + (t === ticker?' active':'')}
                onClick={()=>{this.setState({ticker: t})}}>
                {PD_TICKER_NAMES[t]}
            </button>);
        });
        
        return(<div className="justify-content-md-center" >
            <TrendContainer sell={sell.trend} buy={buy.trend} diff={diff}/>
            <VolumeContainer sell={sell.volume} buy={buy.volume}/>
            <TickerContainer sellTickers={sell.tickers} buyTickers={buy.tickers} series={series}/>
            {signals.count &&  (<MeterContainer sellMeter={sellMeterOptions} buyMeter={buyMeterOption}/>)}
            <div>
                <div className="row justify-content-center">
                    <div className="btn-group" role="group">
                        {tabs}
                    </div>
                </div>
                <div className="row justify-content-sm-center">
                    <div className="col-sm-10 col-md-6 col-lg-5 col-xl-4 text-center">
                        <PDHeatmap ref={this.dRef} 
                            type={'dt'} 
                            counter={'d'}
                            title='Level History / Sell'
                            ticker={ticker} 
                            data={this.state.heatmapPD} 
                            exchanges={10}/>
                    </div>
                    <div className="col-sm-10 col-md-6 col-lg-5 col-xl-4 text-center">
                        <PDHeatmap ref={this.pRef} 
                            type={'pt'} 
                            counter={'p'}
                            title='Level History / Buy'
                            ticker={ticker}
                            data={this.state.heatmapPD} 
                            exchanges={10}/>
                    </div>
                </div>
            </div>
          
            {this.state.heatmap && (<BitMEXHeatmap data={this.state.heatmap}></BitMEXHeatmap>)}
            
            {/* {<TradingViewWidget symbol="BitMEX:XBT" />} */}
        </div>);
    }
}



const VolumeContainer = ({sell, buy}) => (OneColumnRow(
    (<div className="row h3">
        <div className="col-6 sell">
            {sell.volume}
        </div>
        <div className="col-6 buy">
            {buy.volume}
        </div>
    </div>)
));

const TrendContainer = ({sell, buy, diff}) => {
    const series = [{
        name: 'Sell',
        data: [sell.volume]
    }, {
        name: 'Buy',
        data: [buy.volume]
    }];

    return (OneColumnRow(<VolumeBarStacked series={series} />));
};


const MeterContainer = ({sellMeter, buyMeter}) => (<div className="row justify-content-sm-center">
    <div className="col-md-5 col-lg-3 text-center"><ReactSpeedometer {...sellMeter}/></div>
    <div className="col-md-1 col-lg-3 text-center"></div>
    <div className="col-md-5 col-lg-3 text-center"> <ReactSpeedometer {...buyMeter}/></div>
</div>);

const VolumeBarOption = Object.assign({...BarStackedOption},  {
    dataLabels: {
        enabled: true,
        formatter:  (value, opt) => {
            return parseFloat(getDataPointValue(opt)).toFixed(2);
        },
    },
    title: {
        text: 'Volume',
        align: 'center',
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
            fontSize:  '20px',
            color:  '#263238'
        },
    }});

const FutureVolumeBarOption = Object.assign({...BarStackedOption}, {
    title: {
        text: 'Future',
        align: 'center',
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
            fontSize:  '20px',
            color:  '#263238'
        },
    }
});

const TickerContainer = ({sellTickers, buyTickers, series}) => {
    var volumeSeries = [{
        name: 'Sells',
        data: Object.keys(sellTickers).map(k => sellTickers[k])
    }, {
        name: 'Buys',
        data: Object.keys(sellTickers).map(k => buyTickers[k])
    }];
    return (TwoColumnRow(
        <Chart options={VolumeBarOption} series={volumeSeries} type="bar" height={300} />,
        <Chart options={FutureVolumeBarOption} series={series} type="bar" height={300} />,
        // <Tickers tickers={buyTickers} />
        ))
};

export const Unsubscription = ({claims, idToken}) => (<div>
    <div className="d-flex justify-content-center">
        <Subscription {...{claims, idToken}}></Subscription>
    </div>
    {/* <div className="text-center">
        <Link to={ROUTES.ACCOUNT}>Check my account</Link>
    </div> */}
</div>);


export default withSubscription(ScreenPage)(Unsubscription);