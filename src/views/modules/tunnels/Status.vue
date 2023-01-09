<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        服务器状态
      </n-text>
    </n-h1>
    <n-table :single-line="false" striped style="vertical-align: middle">
      <thead>
        <tr>
          <th>名称</th>
          <th>状态</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in servers">
          <td>{{ server.name }}</td>
          <td v-if="server.status === 'up'">
            <n-icon size="20" color="#0e7a0d">
              <checkmark-circle-outline />
            </n-icon>
            正常
          </td>
          <td v-else>
            <n-icon size="20" color="#d03050">
              <close-circle-outline />
            </n-icon>
            异常
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup>
import {NH1, NText, NTable, NIcon} from 'naive-ui'
import {CheckmarkCircleOutline, CloseCircleOutline} from '@vicons/ionicons5'
import {ref} from "vue";
import http from "../../../plugins/http.js";

const servers = ref([])

http.get('/servers').then((res) => {
  servers.value = res.data.map(server => {
    // 只返回 frp 服务器
    if (server['module']['id'] === 'frp') {
      return server
    }
  })

  // 过滤掉空值
  servers.value = servers.value.filter(server => {
    return server !== undefined
  })
})

</script>