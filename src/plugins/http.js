import axios from 'axios';

import api from '../config/api.js';
import router from './router.js';
import user from "./stores/user.js";
import http from "./stores/http.js";

import {dialog, loadingBar} from '../utils/layout'
import {h} from "vue";

import error500 from '../views/errors/500.vue'
import error404 from '../views/errors/404.vue'
import error401 from '../views/errors/401.vue'

const baseURL = api.api;
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
        config.headers['Authorization'] = 'Bearer ' + user.state.token;

        loadingBar.start();

        return Promise.resolve(config);
    },
    (error) => {
        console.error(error);

        loadingBar.error();

        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (res) => {

        // if 20x
        if (res.status >= 200 && res.status < 300) {
            loadingBar.finish();
        } else if (res.status >= 400 && res.status < 600) {
            loadingBar.error();


        }

        return Promise.resolve(res);
    },
    (error) => {

        loadingBar.error();

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
            if (!http.state.isAlertedTooManyRequests) {
                dialog.warning({
                    title: '太频繁啦',
                    content: '休息一会吧，服务器也累了。',
                    positiveText: '好吧',
                    onPositiveClick: () => {
                        http.state.isAlertedTooManyRequests = false;
                    },
                })
                http.isAlertedTooManyRequests = true;
            }
        } else if (error.response.status === 401) {
            if (router.currentRoute.value.name !== 'auth.login') {
                if (!http.state.isAlertedToken) {
                    //
                    // dialog.error({
                    //     title: '提示',
                    //     content: 'Token 鉴权失败，请重新登录。',
                    //     positiveText: '好',
                    //     onPositiveClick: () => {
                    //         router.push({name: 'auth.login'});
                    //     },
                    //
                    // })

                    dialog.error({
                        title: '访问被禁止',
                        content: () => {
                            return h(error401)
                        },
                    });

                    http.state.isAlertedToken = true;
                }
            }
        } else if (error.response.status === 404) {
            dialog.error({
                title: '404 Not Found',
                content: () => {
                    return h(error404, {
                        show_footer: false
                    })
                },
            });
        } else if (error.response.status === 500) {
            dialog.error({
                title: '500 Internal Server Error',
                content: () => {
                    return h(error500)
                },
            });
        } else {
            if (data.length !== 0) {
                dialog.error({
                    title: '错误',
                    content: data,
                });
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
