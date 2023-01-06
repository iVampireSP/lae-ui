import {createStore} from "vuex";
import createPersistedstate from "../persistedstate";

export default createStore({
    plugins: [createPersistedstate()],
    state: {
        isAlertedToken: false,
    }
});
