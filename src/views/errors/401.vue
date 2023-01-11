<template>
  <n-result :title="title" description="我们不能验证你的身份。">
    <template #icon>
      <Lottie :height="250" name="Dizzy-face"/>
    </template>

    <template v-if="show_footer" #footer>
      <n-button @click="goTo('auth.login')">重新登录</n-button>
    </template>
  </n-result>
</template>

<script setup>
import {NButton, NResult} from 'naive-ui'

import router from '../../plugins/router'
import Lottie from "../../components/Lottie.vue";

import {computed} from "vue";

import userStore from '../../plugins/stores/user'

const user = computed(() => {
  return userStore.state.user
})

const title = computed(() => {
  if (user.value.name) {
    return '你不是 ' + user.value.name
  } else {
    return '这不是你的账号'
  }
})

defineProps({
  show_footer: {
    type: Boolean,
    default: true
  }
})


function goTo(route_name) {
  router.push({name: route_name})
}

</script>