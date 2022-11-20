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


const links = ref({})

links.value = [
    {
        name: 'Windows 图形启动器',
        arch: 'amd64',
        url: 'https://download.mefrp.com/d/client/MirrorEdgeFrpSetup.exe',
    },
    {
        name: 'Windows',
        arch: 'amd64',
        url: 'http://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_windows_amd64.zip',
    },
    {
        name: 'Linux',
        arch: 'amd64',
        url: 'http://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_linux_amd64.tar.gz',
    },
];


</script>
