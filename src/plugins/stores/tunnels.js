import {createStore} from "vuex";

export default createStore({
    state: {
        tunnels: [],
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
