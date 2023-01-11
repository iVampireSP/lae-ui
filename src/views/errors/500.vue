<template>
  <n-result
      description="我们的锅。"
      status="500"
      title="服务器错误"
  >
    <template #icon>
      <Lottie :height="250" name="Scrunched-mouth"/>
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