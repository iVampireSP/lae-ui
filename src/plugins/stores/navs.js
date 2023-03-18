import {createStore} from "vuex";
import createPersistedState from "../persistedstate.js";

export default createStore({
    plugins: [
        createPersistedState({
            key: 'navs',
        }),
    ],
    state: {
        navs: [],
    },
    mutations: {
        addNav(state, nav) {
            state.navs.push(nav);
        },
        removeNav(state, nav) {
            state.navs.splice(state.navs.indexOf(nav), 1);
        }
    }
});
