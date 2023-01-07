import {createStore} from "vuex";
import createPersistedstate from "../persistedstate";

export default createStore({
    plugins: [createPersistedstate({
        key: 'http'
    })],
    state: {
        isAlertedToken: false,
    }
});
