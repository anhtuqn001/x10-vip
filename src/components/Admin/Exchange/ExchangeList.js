import React, {Component} from 'react';

const Ticker = ({id, value}) => (<p className="tickers">
    {id}: <span>{value.toFixed(2)}</span>
</p>);


class ExchangeItem extends Component {
    startExchange = () => {}
    stopExchange = ()=>{}
    render() {
        var {stat} = this.props;
        const tickers = stat.tickers;
      
        const sellTickers = tickers &&
            Object.keys(tickers).map(key => (<Ticker key={key} value={tickers[key].sell}/>));
        const buyTickers = tickers &&
            Object.keys(tickers).map(key => (<Ticker key={key} value={tickers[key].buy}/>));
           
        return (
            <div className="col-md-4 col-sm-6">
                <div className="card mt-3" id={stat.id}>
                    <div className="card-body" className={stat.running ? 'text-danger' : undefined}>
                        <h5 className="card-title">[{stat.proto}] 
                            {stat.id && stat.id.replace('_Exchange_Api', '')}
                            {stat.pair}</h5>
                        <span className="card-text mr-3">Heartbeat: {stat.heartbeat}</span>
                        <span className="card-text mr-3">Error: {stat.error}</span>
                        <p>
                            <span className="card-text mr-3">Bid: {parseFloat(stat.bid || 0).toFixed(2)}</span>
                            <span className="card-text mr-3">Ask: {parseFloat(stat.ask || 0).toFixed(2)}</span>
                        </p>
        
                        {stat.tickers && (<div  className="row">
                            <div className="col-6">
                                <p className="font-weight-bold">Sell</p>
                                {sellTickers}
                            </div>
                            <div className="col-6">
                                <p className="font-weight-bold">Buy</p>
                                {buyTickers}
                            </div>
                        </div>)}
                        <p>
                            <a role="button" className="btn btn-primary" onClick={this.startExchange(stat)}
                                className={stat.running ? 'disabled': undefined}>Start</a>
                            <a role="button" className="btn btn-primary" click={this.stopExchange(stat)}
                                className={!stat.running ? 'disabled': undefined}>Stop</a>
                        </p>
                    </div>
                </div>
            </div>
        )
    }
};

const ExchangeList = ({stats}) => (<div className="row">
    {Object.keys(stats).map(key => <ExchangeItem stat={stats[key]} key={key} />)}
</div>);

export default ExchangeList;