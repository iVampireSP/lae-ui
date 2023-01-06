import axios from 'axios';

import api from '../config/api.js';
import router from 'router.js';


import { useUserStore } from "./stores/user.js";
import { useHttpStore } from "./stores/http.js";

const baseURL = api.api;
const user = useUserStore();
const http = useHttpStore();

// axios.defaults.withCredentials = true;

// 实例
let instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    if (config.headers === undefined) {
      config.headers = {};
    }

    config.headers['Accept'] = 'application/json';
    config.headers['Authorization'] = 'Bearer ' + user.token;

    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res);
  },
  (error) => {
    console.error('axios error', error);

    let data = [];

    if (error.response.data.data) {
      data = error.response.data.data;
    }

    if (error.response.data.message) {
      data = error.response.data.message;
    }

    if (error.response.data.error) {
      data = error.response.data.error.message;
    }

    if (error.response.status === 429) {
      alert('请求次数过多');
    } else if (error.response.status === 401) {
      if (router.currentRoute.value.name !== 'login') {
        if (!http.isAlertedToken) {
          //   alert('您的 访问密钥 可能已经失效，请尝试通过侧边栏来重新登录。');

          setTimeout(() => {
            router.push({name: 'login'});
          }, 1000);

          http.isAlertedToken = true;
        }
      }
    } else if (error.response.status === 404) {
      router.push({ name: 'index' });
    } else {
      if (data.length !== 0) {
        alert(data);
      }
    }
  }
);

export default instance;
