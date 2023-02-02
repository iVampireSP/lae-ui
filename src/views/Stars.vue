<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        正是你<span v-show="stars.data.length > 1">们</span>，点亮了星空。
      </n-text>
    </n-h1>

<!--    <div>-->
<!--      <div v-for="user in stars.data" :key="user.id">-->
<!--        <div-->
<!--            class="d-flex align-items-center mt-3"-->
<!--        >-->
<!--          <img-->
<!--              :src="api.avatar + user.email_md5 + '?s=90&d=retro'"-->
<!--              class="rounded-circle"-->
<!--              width="48"-->
<!--              style="object-fit: cover; width: 48px; height: 48px"-->
<!--          />-->
<!--          <div class="ms-3">-->
<!--            <h5 class="mb-0">{{ user.name }}</h5>-->
<!--            <div class="text-muted animate__animated animate__bounceInRight" v-if="user.id === current_user.id">-->
<!--              这是你-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->

<!--        <hr/>-->
<!--      </div>-->

<!--      &lt;!&ndash; 中央按钮 &ndash;&gt;-->
<!--      <div class="d-flex justify-content-center mt-5" v-if="can_next">-->
<!--        <div class="spinner-border text-primary" role="status" v-if="loading">-->
<!--          <span class="visually-hidden">Loading...</span>-->
<!--        </div>-->

<!--        <button type="button" class="btn btn-primary" @click="load(true)" v-else>-->
<!--          加载更多-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->

  </IndexLayout>
</template>

<script setup>
import {NH1, NText} from 'naive-ui'
import {computed, ref} from "vue"
import userStore from '../plugins/stores/user'
import IndexLayout from "../components/menus/IndexLayout.vue"
import http from "../plugins/http.js"
import api from "../config/api.js";

const stars = ref({
  data: []
})

http.get('birthdays').then(res => {
  stars.value = res.data
})

const page = ref(0)
const can_next = ref(true)
const loading = ref(false)

const current_user = computed(() => userStore.state.user)

function load(scroll = false) {
  page.value++
  loading.value = true
  http
      .get('birthdays', {
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
