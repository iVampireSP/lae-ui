<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">合作需求</n-text>
    </n-h1>

    <Topic :base_url="base_url" :items="data"></Topic>
  </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import http from '../../plugins/http'
import IndexLayout from '../../components/menus/IndexLayout.vue'

import Topic from './components/Topic.vue'

import {NH1, NText} from 'naive-ui'

const data = ref({
  base_url: '',
})
const base_url = ref('')

const show = ref(false)

http.get('forum/partner').then((res) => {
  data.value = res.data
  base_url.value = data.value.base_url
  setTimeout(() => {
    show.value = true
  }, 500)
})
</script>
