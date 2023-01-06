import {createStore} from "vuex";
import createPersistedstate from "../persistedstate";

export default createStore({
    plugins: [createPersistedstate()],
    state: {
        token: null,
        user: {},
    },
    actions: {
        updateToken({commit}, token) {
            commit("updateToken", token);
        },
        updateUser({commit}, user) {
            commit("updateUser", user);
        }
    },
    mutations: {
        updateToken(state, token) {
            state.token = token;
        },
        updateUser(state, user) {
            state.user = user;
        }
    }
});
