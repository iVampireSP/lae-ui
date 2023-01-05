<template>
  <router-link class="btn btn-outline-primary" :to="{ name: 'modules.tunnels' }">
    返回到 隧道列表
  </router-link>
  
  <h3 class="mt-3">整合配置文件</h3>

  <div class="mt-3"></div>
  <select class="form-control" v-model="selectedServer" @change="getTunnels()">
    <option value="0" selected>先选择一个服务器</option>
    <option v-for="server in servers" :value="server.id">
      {{ server.name }}
    </option>
  </select>

  <h3 class="mt-4">配置文件</h3>
  
  <textarea class="w-100 form-control mt-3 cursor-pointer config-file" rows="50" readonly data-bs-toggle="tooltip" title="点击我复制配置文件" @click="copy()">{{ all_config }}</textarea>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../../../api/http'

  const servers = ref([])

  const selectedServer = ref('0')

  const tunnels = ref([])

  const all_config = ref('请先在上面选择服务器。')

  http.get('/modules/frp/servers').then((res) => {
    servers.value = res.data
  })
  
  function getTunnels() {
    http
      .get(
        '/modules/frp/hosts?with_config=1&&server_id=' + selectedServer.value
      )
      .then((res) => {
        if (res.data.length > 0) {
          tunnels.value = res.data
          all_config.value = res.data[0].config.server + '\n\n'

          res.data.forEach((tunnel) => {
            all_config.value += `
# ${tunnel.name} 在 ${tunnel.server.name} 上
# 请在截图时打码下一行信息。
${tunnel.config.client}
`
          })
        } else {
            all_config.value = '这个服务器下没有隧道。'
        }
      })
  }

  function copy() {
    if (all_config.value != "请先在上面选择服务器。") {
      navigator.clipboard.writeText(all_config.value)
    }
  }
</script>