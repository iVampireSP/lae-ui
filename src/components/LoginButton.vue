<template>
  <div>
    <n-button-group>
      <n-button type="primary" @click="login" v-if="!user.state.token">
        {{ text }}
      </n-button>

      <n-button type="primary" tag="a" target="_blank" href="https://qm.qq.com/cgi-bin/qm/qr?k=4vzG2Jk0aOEOswOkboJrYrqZUwWcTaKL&jump_from=webapi&authKey=MN5mxefqchK55kph7YJBnKZrNggZyJnKT2HRgAFt/8iR+MEtWQGE6hXqG8F/ky7F" v-if="join">
        加入咖啡厅
      </n-button>
    </n-button-group>
  </div>
</template>

<script setup>
import {NButton, NButtonGroup} from 'naive-ui'
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
  },
  join: {
    type: Boolean,
    default: false
  }
})

</script>