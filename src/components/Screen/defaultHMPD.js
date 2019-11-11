var size = 20;
var p = new Array(20).fill(0);
var d = new Array(20).fill(0);
var tickers = [3600000, 10800000, 21600000, 43200000, 86400000];
var data = tickers.reduce((prev, next) => {
    prev[next] = {current: 0, next: 0, p, d};
    return prev;
}, {});

export default {
    data,
    tickers
}