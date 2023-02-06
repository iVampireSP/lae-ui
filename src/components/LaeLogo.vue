<template>
  <n-spin :show="spinner.loading" size="small">
    <span :class="props.class"></span>
  </n-spin>
  <!--  <img src="/assets/images/logo-lae-2023.png" width="40" height="25" alt="莱云 兔年 Logo">-->

  <!--    <Lottie name="lae-jump" :loop="true" :width="40" :height="25" />-->

</template>

<script setup>

// import { defineProps } from "vue";
// import Lottie from "./Lottie.vue";
import {ref} from "vue";
import {NSpin} from "naive-ui";
import spinnerRef from '../plugins/spinner'

const spinner = ref(spinnerRef)

const props = defineProps({
  height: {
    type: Number,
    default: 100
  },
  width: {
    type: Number,
    default: 100
  },
  class: {
    type: String,
    default: ''
  }
})


</script>
