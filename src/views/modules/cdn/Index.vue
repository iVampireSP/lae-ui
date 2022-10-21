<template>
  <div>
    <h3>内容分发网络</h3>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">域名</th>
            <th scope="col">状态</th>
            <th scope="col">修改时间</th>
            <th scope="col">创建时间</th>
            <th scope="col">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="host in hosts">
            <td>{{ host.id }}</td>
            <td>{{ host.name }}</td>
            <td>
              <span>
                <span v-if="host.status == 'running'" class="badge bg-success"
                  >正常</span
                >
                <span
                  v-else-if="host.status == 'pending'"
                  class="badge bg-warning"
                  >等待中</span
                >
                <span
                  v-else-if="host.status == 'deleting'"
                  class="badge bg-danger"
                  >删除中</span
                >
                <span
                  v-else-if="host.status == 'suspended'"
                  class="badge bg-danger"
                  >已暂停</span
                >
                <span v-else class="badge bg-secondary">未知</span>
              </span>
            </td>
            <td>{{ new Date(host.updated_at).toLocaleString() }}</td>
            <td>{{ new Date(host.created_at).toLocaleString() }}</td>
            <td>
              <router-link
                :to="{ name: 'modules.cdn.show', params: { id: host.id } }"
                >查看</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <div class="btn-group" role="group">
      <router-link
        type="button"
        class="btn btn-outline-primary"
        :to="{ name: 'modules.cdn.create' }"
        >新建</router-link
      >
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  //   import { useRoute } from 'vue-router'
  import http from '../../../api/http'
  //   import route from '../../../plugins/router'

  const hosts = ref([])

  const passwordChanged = ref('')
  const password = ref('')

  // 随机生成字符串
  //   function randomString(len) {
  //     len = len || 32
  //     var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  //     var maxPos = $chars.length
  //     var pwd = ''
  //     for (var i = 0; i < len; i++) {
  //       pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  //     }
  //     return pwd
  //   }

  //   function toRoute(id) {
  //     // key.value = Math.round(Math.random() * 1000)
  //     route.push({ name: 'modules.gct.show', params: { id: id } })
  //     // key.value = Math.round(Math.random() * 1000)
  //   }

  http.get('/modules/cdn/hosts').then((res) => {
    hosts.value = res.data
  })
</script>
