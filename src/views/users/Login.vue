<template>
  <div>
    <div id="lae-logo-container">
      <div id="lottie" style="height: 500px"></div>
    </div>

    <p class="text-center">
      莱云 iVampireSP.com 作品, 动画 Fofray
      <br/>
      <span>苏ICP备2022042268号-1</span>
    </p>

  </div>
</template>

<script setup>
import http from '../../plugins/http'
import router from '../../plugins/router'
import api from '../../config/api'
import user from "../../plugins/stores/user.js";

import {onMounted, onUnmounted, ref} from 'vue'

import axios from 'axios'
import lottie from 'lottie-web'

const origin = api.auth

console.log('auth server: ' + origin)

const token = ref('')
const show = ref(false)
const title = ref('连接到 莱云')
const buttonDisabled = ref(false)

console.log('store token:', user.state.token)
console.log('store user:', user.state.user)

const connect = () => {
  buttonDisabled.value = true
  title.value = '正在验证登录...'

  user.commit('updateToken', token.value)

  console.log('new Token is:', token.value)

  http
      .get('/users')
      .then((res) => {

        user.commit('updateToken', token.value)

        user.commit('updateUser', res.data)

        title.value = '嗨, ' + res.data.name
        buttonDisabled.value = false

        show.value = true
        router.push('/')

        location.href = '/'
      })
      .catch((err) => {
        console.error(err)

        user.commit('updateToken', '')
        user.commit('updateUser', {})

        title.value = '无法验证登录，将在几秒钟后重试。'
        buttonDisabled.value = false
      })

}

const query = router.currentRoute.value.query

if (query.token != null) {
  token.value = query.token
  connect()
} else {
  show.value = false
  setTimeout(toLogin, 1000)
}

function toLogin() {

  window.location.href =
      origin + '/?callback=' + encodeURIComponent(window.location.href)
}

let color = 'dark'
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  color = 'white'
}

let laeLogoUrl = '/assets/js/animate/' + color + '.json'

let animation_data = null

axios.get(laeLogoUrl).then((res) => {
  let animation = lottie.loadAnimation({
    container: document.getElementById('lottie'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: res.data,
  })

  animation_data = animation

  onMounted(() => {
    animation.play()

  })
})

onUnmounted(() => {
  if (animation_data !== null) {
    animation_data.destroy()
  }
})
</script>
