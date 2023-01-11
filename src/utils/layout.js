import {createDiscreteApi, darkTheme, lightTheme, useOsTheme} from "naive-ui";

import {computed} from "vue";

const osTheme = useOsTheme();
const configProviderProps = computed(() => ({
    theme: osTheme.value === 'light' ? lightTheme : darkTheme,
}))

const {message, notification, dialog, loadingBar} = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar"], {
        configProviderProps: configProviderProps
    }
);

export {message, notification, dialog, loadingBar, osTheme}