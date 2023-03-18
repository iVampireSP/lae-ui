<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary"> 客户端下载</n-text>
    </n-h1>

    <n-alert type="info"> 欢迎加入 莱云咖啡厅, QQ 群号码: 769779712。</n-alert>

    <br/>
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
import {NA, NAlert, NDataTable, NH1, NText} from 'naive-ui'
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
    url: 'https://r2.laecloud.com/MEFrpRelease/MirrorEdgeFrp_0.46.1_beta_windows_amd64.zip',
  },
  {
    name: 'Windows Frpc i386',
    arch: 'i386',
    url: 'https://r2.laecloud.com/MEFrpRelease/MirrorEdgeFrp_0.46.1_beta_windows_386.zip',
  },
  {
    name: 'Windows Python 图形化启动器',
    arch: 'amd64',
    url: 'https://r2.laecloud.com/MEFrpRelease/Mirror_Edge_Frp_Python_Win.zip',
  },
  {
    name: 'Windows C# .NET 图形化启动器',
    arch: 'amd64',
    url: 'http://124.223.35.239/download/mefrp/',
  },
  {
    name: 'Linux Frpc amd64',
    arch: 'amd64',
    url: 'https://r2.laecloud.com/MEFrpRelease/frp_MirrorEdgeFrp_0.46.1_beta_linux_amd64.tar.gz',
  },
  {
    name: 'Linux Frpc arm64',
    arch: 'arm64',
    url: 'https://r2.laecloud.com/MEFrpRelease/frp_MirrorEdgeFrp_0.46.1_beta_linux_arm64.tar.gz',
  },
  {
    name: 'Darwin Frpc amd64',
    arch: 'amd64',
    url: 'https://r2.laecloud.com/MEFrpRelease/frp_MirrorEdgeFrp_0.46.1_beta_darwin_amd64.tar.gz',
  },
  {
    name: 'Darwin Frpc arm64',
    arch: 'arm64',
    url: 'https://r2.laecloud.com/MEFrpRelease/frp_MirrorEdgeFrp_0.46.1_beta_darwin_arm64.tar.gz',
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

<style scoped></style>
