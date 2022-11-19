import axios from 'axios';
import store from '../plugins/store';
import api from '../config/api';
import router from '../plugins/router';

// import { Modal } from 'bootstrap';

const baseURL = api.api;

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

let temp = {
  isAlertedToken: false,
};

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

    if (error.response.data.error) {
      data = error.response.data.error.message;
    }

    if (error.response.status === 429) {
      alert('请求次数过多');
    } else if (error.response.status === 401) {
      if (router.currentRoute.value.name !== 'login') {
        if (!temp.isAlertedToken) {
          alert('您的 访问密钥 可能已经失效，请尝试通过侧边栏来重新登录。');
          temp.isAlertedToken = true;
        }

        // var myModal = new Modal(document.getElementById('tokenExpiredModal'), {
        //   backdrop: true,
        // });

        // myModal.show();

        // store.commit('updateToken', {
        //   token: null,
        // });
        // router.push({ name: 'login' });
      }
    } else if (error.response.status === 404) {
      router.push({ name: 'index' });
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
