import axios from 'axios';
import qs from 'querystring';

// const API_ENDPOINT = 'http://localhost:8081';
const API_ENDPOINT = 'https://api.x10.vip';

const DEFAULT_PAGE_SIZE = 5;
const API_USERS = `${API_ENDPOINT}/private/user`;

class ResourceAPI {
    constructor(endpoint, token) {
        this.__endpoint = endpoint;
        this.headers = {
            x_access_token: token
        }
    }

    filter(params) {
        // var queryString = qs.stringify(params);
        return axios.get(`${this.__endpoint}`, {
            params, headers: this.headers
        });
    }

    find(id) {
        return axios.get(`${this.__endpoint}/${id}`, {
            headers: this.headers
        });
    }

    update(id, data) {
        return axios.put(`${this.__endpoint}/${id}`, data, {
            headers: this.headers
        });
    }

    delete(id) {
        return axios.delete(`${this.__endpoint}/${id}`, {
            headers: this.headers
        });
    }
}

class UserApi extends ResourceAPI {
    constructor(token) {
        super(API_USERS, token);
    }

    getProfile() {
        return axios.get(`${this.__endpoint}/profile`, {
            headers: this.headers
        });
    }

    fetchProducts() {
        return axios.get(`${this.__endpoint}/products`, {
            headers: this.headers
        });
    }

    addSubcription(sku) {
        return axios.post(`${this.__endpoint}/subscription/${sku}/add`, 
        {sku}, {
            headers: this.headers
        });
    }

    signIn() {
        return axios.post(`${this.__endpoint}/login`, 
        {}, {
            headers: this.headers
        });
    }
}

export {UserApi};
