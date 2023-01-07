<template>
  <router-view :key="route.fullPath"></router-view>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";

import {removeAllMenuOptions} from "../../config/menuOptions.js";

const router = useRouter()
const route = useRoute()


removeAllMenuOptions('left')


</script>
