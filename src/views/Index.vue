<template>
  <IndexLayout>
    <Portal/>
  </IndexLayout>
</template>

<script setup>
import router from '../plugins/router.js'
import IndexLayout from '../components/menus/IndexLayout.vue'
import Portal from "./home/Portal.vue";

// import direct from "../plugins/direct.js";

// 就像下面这样
// const user = computed(() => {
//   return userStore.state.user
// })
//
// // import {message} from "../utils/layout.js";
//
// const avatar = conf.avatar + user.value.email_md5 + '?s=64'
//
// http.get('/user').then((res) => {
//   userStore.commit('updateUser', res.data)
// })

// is local
// const isLocal = computed(() => {
//   return process.env.NODE_ENV === 'development'
// })

const go = (route_name) => {
  router.push({
    name: route_name,
  })
}
</script>
