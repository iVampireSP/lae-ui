<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary"> 客户端下载</n-text>
    </n-h1>
    <n-data-table
        :columns="headers"
        :data="items"
        :filterOptions="filter_options"
        :render-cell="render"
    />
    <!-- TODO: 完成表格筛选 -->
    <!-- @update:filters="archFilter" -->
    <!-- <n-table :single-line="false" >
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
    </n-table> -->
  </div>
</template>

<script setup>
import {NA, NDataTable, NH1, NText} from 'naive-ui'
import {h, ref} from 'vue'

const headers = [
  {
    title: '名称',
    key: 'name',
  },
  {
    title: '架构',
    key: 'arch',
    filter() {
    },
  },
  {
    title: '下载',
    key: 'url',
  },
]

const version = [
  {
    name: 'Windows Frpc',
    arch: 'amd64',
    url: 'https://io.ivampiresp.com/Software/MEFrpRelease/MirrorEdgeFrp_0.46.0_beta_windows_amd64.zip',
  },
  {
    name: 'Windows Python 图形化启动器',
    arch: 'amd64',
    url: 'https://io.ivampiresp.com/Software/MEFrpRelease/Mirror_Edge_Frp_Python_Win.zip',
  },
  {
    name: 'Windows C# .NET 图形化启动器',
    arch: 'amd64',
    url: 'http://124.223.35.239/download/mefrp/',
  },
  {
    name: 'Linux Frpc',
    arch: 'amd64',
    url: 'https://io.ivampiresp.com/Software/MEFrpRelease/MirrorEdgeFrp_0.46.0_beta_linux_amd64.tar.gz',
  },
  {
    name: '更多版本 Frpc',
    arch: 'any',
    url: 'https://io.ivampiresp.com/Software/MEFrpRelease',
  },
]

const items = ref(version)

const render = (value) => {
  // console.log(value, typeof (value))
  if (value && value.startsWith('http'))
    return h(NA, {href: value, target: '_blank'}, () => {
      return '下载'
    })
  else return value
}

const filter_options = [
  {
    label: 'amd64',
    value: 'amd64',
  },
  {
    label: 'any',
    value: 'any',
  },
]

// const archFilter = ref(['amd64':'amd64'])
</script>

<style scoped>

</style>
