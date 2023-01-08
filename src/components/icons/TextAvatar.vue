<template>
  <!--  <n-avatar-->
  <!--      :style="{-->
  <!--      color: color,-->
  <!--      backgroundColor: backgroundColor-->
  <!--    }"-->
  <!--  >-->
  <!--    {{ text }}-->
  <!--  </n-avatar>-->

  <span>
    {{ text }}
  </span>
</template>

<script setup>
import {defineProps} from 'vue'

defineProps({
  text: {
    type: String,
    default: '1'
  },
  color: {
    type: String,
    default: 'yellow'
  },
  backgroundColor: {
    type: String,
    default: 'red'
  }
})
</script>

<style scoped>

</style>