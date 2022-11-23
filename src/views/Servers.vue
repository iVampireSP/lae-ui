<template>
  <div>
    <h3>运行状态</h3>

    <p>查看我们的服务器运行状态</p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th>服务</th>
            <th>名称和状态</th>
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
          </tr>
        </tbody>
      </table>
    </div>

    <h3 class="mt-3">模块列表</h3>
    <p>提供服务的模块</p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th>服务</th>
            <th>名称和状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="module in modules">
            <td>{{ module.name }}</td>
            <td>
              <span v-if="module.status == 'up'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i>
                  &nbsp; 正常
                </span>
              </span>
              <span v-else-if="module.status == 'maintenance'">
                <span class="text-warning">
                  <i class="bi bi-wrench-adjustable"></i>
                  &nbsp; 维护中
                </span>
              </span>
              <span v-else>
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp; 不可用
                </span>
              </span>
            </td>
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
  const modules = ref([])

  http.get('/servers').then((res) => {
    servers.value = res.data
  })

  http.get('/modules').then((res) => {
    modules.value = res.data
  })

  onMounted(() => {
    echo.channel('servers').listen('.servers', (e) => {
      servers.value = e.data

      http.get('/modules').then((res) => {
        modules.value = res.data
      })
    })
  })

  onUnmounted(() => {
    echo.leave('servers')
  })
</script>
