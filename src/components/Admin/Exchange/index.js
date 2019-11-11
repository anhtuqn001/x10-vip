import React, {Component} from 'react';
import ExchangeList from './ExchangeList';
import EventItem from './EventList';
import SocketClient, {SOCKET_API} from '../../Socket';
import io from 'socket.io-client';

class ExchangePage extends Component {
    constructor(props) {
        super(props);
        this.state = {events: [], stats: {}, trades: {}};

        this.socket = io(SOCKET_API, {
            path: '/api'
        });
        this.nspAdmin = io(`${SOCKET_API}/admin`);
    }

    componentDidMount() {
        this.subscribe();
    }

    componentWillUnmount() {
        this.unsubscibe();
        this.socket.close();
    }

    onAll = (stats) => {
        this.setState({stats});
    }

    onStat = (data) => {
        var {stats} = this.state;
        stats[data.id] = Object.assign(stats[data.id], data);
        // console.log(stats);
        this.setState({stats});
    }

    onStats = (bundle) => {
        var {stats} = this.state;
        bundle.forEach(data => {
            stats[data.id] = Object.assign(stats[data.id], data);
        });
        // console.log(stats);
        this.setState({stats});
    }

    onTicker = (data) => {
        var stat = this.state.stats[data.id] || {};
        var tickers = stat.tickers || {};
        tickers[data.ticker] = data.value;
        stat.tickers = tickers;

        var {stats} = this.state;
        stats[data.id] = stats;
        this.setState({stats});
    }

    onEvent = (data) => {
        // console.log(data);

        var {events} = this.state;
        const maxLen = 20;
        events.splice(0, 0, data);
        if (events.length > maxLen) {
            events = events.splice(maxLen, events.length - maxLen);
        }
        this.setState({events});

        // try {
        //     $.playSound('/ding.mp3');
        // } catch (error) {

        // }
    }

    onTradeRecord = (data) => {
        // console.log(data);
        var {trades} = this.state;
        Object.keys(data).forEach(function(ticker){
            var value = data[ticker];
            ticker = parseFloat(ticker);
            trades[ticker] = value;
        });
        this.setState({trades});
    }

    subscribe = () => {
        var socket = this.socket;
        var nspAdmin = this.nspAdmin;
    
        nspAdmin.on('bot.all', this.onAll);

        nspAdmin.on('bot.stat', this.onStat);

        nspAdmin.on('bot.stats', this.onStats);

        nspAdmin.on('ticker', this.onTicker);

        nspAdmin.on('event', this.onEvent);

        socket.on('trade record', this.onTradeRecord);
    }

    unsubscibe = ()=>{
        
    }

    clear = () => {}

    render() {
        var {stats} = this.state;

        return (<div className="row">
           <div className="col-md-9 text-center">
                <h2>APIs</h2>
                <ExchangeList stats={stats} />
           </div>
           <div className="col-md-3">
                <h2 className="text-center">Events</h2>
                <div className="card">
                    <div className="card-body">
                        { this.state.events.map((event, i) => <EventItem event={event} key={i} />)}
                        <div className="text-center">
                            <button className="btn btn-default" onClick={this.clear}>Clear</button>
                        </div>
                    </div>
                </div>
    
            </div>
        </div>);
    }
}

export default ExchangePage;