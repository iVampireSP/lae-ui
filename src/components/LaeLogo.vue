<template>
    <span :class="props.class"></span>

<!--    <Lottie name="lae-jump" :loop="true" :width="40" :height="25" />-->

</template>

<script setup>

// import { defineProps } from "vue";
// import Lottie from "./Lottie.vue";

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
