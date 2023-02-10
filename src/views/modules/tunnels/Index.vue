<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        联合映射
      </n-text>
    </n-h1>

    <Tunnels :next="go" :tunnels="tunnels"/>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {NH1, NText} from 'naive-ui'

import router from '../../../plugins/router'

import tunnelsStore from "../../../plugins/stores/tunnels";
import Tunnels from "./components/Tunnels.vue";
import {title} from '../../../plugins/site'

title('PortIO 联合映射')

const tunnels = computed(() => {
  return tunnelsStore.state.tunnels
})

const go = (tunnel) => {
  router.push({
    name: 'modules.tunnels.show',
    params: {
      id: tunnel.host_id
    }
  })
}

</script>