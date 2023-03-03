import axios from 'axios'
import {request, response} from "./httpInterceptors";
import api from '../config/api'


const baseURL = api.api
// axios.defaults.withCredentials = true;

// 实例
let instance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
})

instance.interceptors.request.use(request.onFulfilled, request.onRejected)

instance.interceptors.response.use(response.onFulfilled, response.onRejected)
export default instance
