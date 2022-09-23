<template>
  <div>
    <h3>服务器列表</h3>

    <p>查看我们的服务器运行状态</p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th>服务</th>
            <th>名称和状态</th>
            <!-- <th>检查时间</th> -->
            <!-- <th>设立时间</th> -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="server in servers">
            <td>{{ server.module.name }}</td>
            <td>
              <span v-if="server.status == 'up'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i>
                  <!-- 运行中 -->
                </span>
              </span>
              <span v-else-if="server.status == 'maintenance'">
                <span class="text-warning">
                  <i class="bi bi-wrench-adjustable"></i>
                  <!-- 维护中 -->
                </span>
              </span>
              <span v-else>
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  <!-- 不可用 -->
                </span>
              </span>
              &nbsp; {{ server.name }}
            </td>
            <!-- <td>{{ new Date(server.updated_at).toLocaleString() }}</td> -->
            <!-- <td>{{ new Date(server.created_at).toLocaleString() }}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import http from '../api/http'
  import echo from '../plugins/echo'
  import { ref, onMounted, onUnmounted } from 'vue'

  const servers = ref([])

  http.get('/servers').then((res) => {
    servers.value = res.data
  })

  onMounted(() => {
    echo.channel('servers').listen('.servers', (e) => {
      servers.value = e.data
    })
  })

  onUnmounted(() => {
    echo.leave('servers')
  })
</script>