import { createStore } from 'vuex';
import createPersistedstate from './persistedstate';

export default createStore({
  plugins: [createPersistedstate()],
  state: {
    token: null,
    user: {},
    mqtt: null,
  },
  mutations: {
    updateUser(state, payload) {
      state.user = payload;
    },
    updateToken(state, payload) {
      state.token = payload;
    },
    updateMqtt(state, payload) {
      state.mqtt = payload;
    },
  },
  actions: {
    updateUser(context) {
      context.commit('user.updated');
    },
    updateToken(context) {
      context.commit('token.updated');
    },
    updateMqtt(context) {
      context.commit('mqtt.updated');
    },
  },
  modules: {},
});
