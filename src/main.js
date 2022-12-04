import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/bootstrap-dark.min.css';
import './style.css';

import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
// import pangu from 'pangu';
// import { useRoute } from 'vue-router';

import App from './App.vue';

import router from './plugins/router';
import store from './plugins/store';

// if (CSS && 'paintWorklet' in CSS) CSS.paintWorklet.addModule('/assets/js/paint.js');

const app = createApp(App);

// app.config.globalProperties.$http = http;
// app.config.globalProperties.$route = useRoute();

// retry
// import axiosRetry from 'axios-retry';
// axiosRetry(axios, { retries: 3 });

// 引入 http

app.use(router, store, VueAxios, axios);

app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');

// let client = new PusherJS('app-key', {
//   wsHost: '127.0.0.1',
//   wsPort: 6001,
//   forceTLS: false,
//   encrypted: true,
//   disableStats: true,
//   enabledTransports: ['ws', 'wss'],
// });

// client.subscribe('users.1').bind('user', (message) => {
//     console.log(message)
// });

// let client = new PusherJS('app-key', {
//   wsHost: '127.0.0.1',
//   wsPort: 6001,
//   forceTLS: false,
//   encrypted: true,
//   disableStats: true,
//   enabledTransports: ['ws', 'wss'],

// });

// client.subscribe('test').bind('test', (message) => {
//   console.log(message);
// });

// document.addEventListener('DOMContentLoaded', () => {
//   // listen to any DOM change and automatically perform spacing via MutationObserver()
//   pangu.autoSpacingPage();
// });
