<template>
  <div>
    <h3>服务器列表</h3>

    <p>查看我们的服务器运行状态</p>

    <div class="overflow-scroll">
      <table class="table">
        <thead>
          <tr>
            <th>服务</th>
            <th>名称</th>
            <th>状态</th>
            <th>状态更新时间</th>
            <th>设立时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="server in servers">
            <td>{{ server.module.name }}</td>
            <td>{{ server.name }}</td>
            <td>
              <span v-if="server.status == 'up'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i> &nbsp;运行中</span
                >
              </span>
              <span v-else-if="server.status == 'maintenance'">
                <span class="text-warning">
                  <i class="bi bi-wrench-adjustable"></i>
                  &nbsp;维护中
                </span>
              </span>
              <span v-else>
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp;暂时不可用
                </span>
              </span>
            </td>
            <td>{{ new Date(server.updated_at).toLocaleString() }}</td>
            <td>{{ new Date(server.created_at).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import http from '../api/http'
  import { ref, onMounted, onUnmounted } from 'vue'

  const servers = ref([])

  function refresh() {
    http.get('/servers').then((res) => {
      servers.value = res.data
    })
  }

  onMounted(() => {
    refresh()
    const interval = setInterval(refresh, 1000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
</script>
