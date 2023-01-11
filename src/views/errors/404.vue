<template>
  <n-result
      description="我们知道你很急，但是我们确实找不到。"
      status="404"
      title="资源不存在"
  >
    <template #icon>
      <Lottie :height="250" name="Thinking-face"/>
    </template>

    <template v-if="show_footer" #footer>
      <n-button @click="goTo('index')">回到首页</n-button>
    </template>
  </n-result>
</template>

<script setup>
import {NButton, NResult} from 'naive-ui'

import router from '../../plugins/router'
import Lottie from '../../components/Lottie.vue'

// import { defineProps } from 'vue'

defineProps({
  show_footer: {
    type: Boolean,
    default: true,
  },
})

function goTo(route_name) {
  router.push({name: route_name})
}
</script>
