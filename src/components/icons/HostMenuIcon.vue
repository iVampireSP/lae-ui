<template>
  <div class="not-italic text-base">
    <n-text v-if="host['status'] === 'running'">
      {{ host['name'][0] }}
    </n-text>
    <n-text v-if="host['status'] === 'stopped'" type="error">
      {{ host['name'][0] }}
    </n-text>
    <n-text v-if="host['status'] === 'suspended'" type="warning">
      {{ host['name'][0] }}
    </n-text>
  </div>
</template>

<script setup>
// import {defineProps} from 'vue'

import {NText} from 'naive-ui'

defineProps({
  host: {
    required: true,
    type: Object,
  }
})
</script>