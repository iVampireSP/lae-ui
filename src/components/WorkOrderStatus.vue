<template>
  <span v-if="status === 'pending'">
    <n-text>传送中</n-text>
  </span>

  <span v-else-if="status === 'user_replied'">
    <n-text>您已回复</n-text>
  </span>

  <span v-else-if="status === 'replied'">
    <n-text>需要您处理</n-text>
  </span>

  <span v-else-if="status === 'read'">
    <n-text>我们已读</n-text>
  </span>

  <span v-else-if="status === 'open'">
    <n-text>等待处理</n-text>
  </span>

  <span v-else-if="status === 'in_progress'">
     <n-text>正在处理</n-text>
  </span>

  <span v-else-if="status === 'on_hold'">
     <n-text>挂起</n-text>
  </span>

  <span v-else-if="status === 'closed'">
    <n-text>已关闭</n-text>
  </span>

  <span v-else-if="status === 'error'">
    <n-text>投递失败</n-text>
  </span>
</template>

<script setup>
import {toRefs} from 'vue'

import {NText} from "naive-ui"

const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const {status} = toRefs(props)
</script>