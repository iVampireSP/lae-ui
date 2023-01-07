import {createStore} from "vuex";
import createPersistedstate from "../persistedstate";

export default createStore({
    plugins: [createPersistedstate({
        key: 'user'
    })],
    state: {
        token: null,
        user: {
            uuid: '',
            name: '',
            email: '',
            email_md5: '',
            real_name: '',
            birthday_at: '',
            balance: 0,
            banned_reason: '',
            user_group_id: '',
            user_group: {
                name: '',
            },
            created_at: '',
            updated_at: '',
        },
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
