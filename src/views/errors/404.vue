<template>
  <n-result status="404" title="404 资源不存在" description="生活总归带点荒谬">
    <template #footer>
      <n-button @click="goTo('index')">找点乐子吧</n-button>
    </template>
  </n-result>
</template>

<script setup>
import {NButton, NResult} from 'naive-ui'


import router from '../../plugins/router'

function goTo(route_name) {
  router.push({name: route_name})
}

</script>