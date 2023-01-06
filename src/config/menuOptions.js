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
    // 检测 key 是否重复
    if (menuOptions.value.find((option) => option.key === route_name)) {
        return;
    }

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

    if (icon !== null) {
        data.icon = renderIcon(icon)
    }

    menuOptions.value.push(data)
}

const addMultiMenuOptions = (options) => {
    options.forEach((option) => {
        // if it has children, add children
        option.route_name = undefined;
        if (option.children) {
            addMenuOptions(option.route_name, option.text, option.icon)
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