<template>
  <div v-if="detected">
    <n-popover trigger="hover">
      <template #trigger>
        <Lottie :height="50" :loop="false" name="Cluster-Ready"/>
      </template>
      <span>Cluster Ready! 就绪</span>
    </n-popover>
  </div>

  <!--  <div v-show="closed.value" class="menu-item mr-2">-->
  <!--    <n-popover trigger="hover">-->
  <!--      <template #trigger>-->
  <!--        <n-icon size="25" color="#ff7575">-->
  <!--          <CloudOfflineOutline/>-->
  <!--        </n-icon>-->
  <!--      </template>-->
  <!--      <span>无法连接到网关，请尝试刷新页面。</span>-->
  <!--    </n-popover>-->
  <!--  </div>-->

</template>

<script setup>
import {ref} from 'vue'
import {NPopover} from "naive-ui"

import http from '../../plugins/http.js'
import Lottie from "../Lottie.vue"

const detected = ref(false)

http.get('').then((res) => {
  if (res.headers['powered-by'] === 'Cluster Ready!') {
    detected.value = true
  }
})

// const closed = computed(() => {
//   return gateway.closed
// })

</script>
