import {createApp} from 'vue'

import axios from 'axios';
import VueAxios from 'vue-axios';

import UserStore from './plugins/stores/user'
import HttpStore from './plugins/stores/user'
import router from './plugins/router';

import './plugins/audio';
import './plugins/gateway';

import App from './App.vue'

/** Styles **/
import './style.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'

// 注册菜单项目
import './config/menus'


// 解决样式冲突
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)

app.use(UserStore, HttpStore)
app.use(router, axios, VueAxios)


app.mount("#app");
