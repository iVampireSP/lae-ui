import PusherJS from 'pusher-js'
import LaravelEcho from 'laravel-echo'

import { computed } from 'vue'

import userStore from './stores/user'

import router from './router.js'

import api from '../config/api.js'

PusherJS.logToConsole = false

let echo

function init() {
  if (userStore.state.token !== null) {
    if (router.currentRoute.value.name !== 'login') {
      echo = new LaravelEcho({
        broadcaster: 'pusher',
        key: 'app-key',
        wsHost: api.ws_host,
        wsPort: api.ws_port,
        wssPort: api.ws_port,
        forceTLS: false,
        encrypted: true,
        disableStats: true,
        enableLogging: true,
        enabledTransports: ['ws', 'wss'],

        authEndpoint: api.ws_auth_endpoint,
        auth: {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + userStore.state.token,
          },
        },
      })
    }
  }
}
init()
export default echo
