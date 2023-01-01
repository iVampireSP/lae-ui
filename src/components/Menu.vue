<template>
  <!-- Left Side Of Navbar -->
  <ul class="navbar-nav me-auto">
    <template v-for="item in modules">
      <li class="nav-item">
        <router-link class="nav-link text-auto" :to="{ name: item.route }">{{
          item.name
        }}</router-link>
      </li>
    </template>
  </ul>
</template>

<script setup>
  import { ref } from 'vue'

  import axios from 'axios'

  const modules = ref({})
  axios.get('/modules.json').then((res) => {
    modules.value = res.data
  })
</script>
