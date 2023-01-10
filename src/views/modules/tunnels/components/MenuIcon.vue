<template>
  <div class="not-italic text-base">
    <n-text v-if="tunnel['status'] === 'running'">
      {{ tunnel['name'][0] }}
    </n-text>
    <n-text type="error" v-if="tunnel['status'] === 'stopped'">
      {{ tunnel['name'][0] }}
    </n-text>
    <n-text type="warning" v-if="tunnel['status'] === 'suspended'">
      {{ tunnel['name'][0] }}
    </n-text>
  </div>
</template>

<script setup>
// import {defineProps} from 'vue'

import {NText} from 'naive-ui'

defineProps({
  tunnel: {
    required: true,
    type: Object,
  }
})
</script>