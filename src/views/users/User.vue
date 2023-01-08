<template>
  <n-avatar :size="isMobile ? 64 : 256" :src="avatar" lazy round/>
  <NH1>{{ user.name }} # {{ user.id }}</NH1>
</template>

<script setup>
import {computed} from "vue";
import userStore from "../../plugins/stores/user.js";
import conf from "../../config/api.js";

import {NAvatar, NH1} from 'naive-ui'


import {useIsMobile} from "../../utils/composables.js";


const user = computed(() => {
  return userStore.state.user
})

const isMobile = useIsMobile()

const avatar = computed(() => {
  return conf.avatar + user.value.email_md5 + '?s=256';
})

</script>