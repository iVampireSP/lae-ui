import {h, ref} from "vue";
import {RouterLink} from "vue-router";
import {NIcon} from 'naive-ui'
import router from "../plugins/router.js";

const selectedKey = ref("");
const menuInst = ref(null);
const selectAndExpand = (route) => {
    if (route.params) {
        selectedKey.value = route.name + JSON.stringify(route.params);

        console.log("selectAndExpand", selectedKey.value);

        // 检测 route key 里面是否有 selectedKey，如果有，就打印出来
        if (selectedKey.value.includes("selectedKey")) {
            console.warn("has selectedKey", selectedKey.value);
        }
    } else {
        selectedKey.value = route.name;
    }
    menuInst.value?.showOption(selectedKey.value);
};

// listen to route change
router.afterEach((to) => {
    selectAndExpand(to);

    // 将所有 menuCollapsed.value 置为 false
    for (let key in menuCollapsed.value) {
        menuCollapsed.value[key] = false;
    }

    if (to.meta) {
        if (to.meta['collapses']) {
            for (let key in to.meta['collapses']) {
                menuCollapsed.value[to.meta['collapses'][key]] = true;
            }
        }
    }
})


const menuOptions = ref({
    top: [],
    left: [],
    menu: []
})

const menuCollapsed = ref({
    top: false,
    left: false,
})

const validateIfDuplicate = (type, route_name) => {
    return menuOptions.value[type].find((option) => option.key === route_name);
}

const addMenuOptions = (type, route_options, text, icon = null, icon_props = {}) => {

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

    // data.key = routeOptionsStringify(route_options);

    if (route_options.params) {
        data.key = route_options.name + JSON.stringify(route_options.params);
    } else {
        data.key = route_options.name + "{}";
    }

    console.log("addMenuOptions", data.key);

    if (icon !== null) {
        data.icon = () => {
            return h(NIcon, icon_props, {default: () => h(icon, icon_props)});
        }
    }

    menuOptions.value[type].push(data);
}


// rubbish code for register menu
const addOptions = (type, route_options = {}, element, props, children) => {
    let data = {
        label: () => h(
            element,
            props,
            children
        ),
    }

    data.key = routeOptionsStringify(route_options);


    menuOptions.value[type].push(data);
}

function routeOptionsStringify(route_options) {
    if (route_options.params) {
        return route_options.name + JSON.stringify(route_options.params);
    } else {
        return route_options.name + "{}";
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

const addMenuDivider = (type) => {
    menuOptions.value[type].push({
        type: 'divider',
    })
}

const removeAllMenuOptions = (type) => {
    menuOptions.value[type] = [];
}

const removeMenuOption = (type, route_name) => {
    // 删除指定 key 的菜单项
    menuOptions.value[type] = menuOptions.value[type].filter((option) => option.key !== route_name + "{}");
}

function removeAllMenuOptionsThen(type, func) {
    removeAllMenuOptions(type);
    func();
}

menuOptions.value['menu'].push({
    label: () => h(
        RouterLink,
        {
            to: {name: 'index'},
        },
        {default: () => h('span', {class: 'lae-logo mt-1', width: 40, height: 25})},
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
    addMenuDivider,
    removeMenuOption,
    menuCollapsed,
    removeAllMenuOptionsThen,
    addOptions
}