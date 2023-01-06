import {createApp} from 'vue'

import axios from 'axios';
import VueAxios from 'vue-axios';

import store from './plugins/store'
import router from './plugins/router';

import App from './App.vue'

/** Styles **/
import './style.css'
// 通用字体
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'


// 解决央视冲突
const meta = document.createElement('meta')
meta.name = 'naive-ui-style'
document.head.appendChild(meta)

const app = createApp(App)

app.use(store)
app.use(router, axios, VueAxios)


app.mount("#app");
