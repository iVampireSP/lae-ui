import {createStore} from 'vuex'
import gateway from "../gateway.js";

export default createStore({
    state: {
        ips: [],
    },
    actions: {
        fetch({commit}) {
            gateway.get('ip-manager/hosts').then(res => {
                commit('set', res.data);
            })
        },
    },
    mutations: {
        set(state, data) {
            state.ips = data
        }
    },
})
