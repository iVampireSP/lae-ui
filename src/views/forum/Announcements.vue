<template>
  <IndexLayout>
    {{ announcements }}
  </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import http from '../../plugins/http'
import IndexLayout from "../../components/menus/IndexLayout.vue";

const announcements = ref({
  base_url: ''
})
const base_url = ref('')

const show = ref(false)


http.get('forum/announcements').then((res) => {
  announcements.value = res.data
  base_url.value = announcements.value.base_url
  setTimeout(() => {
    show.value = true
  }, 500)
})

</script>

<style scoped>

</style>