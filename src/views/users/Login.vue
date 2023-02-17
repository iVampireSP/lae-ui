<template>
  <div class="justify-center items-center flex" style="height: 60vh">
    <div>
      <div v-if="state === 'redirect'">
        <Lottie :height="256"
                :style="style"
                name="Wave"
        />

        <div class="text-center">
          <n-h1>欢迎！要一起加入莱云吗？</n-h1>

          <n-button :loading="loading" class="text-center" type="info" @click="toLogin">
            现在登录！
          </n-button>
        </div>

      </div>
      <div v-else-if="state === 'logging'">
        <div class="text-center">
          <n-h2>正在等待验证</n-h2>

          <span>次数: {{ times }} / 10</span>

          <br/>
          <span>请
            <n-a :href="url" target="_blank" class="underline underline-offset-4">点击打开 URL 并授权</n-a>
            。
          </span>
        </div>

      </div>
      <div v-else-if="state === 'error'">
        <Lottie :height="256"
                :style="style"
                name="Ghost"
        />

        <div class="text-center">
          <n-h1 class="mt-5">
            <n-text class="text-center" type="error">
              无法完成登录。
            </n-text>
          </n-h1>

          <n-button type="error" @click="toLogin">
            重新登录
          </n-button>
        </div>
      </div>
      <div v-else-if="state === 'error'">
        <Lottie :height="256"
                :style="style"
                name="Ghost"
        />

        <div class="text-center">
          <n-h1 class="mt-5">
            <n-text class="text-center" type="error">
              无法完成登录。
            </n-text>
          </n-h1>

          <n-button type="error" @click="toLogin">
            重新登录
          </n-button>
        </div>
      </div>

      <p v-if="state === 'confirm'" class="text-center mt-5">
        <n-h3 class="mt-5">
          <n-text class="text-center" type="success">
            您好, {{ auth_request.user.name }}。
          </n-text>
        </n-h3>

        <n-button type="success" @click="connect" :loading="loading">
          确认登录
        </n-button>
      </p>

      <p v-if="state === 'redirect'" class="text-center mt-5">
        莱云 iVampireSP.com 作品
        <br/>
        <span>莱云的 Logo 动画由 Fofray 制作。</span>
        <br/>
        <a href="https://beian.miit.gov.cn/">苏ICP备2022042268号-1</a>
      </p>

    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {NA, NButton, NH1, NH2, NH3, NText} from 'naive-ui'
import http from '../../plugins/http'
import api from '../../config/api'
import user from "../../plugins/stores/user.js";
import Lottie from "../../components/Lottie.vue";
import axios from "axios";


const style = {
  textAlign: 'center',
  marginTop: '20px',
  marginBottom: '20px'
}

const origin = api.auth

console.log('auth server: ' + origin)

const token = ref('')
const state = ref('redirect')

const auth_request = ref({})

const loading = ref(false)

const url = ref('')

const connect = () => {

  loading.value = true

  user.commit('updateToken', token.value)

  http
      .get('/user')
      .then((res) => {
        setTimeout(() => {
          user.commit('updateToken', token.value)
          user.commit('updateUser', res.data)

          location.href = '/'
        }, 1000)
      })
      .catch(() => {
        state.value = 'error'

        user.commit('updateToken', '')
        user.commit('updateUser', {})

        loading.value = true

      })

}

let loginInter = null

const times = ref(0)

function toLogin() {
  if (state.value === 'logging') {
    return
  }

  state.value = 'logging'
  times.value = 0

  loading.value = true


  axios.post(api.auth + '/public/auth_request', {
    description: '莱云仪表盘',
    require_token: true,
    abilities: ['*']
  }).then(res => {
    loading.value = true


    auth_request.value = res.data

    url.value = res.data.url


    loginInter = setInterval(() => {
      axios.get(api.auth + '/public/auth_request/' + res.data.meta.token).then(res => {
        auth_request.value = res.data

        if (res.data.user) {
          token.value = res.data.token
          state.value = 'confirm'

          setTimeout(() => {
            connect()
          }, 500)
        }
      })

      if (times.value === 10) {
        clearInterval(loginInter)
        state.value = 'error'
      }

      times.value++
    }, 1000)
  }).catch(() => {
    state.value = 'error'
    loading.value = false

  }).finally(() => {
    loading.value = false
  })

}

onMounted(() => {
  user.commit('updateToken', '')
  user.commit('updateUser', {})
})

const logo = ref('Logo-dark')
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  logo.value = 'Logo-white'
}
</script>