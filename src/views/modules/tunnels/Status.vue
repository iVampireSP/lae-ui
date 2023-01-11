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
                <span>
                    {{ Humanize.fileSize(server.meta['total_traffic_in']) ?? 0 }}
                </span>
              </span>
        </td>
        <td>
            <span v-if="server.meta">
                <span>
                    {{ Humanize.fileSize(server.meta['total_traffic_out']) ?? 0 }}
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
          <n-icon color="#0e7a0d" size="large">
            <checkmark-circle-outline style="margin-top: 4px"/>
            <!--              太优雅了-->
          </n-icon>
          正常
        </td>
        <td v-else>
          <n-icon color="#d03050" size="medium">
            <close-circle-outline style="margin-top: 4px"/>
          </n-icon>
          异常
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