<template>
  <div>
    <NH1>欢迎使用 ME Frp</NH1>

    <NP>以下是您的隧道</NP>

    <div v-for="tunnel in tunnels">
      <n-card :title="tunnel.name" size="small">
        <a v-if="tunnel.protocol === ('http' || 'https')" target="_blank" :href="tunnel.protocol + '://' + tunnel.custom_domain">
          {{ tunnel.protocol + "://" + tunnel.custom_domain }}
        </a>
        <span v-else>
          {{ tunnel.protocol + "://" + tunnel.server.server_address + ":" + tunnel.remote_port.toString() }}
        </span>
      </n-card>
      <n-divider dashed></n-divider>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { NCard, NH1, NP, NDivider } from 'naive-ui'

// import http from "../../../plugins/http";

import tunnelsStore from "../../../plugins/stores/tunnels";

const tunnels = computed(() => {
  return tunnelsStore.state.tunnels
})

// const isMobile = useIsMobile()
</script>

<style scoped>

</style>