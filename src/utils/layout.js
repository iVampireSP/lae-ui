import {createDiscreteApi, darkTheme, lightTheme, useOsTheme} from "naive-ui";

import {computed} from "vue";

const osThemeRef = useOsTheme();
const configProviderProps = computed(() => ({
    theme: osThemeRef.value === "light" ? lightTheme : darkTheme
}));

const {message, notification, dialog, loadingBar} = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar"], {
        configProviderProps: configProviderProps
    }
);

export {
    message,
    notification,
    dialog,
    loadingBar,
}