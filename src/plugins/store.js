import { createStore } from "vuex";
import createPersistedstate from "./persistedstate";

export default createStore({
    plugins: [createPersistedstate()],
    state: {
        token: null,
        user: {
        },
    },
    mutations: {
        updateUser(state, payload) {
            state.user = payload;
        },
        updateToken(state, payload) {
            state.token = payload;
        },
    },
    actions: {
        updateUser(context) {
            context.commit("user.updated");
        },
        updateToken(context) {
            context.commit("token.updated");
        },
    },
    modules: {},
});
