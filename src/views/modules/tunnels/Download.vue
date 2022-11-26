<template>
  <router-link
    class="btn btn-outline-primary"
    :to="{ name: 'modules.tunnels' }"
  >
    返回到 隧道列表
  </router-link>

  <h3 class="mt-3">客户端下载</h3>

  <div class="overflow-auto">
    <table class="table table-hover">
    <thead>
      <tr>
        <th>类型</th>
        <th>架构</th>
        <th>链接</th>
        <th>下载</th>
      </tr>
    </thead>
    <tbody>
     <tr v-for="link in links">
        <td>{{ link.name }}</td>
        <td>{{ link.arch }}</td>
        <td>
          <code>{{ link.url }}</code>
        </td>
        <td>
          <a
            :href="link.url"
            >下载</a
          >
        </td>
      </tr>
    </tbody>
  </table>
  </div>

</template>

<script setup>
import { ref } from 'vue'

import axios from 'axios'

const links = ref({})
axios({
  method:'get',
  url:'/downloads.json'
}).then((res)=>{
  console.log(res.data.links)
  links.value = res.data
})

</script>
