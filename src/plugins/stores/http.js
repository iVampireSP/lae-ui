import {createStore} from "vuex";

export default createStore({
    state: {
        isAlertedToken: false,
        isAlertedTooManyRequests: false,
    }
});
