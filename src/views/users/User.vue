<template>
  <div class="text-center">
    <n-avatar :size="isMobile ? 64 : 128" :src="avatar" lazy round/>
    <n-h1>{{ user.name }}  #{{ user.id }}</n-h1>
    {{user}}
<!--    TODO: 钱 email 注册时间 任务列表-->
<!--    TODO: 彩蛋：生日彩蛋-->
  </div>

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
  return conf.avatar + user.value.email_md5 + '?s=128';
})

</script>