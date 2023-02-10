<template>
  <div>
    <router-view :key="route.fullPath"></router-view>
  </div>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";

import {removeAllMenuOptions} from "../../plugins/menuOptions.js";

const router = useRouter()
const route = useRoute()


removeAllMenuOptions('left')


</script>

