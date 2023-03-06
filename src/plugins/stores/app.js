import {createStore} from 'vuex'
import createPersistedState from '../persistedstate'
import http from "../http.js";

export default createStore({
    plugins: [
        createPersistedState({
            key: 'app',
        }),
    ],
    state: {
        display_feedback: true,
    },
    getters: {
        display_feedback: state => state.display_feedback,
    },
    mutations: {
        set_display_feedback(state, value) {
            state.display_feedback = value
        }
    },
    actions: {

    }
})
