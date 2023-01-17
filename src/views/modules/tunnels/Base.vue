<template>
  <router-view/>

    <n-text depth="3" tag="div" class="text-center mt-5">
      <span>Aehxy 创建 / 策划 / 运营</span>
      <br/>
      <span>莱云 所有</span>
    </n-text>

</template>

<script setup>
import {
  addMenuDivider,
  addMenuOptions,
  removeAllMenuOptions,
  removeAllMenuOptionsThen
} from "../../../config/menuOptions.js";

import {NText} from "naive-ui";

import {
  AddOutline,
  CashOutline,
  ClipboardOutline,
  CloudDownloadOutline,
  ListOutline,
  ServerOutline,
} from "@vicons/ionicons5";

import {ref} from 'vue'

import tunnelsStore from "../../../plugins/stores/tunnels";
import MenuIcon from "../../../components/icons/HostMenuIcon.vue";

const tunnels = ref([])


removeAllMenuOptions()

tunnelsStore.dispatch('fetchTunnels')

function reRegisterMenu() {
  removeAllMenuOptionsThen('left', () => {
    addMenuOptions('left', 'modules.tunnels.index', '所有隧道', ListOutline)
    addMenuOptions('left', 'modules.tunnels.create', '新建隧道', AddOutline)
    addMenuOptions('left', 'modules.tunnels.concat', '配置文件', ClipboardOutline)
    addMenuOptions('left', 'modules.tunnels.status', '服务状态', ServerOutline)
    addMenuOptions('left', 'modules.tunnels.sponsor', '赞助我们', CashOutline)
    addMenuOptions('left', 'modules.tunnels.downloads', '客户端下载', CloudDownloadOutline)



    if (tunnels.value.length > 0) {
      addMenuDivider('left')

      for (let i = 0; i < tunnels.value.length; i++) {
        const tunnel = tunnels.value[i]

        // addMenuOptions('left', {
        //   name: 'modules.tunnels.show', params: {id: tunnel.host_id}
        // }, tunnel.name)

        addMenuOptions('left', {
          name: 'modules.tunnels.show', params: {id: tunnel.host_id}
        }, tunnel.name, MenuIcon, {
          host: tunnel
        })
      }
    }
  })
}

//
// subscribe
tunnelsStore.subscribe((mutation, state) => {
  if (mutation.type === 'setTunnels') {
    tunnels.value = state.tunnels
  }

  reRegisterMenu()
})

</script>