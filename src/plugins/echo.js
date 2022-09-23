import PusherJS from 'pusher-js';
import LaravelEcho from 'laravel-echo';

import store from './store';
import router from './router';

import api from '../config/api';

PusherJS.logToConsole = false;

let echo;

function init() {
  //   try {
  if (store.state.token !== null) {
    if (router.currentRoute.value.name !== 'login') {
      echo = new LaravelEcho({
        broadcaster: 'pusher',
        key: 'app-key',
        wsHost: api.ws_host,
        wsPort: api.ws_port,
        forceTLS: false,
        encrypted: true,
        disableStats: true,
        enableLogging: true,
        enabledTransports: ['ws', 'wss'],

        authEndpoint: api.ws_auth_endpoint,
        auth: {
          headers: {
            Accept: 'application/json',
            Authorization: 'Bearer ' + store.state.token,
          },
        },
      });

      //   echo.private('users.1').notification('user', (e) => {
      //     console.log(e);
      //   });

      // echo.listen('servers').notification('user', (e) => {
      //   console.log(e);
      // });
    }
  }
}

init();
export default echo;
