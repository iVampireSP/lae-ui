<template>
  <router-view></router-view>
</template>

<script setup>
import {
  addMenuDivider,
  addMenuOptions,
  removeAllMenuOptions,
  removeAllMenuOptionsThen
} from "../../../config/menuOptions.js";

import {AddOutline, ClipboardOutline, ListOutline} from "@vicons/ionicons5";
import http from "../../../plugins/http.js";

import {ref} from 'vue'

import tunnelsStore from "../../../plugins/stores/tunnels";
import TextAvatar from "../../../components/icons/TextAvatar.vue";

const tunnels = ref([])


removeAllMenuOptions()
// reRegisterMenu()

http.get('/modules/frp/hosts').then((res) => {
  tunnels.value = res.data
  tunnelsStore.state.tunnels = tunnels.value

  reRegisterMenu()
})


function reRegisterMenu() {
  removeAllMenuOptionsThen('left', () => {
    addMenuOptions('left', 'modules.tunnels.index', '所有隧道', ListOutline)
    addMenuOptions('left', 'modules.tunnels.create', '新建隧道', AddOutline)
    addMenuOptions('left', 'modules.tunnels.concat', '整合配置', ClipboardOutline)

    if (tunnels.value.length > 0) {
      addMenuDivider('left')

      for (let i = 0; i < tunnels.value.length; i++) {
        const tunnel = tunnels.value[i]


        // menuOptions.value.left.push({
        //   label: () => h(
        //       RouterLink,
        //       {
        //         to: {name: 'index'},
        //       },
        //       {default: () => h('span', {class: 'lae-logo mt-1', width: 40, height: 25})},
        //   ),
        //   key: 'index',
        // })
        // default: () => h(NAvatar, {
        //     style: {
        //       'background-color': 'red',
        //     }
        //   },)
        //


        addMenuOptions('left', {
          name: 'modules.tunnels.show', params: {id: tunnel.host_id}
        }, tunnel.name, TextAvatar, {
          text: tunnel.name[0],
          color: 'yellow',
          backgroundColor: 'red',
        })
        //
        // addMenuOptions('left', {
        //   name: 'modules.tunnels.show', params: {id: tunnel.host_id}
        // }, tunnel.name)

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

  // reRegisterMenu()
})

</script>

<style scoped>

</style>