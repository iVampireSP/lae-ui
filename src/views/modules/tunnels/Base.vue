<template>
  <router-view></router-view>
</template>

<script setup>
import {addMenuDivider, addMenuOptions, removeAllMenuOptions} from "../../../config/menuOptions.js";

import {AddOutline, ListOutline} from "@vicons/ionicons5";
import http from "../../../plugins/http.js";

import {ref} from 'vue'

import tunnelsStore from "../../../plugins/stores/tunnels";

const tunnels = ref([])

http.get('/modules/frp/hosts').then((res) => {
  tunnels.value = res.data
  tunnelsStore.state.tunnels = tunnels.value

  reRegisterMenu()
})

function reRegisterMenu() {
  removeAllMenuOptions('left')

  addMenuOptions('left', 'modules.tunnels.index', '所有隧道', ListOutline)
  addMenuOptions('left', 'modules.tunnels.create', '新建隧道', AddOutline)

  if (tunnels.value.length > 0) {
    addMenuDivider('left')

    for (let i = 0; i < tunnels.value.length; i++) {
      const tunnel = tunnels.value[i]

      addMenuOptions('left', {

        name: 'modules.tunnels.show', params: {id: tunnel.host_id}
      }, tunnel.name)
    }
  }
}

// subscribe
tunnelsStore.subscribe((mutation, state) => {
  if (mutation.type === 'setTunnels') {
    tunnels.value = state.tunnels
    reRegisterMenu()
  }
  if (mutation.type === 'addTunnel') {
    reRegisterMenu()
  }
})

</script>

<style scoped>

</style>