<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      申请 IP
    </n-text>
  </n-h1>
  <p>IP 地址可以为 莱云 的其他服务做网络接入。</p>


</template>


<script setup>
import {NH1, NText} from 'naive-ui'
import {ref} from "vue";

import gateway from '../../../plugins/gateway'

const pools = ref([])

gateway.get('/ip-manager/pools').then(res => {
  pools.value = res.data
})

</script>

