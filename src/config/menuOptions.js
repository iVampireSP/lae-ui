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


const menuOptions = ref({
    top: [],
    left: [],
})

const validateIfDuplicate = (type, route_name) => {
    if (type === "top") {
        return menuOptions.value.top.find((option) => option.key === route_name);
    } else if (type === "left") {
        return menuOptions.value.left.find((option) => option.key === route_name);
    }
}

const addMenuOptions = (type, route_name, text, icon = null) => {

    if (validateIfDuplicate(type, route_name)) {
        console.warn(`[menuOptions] ${type} 菜单项目注册失败，因为有重复的名称: ${route_name}`);
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

    if (type === "top") {
        menuOptions.value.top.push(data)
    } else if (type === "left") {
        menuOptions.value.left.push(data)
    }
}

const addMultiMenuOptions = (type, options) => {
    options.forEach((option) => {
        // if it has children, add children
        if (option.children) {
            // add multi
            addMultiMenuOptions(type, option.children);
        } else {
            addMenuOptions(type, option.route_name, option.text, option.icon)
        }
    })
}

const removeAllMenuOptions = (type) => {
    menuOptions.value[type] = [];
}

export {
    menuOptions,
    selectAndExpand,
    selectedKey,
    menuInst,
    addMenuOptions,
    addMultiMenuOptions,
    removeAllMenuOptions
}