import {CloudOutline, GameControllerOutline} from "@vicons/ionicons5";

import {addMenuOptions} from "./menuOptions.js";


const modules = [
    {
        id: "tunnels",
        name: "镜缘映射",
        route: "modules.tunnels.index",
        icon: CloudOutline
    },
    {
        id: "gct",
        name: "游戏容器",
        route: "modules.gct.index",
        icon: GameControllerOutline
    },
    // {
    //     id: "user-mqtt",
    //     name: "消息队列",
    //     route: "modules.user-mqtt"
    // }
]

for (let i = 0; i < modules.length; i++) {
    addMenuOptions('top', modules[i].route, modules[i].name, modules[i].icon);
}