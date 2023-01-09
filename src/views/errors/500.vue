<template>
  <n-result
      status="500"
      title="服务器错误"
      description="我们的逻辑可能出了点问题。"
  >
    <template #icon>
      <Lottie name="Scrunched-mouth" :height="250"/>
    </template>
    <template #footer>
      <!--      <n-button>散财消灾</n-button>-->
    </template>
  </n-result>
</template>

<script setup>
import {NResult} from 'naive-ui'
import Lottie from "../../components/Lottie.vue";

// function goTo(route_name) {
//   router.push({name: route_name})
// }
</script>

<style scoped>

</style>