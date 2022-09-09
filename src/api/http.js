import axios from 'axios';
import store from '../plugins/store';
import api from '../config/api';
import app from '../config/app';
import router from '../plugins/router';

import Layout from '../components/Layout.vue';

// if build for production, use production api
// if build for development, use development api
const baseURL = process.env.NODE_ENV === 'production' ? api.production : api.development;
console.log('api endpoint: ' + baseURL);

// const auth_url = process.env.NODE_ENV === 'production' ? api.prod_auth : api.develop_auth;


// console.log(Layout.tooManyRequests);

// axios.defaults.withCredentials = true;
// import Base from "../Base.vue";

// console.log(Base)
// App.message
// App.loadingBar.start();
// message.create('hi');

// const url = {
//     dev: "https://www.leaf.test/api/",
//     production: "https://www.leaf.test/api/",
// }

// 实例
let instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.headers === undefined) {
      config.headers = {};
    }

    config.headers['Accept'] = 'application/json';
    config.headers['Authorization'] = 'Bearer ' + store.state.token;

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    res.data = res.data.data;

    return Promise.resolve(res);
  },
  (error) => {
    console.error(error);

    if (error.response.status === 429) {
      alert('请求次数过多');
    }

    if (error.response.status === 401) {
      store.commit('setToken', null);
      router.push({ name: 'login' });
    }

    // window.$message.error(
    //     error.response.data.message ?? '发生了一些错误。'
    // );
  }
);

export default instance;
