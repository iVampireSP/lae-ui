<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        监控
      </n-text>
    </n-h1>

    <n-tabs v-model:value="currentModule" animated type="line" @update:value="handleUpdateValue">
      <n-tab-pane key="lae" name="lae" tab="莱云">
        <n-table>
          <thead>
          <tr class="text-center">
            <th>类型</th>
            <th>标识</th>
            <th>权重</th>
            <th>上次心跳</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="node in nodes" class="text-center">
            <td>
              <n-text v-if="node.type === 'master'" type="success">
                主
              </n-text>
              <n-text v-if="node.type === 'slave'" depth="3">
                从
              </n-text>
              <span v-else-if="node.type === 'edge'">
                <span style="color: #ff7e15">
                  边缘
                </span>
              </span>
            </td>
            <td>{{ node.id }}</td>
            <td>
              <n-text v-if="parseInt(node.weight) === 0" type="error">
                不调度
              </n-text>
              <n-text v-else>
                {{ node.weight }}
              </n-text>
            </td>
            <td>
              <n-text v-if="Math.abs(Date.now() / 1000 - node.last_heartbeat) > 10" type="error">
                无心跳
              </n-text>
              <n-text v-else type="success">
                {{ new Date(node.last_heartbeat * 1000).toLocaleTimeString() }}
              </n-text>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-tab-pane>
      <n-tab-pane v-for="module in modules" :key="module.id" :name="module.id" :tab="module.name">
        <n-table v-if="servers[module.id].length">
          <thead>
          <tr>
            <th>名称</th>
            <th>状态</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              {{ module.name }}
            </td>
            <td>
              <n-text v-if="module.status === 'up'" type="success">
                正常
              </n-text>
              <n-text v-else-if="module.status === 'down'" type="error">
                离线
              </n-text>
              <n-text v-else depth="3">
                维护
              </n-text>
            </td>

          </tr>
          <tr v-for="server in servers[module.id]">
            <td>
              {{ server.name }}
            </td>
            <td>
              <n-text v-if="server.status === 'up'" type="success">
                正常
              </n-text>
              <n-text v-else-if="server.status === 'maintenance'" type="warning">
                维护中
              </n-text>
              <n-text v-else type="error">
                失败
              </n-text>
            </td>
          </tr>
          </tbody>
        </n-table>
        <div v-else>
          <n-empty :description="'没有检索到服务器，' + '模块状态' + getTextStatus(module.status) + '。'" class="mt-3"/>
        </div>

      </n-tab-pane>
    </n-tabs>
  </IndexLayout>
</template>

<script setup>
import {onUnmounted, ref} from "vue"
import {NEmpty, NH1, NTable, NTabPane, NTabs, NText} from "naive-ui"
import http from '../plugins/http'
import IndexLayout from "../components/menus/IndexLayout.vue";

const modules = ref([])
const nodes = ref([
  {
    id: 1,
    name: 'test',
    type: 'master',
    last_heartbeat: '1675610325'
  }
])
const currentModule = ref('lae')
const servers = ref({
  example: {}
})

function refreshModules() {
  http.get('modules').then(res => {
    modules.value = res.data
    servers.value[res.data[0].id] = {}
  })
}

function refreshNodes() {
  http.get('nodes').then(res => {

    // 根据 node.type 排序
    nodes.value = res.data.sort((a, b) => {
      if (a.type === 'master') {
        return -1
      } else if (b.type === 'master') {
        return 1
      } else if (a.type === 'slave') {
        return -1
      } else if (b.type === 'slave') {
        return 1
      } else {
        return 0
      }
    })
  })
}

function getTextStatus(status) {
  switch (status) {
    case 'up':
      return '正常'
    case 'down':
      return '离线'
    case 'maintenance':
      return '维护中'
    default:
      return '未知'
  }
}

refreshModules()
refreshNodes()

function handleUpdateValue(value) {
  if (value === 'lae') {
    refreshNodes()
    return
  }

  http.get(`servers/${value}`).then(res => {
    servers.value[value] = res.data
  })
}

const interval = setInterval(() => {
  if (currentModule.value === 'lae') {
    refreshNodes()
  } else {
    http.get(`servers/${currentModule.value}`).then(res => {
      servers.value[currentModule.value] = res.data
    })
  }
}, 5000)


onUnmounted(() => {
  clearInterval(interval)
})

</script>