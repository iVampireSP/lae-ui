<template>
  <div class="not-italic" v-show="menuCollapsed[side]">
    <n-text>
      {{ title[0] }}
    </n-text>
  </div>
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