<template>
    <IndexLayout>
        <n-h1 prefix="bar">
            <n-text type="primary">固钉</n-text>
        </n-h1>

        <Topic :base_url="base_url" :items="pinned"></Topic>
    </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import http from '../../plugins/http'
import IndexLayout from '../../components/menus/IndexLayout.vue'

import Topic from './components/Topic.vue'

import {NH1, NText,} from 'naive-ui'

const pinned = ref({
    base_url: '',
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

<style scoped></style>
