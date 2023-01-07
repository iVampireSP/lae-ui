import {h, ref} from "vue";
import {RouterLink} from "vue-router";
import {NIcon} from 'naive-ui'
import router from "../plugins/router.js";

function renderIcon(icon) {
    return () => h(NIcon, null, {default: () => h(icon)});
}

const selectedKey = ref("");
const menuInst = ref(null);
const selectAndExpand = (route) => {
    if (route.params) {
        selectedKey.value = route.name + JSON.stringify(route.params);
    } else {
        selectedKey.value = route.name;
    }
    menuInst.value?.showOption(selectedKey.value);
};

// listen to route change
router.afterEach((to) => {
    selectAndExpand(to);
})


const menuOptions = ref({
    top: [],
    left: []
})

const validateIfDuplicate = (type, route_name) => {
    return menuOptions.value[type].find((option) => option.key === route_name);
}

const addMenuOptions = (type, route_options, text, icon = null) => {

    // if it is a string, convert it to object
    if (typeof route_options === 'string') {
        route_options = {name: route_options}
    }

    if (validateIfDuplicate(type, route_options.name)) {
        console.warn(`[menuOptions] 忽略 ${type} 菜单项目，因为有重复的名称: ${route_options.name}`);
        return;
    }

    let data = {
        label: () => h(
            RouterLink,
            {
                to: route_options
            },
            {default: () => text}
        ),
    }

    if (route_options.params) {

        let params = route_options.params;

        // 如果有数字，就转换成字符串
        for (let key in params) {
            if (typeof params[key] === 'number') {
                params[key] = params[key].toString();
            }
        }

        data.key = route_options.name + JSON.stringify(params);

        // console.log('注册 key', data.key)

    } else {
        data.key = route_options.name + "{}";
    }

    if (icon !== null) {
        data.icon = renderIcon(icon)
    }

    menuOptions.value[type].push(data);
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

const addMenuDivider = (type) => {
    menuOptions.value[type].push({
        type: 'divider',
    })
}

const removeAllMenuOptions = (type) => {
    menuOptions.value[type] = [];
}

menuOptions.value['top'].push({
    label: () => h(
        RouterLink,
        {
            to: {name: 'index'},
        },
        {default: () => h('span', {class: 'lae-logo', width: 40, height: 25})},
    ),
    key: 'index',
});


export {
    menuOptions,
    selectAndExpand,
    selectedKey,
    menuInst,
    addMenuOptions,
    addMultiMenuOptions,
    removeAllMenuOptions,
    addMenuDivider
}