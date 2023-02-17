import {createStore} from 'vuex'
import createPersistedState from '../persistedstate'
import http from "../http.js";

export default createStore({
    plugins: [
        createPersistedState({
            key: 'user',
        }),
    ],
    state: {
        token: null,
        user: {
            id: '',
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
                exempt: false,
                discount: 0,
            },
            created_at: '',
            updated_at: '',
        },
    },
    actions: {
        updateToken({commit}, token) {
            commit('updateToken', token)
        },
        updateUser({commit}, user) {
            commit('updateUser', user)
        },
        fetch({commit}) {
            http.get('/user').then(response => {
                commit('updateUser', response.data);
            });
        },
    },
    mutations: {
        updateToken(state, token) {
            state.token = token
        },
        updateUser(state, user) {
            state.user = user
        },
    },
})
