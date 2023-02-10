<template>
  <transition name="fade">
    <div v-show="menuCollapsed[side]" class="not-italic text-base">
      {{ title[0].toString().toUpperCase() }}
    </div>
  </transition>
</template>

<script setup>
// import { defineProps } from 'vue'

import {menuCollapsed} from '../plugins/menuOptions.js'

defineProps({
  title: {
    required: true,
    type: String,
  },
  side: {
    type: String,
    default: 'left',
  },
})
</script>

<style scoped></style>
