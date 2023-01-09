<template>
  <IndexLayout>
    {{ pinned }}
  </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import http from '../../plugins/http'
import IndexLayout from "../../components/menus/IndexLayout.vue";

const pinned = ref({
  base_url: ''
})
const base_url = ref('')

const show = ref(false)


http.get('forum/pinned').then((res) => {
  pinned.value = res.data
  base_url.value = pinned.value.base_url
  setTimeout(() => {
    show.value = true
  }, 500)
})

</script>

<style scoped>

</style>