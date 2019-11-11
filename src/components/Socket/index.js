import io, {} from 'socket.io-client';
const SOCKET_API = 'https://api.x10.vip/';
// const SOCKET_API = 'http://localhost:8081';

class Socket {
    constructor() {
        this.socket = io(SOCKET_API, {
            path: '/api'
        });        
    }

    subscribeChannel = (name, cb) => {
        this.socket.on(name, cb);
    };

    unsubscribe = (name, cb) => {
        this.socket.off(name, cb);
    }

    close() {
        this.socket.close();
    }
}

const CHANNEL_HEATMAP = 'heatmap';
const CHANNEL_HEATMAP_PD = 'heatmap pd';
const CHANNEL_ORDER_DATA = 'order data';
const CHANNEL_TRADE_DATA = 'trade data';
const CHANNEL_TRADE_RECORDS = 'trade record';
const CHANNEL_SIGNALS = 'signals';

export default Socket;

export {
    SOCKET_API,
    CHANNEL_HEATMAP, 
    CHANNEL_HEATMAP_PD,
    CHANNEL_ORDER_DATA, 
    CHANNEL_TRADE_DATA, 
    CHANNEL_TRADE_RECORDS, 
    CHANNEL_SIGNALS };