import {createDiscreteApi} from "naive-ui";

const {message, notification, dialog, loadingBar} = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar"]
);

// notification.create({ title: "Notification" });

export {
    message,
    notification,
    dialog,
    loadingBar,
}