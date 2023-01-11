<template>
  <div>
    <div v-if="state === 'redirect'">
      <Lottie :height="256"
              :style="style"
              name="Wave"
      />

      <div class="text-center">
        <n-h1>欢迎！要一起加入莱云吗？</n-h1>

        <n-button class="text-center" type="info" @click="toLogin">
          现在登录！
        </n-button>
      </div>

    </div>
    <div v-else-if="state === 'logging'">
      <Lottie :height="256"
              :name="logo"
              :style="style"
      />
    </div>
    <div v-else-if="state === 'error'">
      <Lottie :height="256"
              :style="style"
              name="Ghost"
      />

      <div class="text-center">
        <n-h1 class="mt-5">
          <n-text class="text-center" type="error">
            你的 Token 无效
          </n-text>
        </n-h1>

        <n-button type="error" @click="toLogin">
          重新登录
        </n-button>
      </div>
    </div>

    <p v-show="state === 'logging'" class="text-center bottom">
      <span>登录动画由 Fofray 制作。</span>
    </p>

    <p v-if="state === 'redirect'" class="text-center bottom">
      莱云 iVampireSP.com 作品
      <br/>
      <a href="https://beian.miit.gov.cn/">苏ICP备2022042268号-1</a>
    </p>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {NButton, NH1, NText} from 'naive-ui'
import http from '../../plugins/http'
import router from '../../plugins/router'
import api from '../../config/api'
import user from "../../plugins/stores/user.js";
import Lottie from "../../components/Lottie.vue";


const style = {
  textAlign: 'center',
  marginTop: '20px',
  marginBottom: '20px'
}

const origin = api.auth

console.log('auth server: ' + origin)

const token = ref('')
const state = ref('redirect')

const connect = () => {
  state.value = 'logging'

  user.commit('updateToken', token.value)

  http
      .get('/user')
      .then((res) => {
        setTimeout(() => {
          user.commit('updateToken', token.value)
          user.commit('updateUser', res.data)

          router.push('/')
          location.href = '/'
        }, 1000)

      })
      .catch(() => {
        state.value = 'error'

        user.commit('updateToken', '')
        user.commit('updateUser', {})
      })

}

const query = router.currentRoute.value.query

if (query.token != null) {
  token.value = query.token
  connect()
}

// else {
//   setTimeout(toLogin, 1000)
// }

function toLogin() {

  // protocol + domain + pathname
  const redirect = location.origin + location.pathname

  window.location.href =
      origin + '/?callback=' + encodeURIComponent(redirect)
}

const logo = ref('Logo-dark')
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  logo.value = 'Logo-white'
}
</script>

<style scoped>
.bottom {
  bottom: 30px;
  left: 0;
  width: 100%;
  position: absolute;
}
</style>
