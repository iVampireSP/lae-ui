<template>
  <h3><input v-model="title" @change="change(title)" /></h3>
</template>

<script setup>
  import { toRef } from 'vue'
  // props

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    change: {
      type: Function,
      default: () => {},
    },
  })

  const newTitle = toRef(props)
</script>

<style scope>
  input {
    border: 0;
    outline: 0;
    background: transparent;
    width: 70%;
  }
</style>
