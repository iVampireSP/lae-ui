<template>
  <transition name="fade">
    <div class="not-italic" v-show="menuCollapsed[side]">
      <n-avatar
          :style="{backgroundColor:'transparent'}"
      >
        <span class="relative top-1.5">{{ title[0].toString().toUpperCase() }}</span>
      </n-avatar>
    </div>
  </transition>


</template>

<script setup>
import {defineProps} from 'vue'

import {NAvatar} from 'naive-ui'

import {menuCollapsed} from "../config/menuOptions.js";

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

<style scoped>


</style>