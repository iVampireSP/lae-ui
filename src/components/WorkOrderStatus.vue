<template>
  <span v-if="status == 'pending'">
    <span class="text-warning"
      ><i class="bi bi-hourglass-split"></i> &nbsp;正在传送</span
    >
  </span>

  <span v-else-if="status == 'user_replied'">
    <span class="text-warning"
      ><i class="bi bi-clock-history"></i> &nbsp;等待回复</span
    >
  </span>

  <span v-else-if="status == 'replied'">
    <span class="text-info"
      ><i class="bi bi-info-circle"></i> &nbsp;已回复</span
    >
  </span>

  <span v-else-if="status == 'open'">
    <span class="text-primary"
      ><i class="bi bi-x-diamond"></i> &nbsp;已开启</span
    >
  </span>

  <span v-else-if="status == 'in_progress'">
    <span class="text-warning"
      ><i class="bi bi-exclamation-circle"></i> &nbsp;处理中</span
    >
  </span>

  <span v-else-if="status == 'on_hold'">
    <span class="text-warning"
      ><i class="bi bi-clock-history"></i> &nbsp;挂起</span
    >
  </span>

  <span v-else-if="status == 'closed'">
    <span class="text-success"
      ><i class="bi bi-check-circle"></i> &nbsp;已关闭</span
    >
  </span>
</template>

<script setup>
  import { defineProps, toRefs } from 'vue'

  const props = defineProps({
    status: {
      type: String,
      required: true,
    },
  })

  const { status } = toRefs(props)
</script>
