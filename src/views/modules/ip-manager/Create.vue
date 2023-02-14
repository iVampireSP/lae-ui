<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      申请 IP
    </n-text>
  </n-h1>


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

