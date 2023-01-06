<template>
  <div>
    <NH1>欢迎, {{ user.state.user.name }}。</NH1>

    {{ data }}
  </div>
</template>

<script setup>
import {NH1} from 'naive-ui'

import {addMenuOptions} from "../config/menuOptions.js";

import user from "../plugins/stores/user";

import http from "../plugins/http";

// import {message} from "../utils/layout.js";
import {ref} from "vue";

const data = ref({})

http.get('/users').then((res) => {
  // message.create('success',)

  data.value = res.data

})


addMenuOptions('left', 'index', 'Index',)
addMenuOptions('left', 'index', 'Index',)
addMenuOptions('left', 'errors.404', '404',)

</script>

<style scoped>

</style>