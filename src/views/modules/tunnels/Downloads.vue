<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        客户端下载
      </n-text>
    </n-h1>
    <n-table :single-line="false" >
      <thead>
        <tr class="text-center">
          <th>名称</th>
          <th>架构</th>
          <th>下载</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" class="text-center">
          <td> {{ item.name }}</td>
          <td> {{ item.arch }}</td>
          <td>
            <n-a :href="item.url" :title="item.name + ' 下载'" target="_blank">下载</n-a>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>

<script setup>
import {NA, NH1, NTable, NText} from 'naive-ui'
import {ref} from 'vue'

const items = ref([
      {
        "name": "Windows Frpc",
        "arch": "amd64",
        "url": "https://download.mefrp.com/d/release/MirrorEdgeFrp_0.46.0_beta_windows_amd64.zip"
      },
      {
        "name": "Windows Python 图形化启动器",
        "arch": "amd64",
        "url": "https://download.mefrp.com/d/alidrive/Mirror_Edge_Frp_Python_Win.zip"
      },
      {
        "name": "Windows C# .NET 图形化启动器",
        "arch": "amd64",
        "url": "http://124.223.35.239/download/mefrp/"
      },
      {
        "name": "Linux Frpc",
        "arch": "amd64",
        "url": "https://download.mefrp.com/d/release/MirrorEdgeFrp_0.46.0_beta_linux_amd64.tar.gz"
      },
      {
        "name": "更多版本 Frpc",
        "arch": "any",
        "url": "https://download.mefrp.com/release/"
      }

    ]
)

</script>

<style scoped>

</style>