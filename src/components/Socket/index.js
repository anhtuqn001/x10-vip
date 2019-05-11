import openSocket from 'socket.io-client';
// const  socket = openSocket('http://localhost:8081/', {
//     path: '/api'
// });

const  socket = openSocket('https://api.x10.vip/', {
    path: '/api'
});

function subscribeChannel(name, cb) {
    socket.on(name, cb);
}

function unsubscribe(name, cb) {
    socket.off(name, cb);
}


const CHANNEL_ORDER_DATA = 'order data';
const CHANNEL_TRADE_DATA = 'trade data';
const CHANNEL_TRADE_RECORDS = 'trade record';
const CHANNEL_SIGNALS = 'signals';

export { subscribeChannel, unsubscribe, 
    CHANNEL_ORDER_DATA, 
    CHANNEL_TRADE_DATA, 
    CHANNEL_TRADE_RECORDS, 
    CHANNEL_SIGNALS };