import {createStore} from "vuex";
import http from "../http.js";

export default createStore({
    state: {
        tunnels: [],
    },
    actions: {
        fetchTunnels({commit}) {
            http.get('/modules/frp/hosts').then(response => {
                commit('setTunnels', response.data);
            });
        },
    },
    mutations: {
        addTunnel(state, tunnel) {
            state.tunnels.push(tunnel);
        },
        removeTunnel(state, tunnel) {
            state.tunnels.splice(state.tunnels.indexOf(tunnel), 1);
        },
        setTunnels(state, tunnels) {
            state.tunnels = tunnels;
        },
        updateTunnel(state, tunnel) {
            let index = state.tunnels.findIndex(t => t.id === tunnel.id);
            state.tunnels[index] = tunnel;
        }
    }
});
