<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">公告</n-text>
    </n-h1>

    <Topic :base_url="base_url" :items="announcements"></Topic>
  </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import {NH1, NText,} from 'naive-ui'

import http from '../../plugins/http'
import IndexLayout from '../../components/menus/IndexLayout.vue'
import Topic from './components/Topic.vue'

const announcements = ref({
  base_url: '',
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

<style scoped></style>
