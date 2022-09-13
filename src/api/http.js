import axios from 'axios';
import store from '../plugins/store';
import api from '../config/api';
import router from '../plugins/router';

import { Modal } from 'bootstrap';

// if build for production, use production api
// if build for development, use development api
const baseURL =
  process.env.NODE_ENV === 'production' ? api.production : api.development;
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
    console.error('axios error', error);

    let data = [];

    if (error.response.data.data) {
      data = error.response.data.data;
    }

    if (error.response.data.message) {
      data = error.response.data.message;
    }

    if (error.response.status === 429) {
      alert('请求次数过多');
    } else if (error.response.status === 401) {
      if (router.currentRoute.value.name !== 'login') {
        alert('您的 访问密钥 可能已经失效，请尝试通过侧边栏来重新登录。');

        // var myModal = new Modal(document.getElementById('tokenExpiredModal'), {
        //   backdrop: true,
        // });

        // myModal.show();

        // store.commit('updateToken', {
        //   token: null,
        // });
        // router.push({ name: 'login' });
      }
    } else {
      if (data.length !== 0) {
        alert(data);
      }
    }

    // window.$message.error(
    //     error.response.data.message ?? '发生了一些错误。'
    // );
  }
);

export default instance;
