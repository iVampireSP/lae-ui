import {h, ref} from "vue";
import {RouterLink} from "vue-router";
import {NIcon} from 'naive-ui'
import router from "./router.js";
import LaeLogo from "../components/LaeLogo.vue";
import SimpleMenuIcon from "../components/SimpleMenuIcon.vue";

// function renderIcon(icon) {
//     return () => h(NIcon, null, {default: () => h(icon)});
// }

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

    // 将所有 menuCollapsed.value 置为 false
    // for (let key in menuCollapsed.value) {
    //     menuCollapsed.value[key] = false;
    // }

    if (to.meta) {
        if (to.meta['collapses']) {
            for (let key in to.meta['collapses']) {
                menuCollapsed.value[to.meta['collapses'][key]] = true;
            }
        }
    }
})


const menuCollapsed = ref({
    top: false,
    left: false,
})


const menuOptions = ref({
    top: [],
    left: [],
    menu: []
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

    // let data = {
    //     label: () => h(
    //         RouterLink,
    //         {
    //             to: route_options,
    //         },
    //         {default: () => h('span', {
    //                 class: 'relative',
    //                 style: {
    //                     top: "0.5px"
    //                 }
    //             }, text)}
    //     ),
    // }


    let data = {
        label: () => h(
            RouterLink,
            {
                to: route_options,
            },
            {default: () => h('span', {}, text)}
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

    if (!icon) {
        data.icon = () => {
            return h(SimpleMenuIcon, {
                title: text,
            })
        }
    } else {
        data.icon = () => {
            return h(NIcon, icon_props, {default: () => h(icon, icon_props)});
        }
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

function removeAllMenuOptionsThen(type, func) {
    removeAllMenuOptions(type);
    func();
}

const removeMenuOption = (type, route_name) => {
    // 删除指定 key 的菜单项
    menuOptions.value[type] = menuOptions.value[type].filter((option) => option.key !== route_name + "{}");
}


menuOptions.value['menu'].push({
    label: () => h(
        RouterLink,
        {
            to: {name: 'index'},
        },
        {default: () => h(LaeLogo, {class: 'lae-logo', width: 40, height: 25})},
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
    removeMenuOption, menuCollapsed, removeAllMenuOptionsThen

}