<template>
  <h3>
    正是你<span v-show="birthdays.data.length > 1">们</span>，点亮了星空。
  </h3>

  <div>
    <div v-for="user in birthdays.data" :key="user.id">
      <div class="d-flex align-items-center mt-3">
        <img
          :src="api.avatar + md5(user.email) + '?s=90&d=retro'"
          class="rounded-circle"
          width="48"
        />
        <div class="ms-3">
          <h5 class="mb-0">{{ user.name }}</h5>
          <div class="text-muted" v-if="user.id === store.state.user.id">
            这是你
          </div>
        </div>
      </div>
    </div>

    <!-- 中央按钮 -->
    <div class="d-flex justify-content-center mt-5" v-if="can_next">
      <div class="spinner-border text-primary" role="status" v-if="loading">
        <span class="visually-hidden">Loading...</span>
      </div>

      <button type="button" class="btn btn-primary" @click="load()" v-else>
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'
  import store from '../plugins/store'
  import api from '../config/api'

  import md5 from 'js-md5'

  const birthdays = ref({ data: [] })

  const page = ref(0)

  const can_next = ref(true)

  const loading = ref(false)

  function load() {
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
        birthdays.value.data = birthdays.value.data.concat(res.data.data)

        if (!res.data.next_page_url) {
          can_next.value = false
        }
      })
      .finally(() => {
        loading.value = false
      })
  }

  load()
</script>
