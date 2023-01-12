<template>
  <div>
    <n-h1 align-text prefix="bar">
      <n-gradient-text>
        {{ gct.name }}
      </n-gradient-text>
    </n-h1>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {NH1, NGradientText, NA, NButton, NButtonGroup, NSlider, NTab, NTabPane, NSelect} from 'naive-ui'

import http from '../../../plugins/http'
import gct from "../../../plugins/stores/gct.js";

</script>

<style scoped>

</style>