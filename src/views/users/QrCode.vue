<template>
  <div class="justify-center items-center flex" style="height: 92vh">
    <div v-if="!route.query.auth_request">
      <div v-if="state === 'redirect'">
        <div class="text-center">

        </div>
      </div>
      <div v-else-if="state === 'logging'">
        <div class="text-center">
          <div v-if="url">
            <n-h2>登录 莱云</n-h2>

            <div v-if="loginUrl">
              <n-p>使用移动设备扫码登录</n-p>
              <QRCodeVue3
                  :backgroundOptions="qrOptions.backgroundOptions"
                  :backgroundOptionsHelper="qrOptions.backgroundOptionsHelper"
                  :cornersDotOptions="qrOptions.cornersDotOptions"
                  :cornersDotOptionsHelper="qrOptions.cornersDotOptionsHelper"
                  :cornersSquareOptions="qrOptions.cornersSquareOptions"
                  :cornersSquareOptionsHelper="
                  qrOptions.cornersSquareOptionsHelper
                "
                  :dotsOptions="qrOptions.dotsOptions"
                  :dotsOptionsHelper="qrOptions.dotsOptionsHelper"
                  :height="qrOptions.height"
                  :imageOptions="qrOptions.imageOptions"
                  :qrOptions="qrOptions.qrOptions"
                  :value="loginUrl"
                  :width="qrOptions.width"
              />
              <br/>

              <n-p>
                或者
                <n-a :href="url" class="underline underline-offset-4"
                >不使用二维码登录(直接登录)
                </n-a>
                。
              </n-p>
            </div>
            <div v-else>
              <n-spin>
              </n-spin>
            </div>
          </div>
          <span v-else>
            <n-spin>
              <template #description>
                <n-p v-text="lyric()"> </n-p>
              </template>
            </n-spin>
          </span>
        </div>
      </div>

      <p v-if="state === 'redirect'" class="text-center mt-5">
        莱云 iVampireSP.com 作品
        <br/>
        <span>莱云的 Logo 动画由 Fofray 制作。</span>
        <br/>
        <a href="https://beian.miit.gov.cn/">苏ICP备2022042268号-1</a>
      </p>

      <div v-else-if="state === 'error'">
        <div>
          <div class="flex justify-center">
            <CloudOfflineOutline style="width: 100px"/>
          </div>
          <n-h3 class="text-center"
          >我们的服务器可能出现了点问题，请稍后再试。
          </n-h3
          >
        </div>
      </div>
    </div>
    <div v-else>
      <n-h1 class="mt-5">
        <n-spin>
          <template #description>
            <n-p v-text="lyric()"></n-p>
          </template>
        </n-spin>
      </n-h1>
    </div>
  </div>
</template>

<script setup>
import {onUnmounted, ref} from 'vue'
import {NA, NH1, NH2, NH3, NP, NSpin} from 'naive-ui'
import QRCodeVue3 from 'qrcode-vue3'
import axios from 'axios'
import {useRoute} from 'vue-router'
import {CloudOfflineOutline} from '@vicons/ionicons5'
import http from '../../plugins/http'
import api from '../../config/api'
import user from '../../plugins/stores/user.js'
import userStore from '../../plugins/stores/user.js'
import lyric from '../../plugins/lyric.js'
import router from '../../plugins/router'

const route = useRoute()

const origin = api.auth

console.log('auth server: ' + origin)

const token = ref('')
const state = ref('redirect')

const auth_request = ref({})

const loading = ref(false)

const url = ref('')

const loginUrl = ref('')

const qrOptions = ref({
  width: 200,
  height: 200,
  padding: 0,
  qrOptions: {
    typeNumber: '0',
    mode: 'Byte',
    errorCorrectionLevel: 'Q',
  },
  dotsOptions: {
    type: 'rounded',
    color: '#065de0',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        {
          offset: 0,
          color: '#005ec2',
        },
        {
          offset: 1,
          color: '#388eff',
        },
      ],
    },
  },
  backgroundOptions: {
    color: '#ffffff',
    gradient: null,
  },
  dotsOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: '#6a1a4c',
      color2: '#6a1a4c',
      rotation: '0',
    },
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    color: '#00e6d6',
    gradient: {
      type: 'radial',
      rotation: 0,
      colorStops: [
        {
          offset: 0,
          color: '#0072d6',
        },
        {
          offset: 1,
          color: '#68bcfd',
        },
      ],
    },
  },
  cornersSquareOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: '#000000',
      color2: '#000000',
      rotation: '0',
    },
  },
  cornersDotOptions: {
    type: '',
    color: '#3385ff',
    gradient: null,
  },
  cornersDotOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: '#000000',
      color2: '#000000',
      rotation: '0',
    },
  },
  backgroundOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: '#ffffff',
      color2: '#ffffff',
      rotation: '0',
    },
  },
})

const connect = () => {
  loading.value = true

  user.commit('updateToken', token.value)

  http
      .get('/user')
      .then(() => {
        state.value = 'redirect'

        setTimeout(() => {
          user.commit('updateToken', token.value)
          userStore.dispatch('fetch')

          router.push('/')

          //   location.href = '/'
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
  state.value = 'logging'
  times.value = 0

  loading.value = true

  axios
      .post(api.auth + '/public/auth_request', {
        description: '莱云仪表盘',
        require_token: true,
        abilities: ['*'],
        return_url: window.location.href,
      })
      .then((res) => {
        loading.value = true

        loginUrl.value = api.auth + '/auth_request/' + res.data.meta.token

        auth_request.value = res.data

        url.value = res.data.url

        loginInter = setInterval(() => {
          axios
              .get(api.auth + '/public/auth_request/' + res.data.meta.token)
              .then((res) => {
                auth_request.value = res.data

                if (res.data.user) {
                  token.value = res.data.token
                  state.value = 'confirm'

                  loginInter && clearInterval(loginInter)

                  connect()
                }
              })

          if (times.value >= 10) {
            clearInterval(loginInter)
            times.value = 0
            state.value = 'redirect'
            toLogin()
          } else {
            times.value++
          }
        }, 3000)
      })
      .catch(() => {
        state.value = 'error'
        loading.value = false
      })
      .finally(() => {
        loading.value = false
      })
}

// if get has auth request
if (route.query.auth_request) {
  axios
      .get(api.auth + '/public/auth_request/' + route.query.auth_request)
      .then((res) => {
        auth_request.value = res.data

        if (res.data.user) {
          token.value = res.data.token
          state.value = 'confirm'

          connect()
        }
      })
} else {
  toLogin()
}

const logo = ref('Logo-dark')
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  logo.value = 'Logo-white'
}

onUnmounted(() => {
  loginInter && clearInterval(loginInter)
})
</script>
