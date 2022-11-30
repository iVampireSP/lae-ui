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
            <th>元数据</th>
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

            <td>
              <span v-if="server.meta.length !== 0">
                <a @click="showMeta(server.meta)" class="cursor-pointer"
                  >显示</a
                >
              </span>
              <span v-else> 无 </span>
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

  <!-- model to display meta -->
  <div
    class="modal fade"
    id="metaModal"
    tabindex="-1"
    aria-labelledby="metaModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="metaModalLabel">元数据</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div
          class="modal-body overflow-auto p-0  rounded"
        >
          <table class="table table-striped table-hover">
            <thead>
              <tr>
                <th>键</th>
                <th>值</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(value, key) in meta" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import http from '../api/http'
  import echo from '../plugins/echo'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { Modal } from 'bootstrap'

  const servers = ref([])
  const modules = ref([])

  const meta = ref([])

  http.get('/servers').then((res) => {
    servers.value = res.data
  })

  http.get('/modules').then((res) => {
    modules.value = res.data
  })

  function showMeta(meta_data) {
    meta.value = meta_data
    const myModal = new Modal(document.getElementById('metaModal'))
    myModal.show()
  }

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
