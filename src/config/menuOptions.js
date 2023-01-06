import {h, ref} from "vue";
import {RouterLink} from "vue-router";
import {NIcon} from 'naive-ui'
import router from "../plugins/router.js";

function renderIcon(icon) {
    return () => h(NIcon, null, {default: () => h(icon)});
}

const selectedKey = ref("");
const menuInst = ref(null);
const selectAndExpand = (key) => {
    selectedKey.value = key;
    menuInst.value?.showOption(key);
};

// listen to route change
router.afterEach((to) => {
    selectAndExpand(to.name);
})


const menuOptions = ref([])

const addMenuOptions = (route_name, text, icon = null) => {
    let data = {
        label: () => h(
            RouterLink,
            {
                to: {
                    name: route_name
                }
            },
            {default: () => text}
        ),
        key: route_name,
    }

    // if icon is not null, add icon
    if (icon !== null) {
        data.icon = renderIcon(icon)
    }

    menuOptions.value.push(data)
}

const addMultiMenuOptions = (options) => {
    options.forEach((option) => {
        // if it has children, add children
        if (option.children) {
            // add
        }
    })
}

export {
    menuOptions,
    selectAndExpand,
    selectedKey,
    menuInst,
    addMenuOptions
}