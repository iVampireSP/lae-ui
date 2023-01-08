<template>
  <div v-if="detected" class="mt-1">
    <n-popover trigger="hover">
      <template #trigger>
        <n-icon class=" text-orange-400" size="30">
          <BoltFilled/>
        </n-icon>
      </template>
      <span>Cluster Ready! 就绪</span>
    </n-popover>
  </div>

</template>

<script setup>
import {ref} from 'vue'
import {BoltFilled} from "@vicons/material"
import {NIcon, NPopover} from "naive-ui";

import http from '../../plugins/http.js'

const detected = ref(false)

http.get('').then((res) => {
  if (res.headers['powered-by'] === 'Cluster Ready!') {
    detected.value = true
  }
})
</script>
