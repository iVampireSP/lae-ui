<template>
  <router-view></router-view>
</template>

<script setup>
import {addMenuDivider, addMenuOptions} from "../../../config/menuOptions.js";

import {AddOutline, ListOutline} from "@vicons/ionicons5";
import http from "../../../plugins/http.js";

addMenuOptions('left', 'modules.tunnels.index', '所有隧道', ListOutline)
addMenuOptions('left', 'modules.tunnels.create', '新建隧道', AddOutline)


http.get('/modules/frp/hosts').then((res) => {

  if (res.data.length > 0) {
    addMenuDivider('left')

    for (let i = 0; i < res.data.length; i++) {
      const tunnel = res.data[i]

      addMenuOptions('left', {

        name: 'modules.tunnels.show', params: {id: tunnel.host_id}
      }, tunnel.name)
    }

  }
})

</script>

<style scoped>

</style>