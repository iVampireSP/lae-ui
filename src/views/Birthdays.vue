<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        <!--        正是你<span v-show="birthdays.data.length > 1">们</span>，点亮了星空。-->
        仍在开发
      </n-text>
    </n-h1>
  </div>
</template>

<script setup>
import {NH1, NText} from 'naive-ui'
import {ref} from 'vue'

const birthdays = ref({})

// http.get("/birthdays").then((res) => {
//   birthdays.value = res.data
// })
</script>

<style scoped>

</style>