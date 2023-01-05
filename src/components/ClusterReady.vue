<template>
  <span
    v-if="detected"
    style="color: #ff7e15"
    data-bs-toggle="tooltip"
    data-bs-placement="bottom"
    title="检测到 Cluster Ready! 此功能还在实验阶段。 "
  >
    <i class="bi bi-lightning-fill"></i>
  </span>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  const detected = ref(false)

  http.get('').then((res) => {
    if (res.headers['cluster-ready-node-id']) {
      detected.value = true
    }
  })
</script>
