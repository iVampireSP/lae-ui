<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        正是你<span v-show="stars.data.length > 1">们</span>，点亮了星空。
      </n-text>
    </n-h1>
    <n-list hoverable>
      <n-list-item v-for="star in stars.data">
        <template #prefix>
          <n-avatar :src="api.avatar + star.email_md5 + '?s=256?cache=0'" round size="large"/>
        </template>
        <n-thing :title="star.name">
          <template v-if="star.id === current_user.id" #description>
            <n-text depth="3">
              这是你
            </n-text>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
    <div v-if="can_next === true" class="text-center mt-5">
      <n-spin v-if="loading === true" size="medium"/>
      <n-button v-else secondary strong type="info" @click="load(true)">
        加载更多
      </n-button>
    </div>
  </IndexLayout>
</template>

<script setup>
import {NAvatar, NButton, NH1, NList, NListItem, NSpin, NText, NThing} from 'naive-ui'
import {computed, ref} from "vue"
import userStore from '../plugins/stores/user'
import IndexLayout from "../components/menus/IndexLayout.vue"
import http from "../plugins/http.js"
import api from "../config/api.js";

const stars = ref({
  data: []
})

const page = ref(0)
const can_next = ref(true)
const loading = ref(false)

const current_user = computed(() => userStore.state.user)

function load(scroll = false) {
  page.value++
  loading.value = true
  http.get('birthdays', {
        params: {
          page: page.value,
        },
      })
      .then((res) => {
        // append
        stars.value.data = stars.value.data.concat(res.data.data)
        if (!res.data.next_page_url) {
          can_next.value = false
        }
      })
      .finally(() => {
        loading.value = false
        if (scroll) {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 100)
        }
      })
}

load()
</script>
