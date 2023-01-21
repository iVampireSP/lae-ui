import {createStore} from 'vuex'
import gateway from "../gateway.js";

export default createStore({
    state: {
        redPackets: [],
    },
    actions: {
        fetch({commit}) {
            gateway.get('red-packets', '/', []).then(res => {
                commit('set', res.data);
            })
        },
    },
    mutations: {
        set(state, gct) {
            state.redPackets = gct
        }
    },
})
