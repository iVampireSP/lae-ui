import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/css/bootstrap-dark.min.css';
import './style.css';

import { createApp } from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
// import { useRoute } from 'vue-router';

import App from './App.vue';

import router from './plugins/router';
import store from './plugins/store';

const app = createApp(App);

// app.config.globalProperties.$http = http;
// app.config.globalProperties.$route = useRoute();

// 引入 http

app.use(router, store, VueAxios, axios);

app.provide('axios', app.config.globalProperties.axios);
app.mount('#app');
