import axios from 'axios'

import api from '../config/api.js'
import {request, response} from "./httpInterceptors.js";
import app from '../config/app'

const baseURL = api.gateway
// axios.defaults.withCredentials = true;

// 实例
let instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
})

const requestOnFulfilled = (config) => {
    // app.loading.value = true
    return request.onFulfilled(config)
}

const requestOnRejected = (config) => {
    // app.loading.value = true
    return request.onRejected(config)
}

const responseOnFulfilled = (res) => {
    // app.loading.value = false
    return response.onFulfilled(res)
}

const responseOnRejected = (error) => {
    // app.loading.value = false
    return response.onRejected(error)
}

instance.interceptors.request.use(requestOnFulfilled, requestOnRejected)

instance.interceptors.response.use(responseOnFulfilled, responseOnRejected)
export default instance
