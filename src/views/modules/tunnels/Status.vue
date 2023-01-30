<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        服务器状态
      </n-text>
    </n-h1>
    <n-table :single-line="false" striped>
      <thead>
      <tr class="text-center">
        <th>名称</th>
        <th>入网</th>
        <th>出网</th>
        <th>客户端数量</th>
        <th>状态</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="server in servers" class="text-center">
        <td>{{ server.name }}</td>
        <td>
            <span v-if="server.meta">
              <span v-if="Humanize.fileSize(server.meta['total_traffic_in']) !== '0null'">
                {{ Humanize.fileSize(server.meta['total_traffic_in']) }}
              </span>
              <span v-else>
                0 GB
            </span>
            </span>
        </td>
        <td>
            <span v-if="server.meta">
              <span v-if="Humanize.fileSize(server.meta['total_traffic_out']) !== '0null'">
                {{ Humanize.fileSize(server.meta['total_traffic_out']) }}
              </span>
              <span v-else>
                0 GB
              </span>
            </span>
        </td>
        <td>
            <span v-if="server.meta">
              <span v-if="server.meta['client_counts']">
                  {{ server.meta['client_counts'] }} 个
              </span>
              <span v-else>
                暂无
              </span>
            </span>
        </td>
        <td v-if="server.status === 'up'">
          <n-text type="success">
            <n-icon size="20">
              <checkmark-circle-outline style="margin-top: 5px"/>
            </n-icon>
            正常
          </n-text>
        </td>
        <td v-else>
          <n-text type="error">
            <n-icon size="20">
              <close-circle-outline style="margin-top: 5px"/>
            </n-icon>
            异常
          </n-text>
        </td>
      </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup>
import {NH1, NIcon, NTable, NText} from 'naive-ui'
import {CheckmarkCircleOutline, CloseCircleOutline} from '@vicons/ionicons5'
import {ref} from "vue";
import http from "../../../plugins/http.js";

import Humanize from "humanize-plus";

const servers = ref([])

http.get('/servers/frp').then((res) => {
  servers.value = res.data

  // 过滤掉空值
  servers.value = servers.value.filter(server => {
    return server !== undefined
  })
})

</script>