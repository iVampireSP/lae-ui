<template>
  <div class="mb-2">
    <h4>莱云 Beta</h4>
  </div>
  <div>
    <div>
      <p>余额: {{ user.balance }} <small># 这是你充值的余额</small></p>
      <p>
        Drops: {{ user.drops }}
        <small
          ># 这是按量/时间计费用的余额，当 Drops 不够用时，你的余额会自动转换为
          Drops</small
        >
      </p>
    </div>

    <router-link class="btn btn-primary" :to="{ name: 'billing.charge' }"
      >添加到余额</router-link
    >
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import store from '../plugins/store'
  import http from '../api/http'

  const user = ref('')

  function refresh() {
    http
      .get('/users')
      .then((res) => {
        user.value = res.data
        store.commit('updateUser', res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  refresh()

  onMounted(() => {
    refresh()
    const interval = setInterval(refresh, 60000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
</script>
