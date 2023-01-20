import {createStore} from 'vuex'
import gateway from "../gateway.js";

export default createStore({
    state: {
        containers: [],
    },
    actions: {
        fetchGct({commit}) {
            // http.get('/modules/gct/hosts').then((response) => {
            //     commit('setGct', response.data)
            // })
            gateway.get('gct', 'hosts', [], (res) => {
                commit('setGct', res.data);
            })
        },
    },
    mutations: {
        addGct(state, gct) {
            state.containers.push(gct)
        },
        removeGct(state, gct) {
            state.containers.splice(state.containers.indexOf(gct), 1)
        },
        setGct(state, gct) {
            state.containers = gct
        },
        updateGct(state, gct) {
            let index = state.containers.findIndex((item) => item.id === gct.id)
            state.containers.splice(index, 1, gct)
        },
    },
})
