<template>
 <div>
   <div v-if="detected">
     <n-popover trigger="hover">
       <template #trigger>
         <Lottie :height="50" :loop="false" name="Cluster-Ready"/>
       </template>
       <span>Cluster Ready! 就绪</span>
     </n-popover>
   </div>
 </div>

</template>

<script setup>
import {ref} from 'vue'
import {NPopover} from "naive-ui";

import http from '../../plugins/http.js'
import Lottie from "../Lottie.vue";

const detected = ref(false)

http.get('').then((res) => {
  if (res.headers['powered-by'] === 'Cluster Ready!') {
    detected.value = true
  }
})
</script>
