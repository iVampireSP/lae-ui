<template>
  <transition name="fade">
    <div class="not-italic text-base" v-show="menuCollapsed[side]">
      {{ title[0].toString().toUpperCase() }}
    </div>
  </transition>
</template>

<script setup>
  import { defineProps } from 'vue'

  import { NAvatar } from 'naive-ui'

  import { menuCollapsed } from '../config/menuOptions.js'

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
