<template>
  <div>
    <n-button type="primary" @click="login" v-if="!user.state.token">
      {{ text }}
    </n-button>
  </div>
</template>

<script setup>
import {NButton} from 'naive-ui'
import user from '../plugins/stores/user'
import router from '../plugins/router'

function login() {
  router.push({
    name: 'auth.login'
  })
}

defineProps({
  text: {
    type: String,
    default: '登录'
  }
})

</script>