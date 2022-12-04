import api from '../config/api';
import store from './store';
import http from '../api/http';
import mqtt from 'mqtt/dist/mqtt.min';

const current_options = store.state.mqtt;

let options = {
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 0,
  clientId: 'web-ui-' + Math.random().toString(16).substr(2, 8),
};

async function init() {
  let data = {};
  let res = await http.get('./modules/user-mqtt/hosts');
  data = res.data;

  if (data.length === 0) {
    return;
  }

  data = data[0];

  options.username = 'user-mqtt.' + data.host_id;

  options.password = data.password;

  options.host_id = data.host_id;

  store.commit('updateMqtt', {
    username: options.username,
    password: options.password,
    host_id: options.host_id,
  });

  location.reload();
}

if (current_options == null) {
  console.log('init mqtt');
  init();
} else {
  options.username = current_options.username;
  options.password = current_options.password;
  options.host_id = current_options.host_id;
}

let client = mqtt.connect(api.mqtt, options);

let baseTopic = 'user-mqtt/' + options.host_id ?? null;

export { client, baseTopic };
