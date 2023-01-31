<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        正是你<span v-show="stars.data.length > 1">们</span>，点亮了星空。
      </n-text>
    </n-h1>

    <br />
    仍在开发

  </IndexLayout>
</template>

<script setup>
import {NH1, NText} from 'naive-ui'

import http from "../plugins/http.js";
import {ref} from "vue";
import IndexLayout from "../components/menus/IndexLayout.vue";

const stars = ref({
  data: []
})

http.get('birthdays').then(res => {
  stars.value = res.data
})

</script>

<style scoped>

</style>