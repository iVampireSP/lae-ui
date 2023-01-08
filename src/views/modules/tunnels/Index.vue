<template>
  <div>
    <NH1>欢迎使用 ME Frp</NH1>

    <div v-if="!tunnels.length" class="text-center mt-10">
      <NP>您还没有创建隧道</NP>
      <n-spin size="large"/>

    </div>
    <n-Card v-if="tunnels.length">
      <NP>以下是您的隧道</NP>
      <div v-for="tunnel in tunnels" v-if="tunnels.length">
        <n-card :title="tunnel.name" size="small">
          <a v-if="tunnel.protocol === ('http' || 'https')" :href="tunnel.protocol + '://' + tunnel.custom_domain"
             style="color: #2080f0" target="_blank">
            {{ tunnel.protocol + "://" + tunnel.custom_domain }}
          </a>
          <span v-else>
          <span v-if="tunnel.server">
            {{ tunnel.protocol + '://' + tunnel.server.server_address + ':' + tunnel.remote_port }}
          </span>
        </span>
        </n-card>
        <n-divider dashed></n-divider>
      </div>
    </n-Card>
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

</script>

<style scoped>

</style>