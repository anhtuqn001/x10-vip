import React, {Component} from 'react';

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

export default ({tickers}) => (
    <div className="h3">
        {Object.keys(tickers).map(ticker => (
            <p className="tickers" key={ticker}>
                {TICKERS[ticker] || ticker}<span>{tickers[ticker]}</span>
            </p>
        ))}
    </div>);


export {TIMES, SCALE, TICKERS};