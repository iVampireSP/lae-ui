<template>
  <div class="w-100 text-center justify-content-center align-middle">
    <div id="lae-logo-container" class="w-100" style="height: 500px">
      <div id="lottie"></div>
    </div>

    <p class="text-left">
      莱云 iVampireSP.com 作品, 动画 Fofray
      <br />
      <span>苏ICP备2022042268号-1</span>
    </p>
  </div>
</template>

<script setup>
  import store from '../../plugins/store'
  import http from '../../api/http'
  import router from '../../plugins/router'
  import api from '../../config/api'
  import { ref, onMounted, onUnmounted } from 'vue'

  import axios from 'axios'
  import lottie from 'lottie-web'

  // import app from '../../config/app'

  const origin = api.auth

  console.log('auth server: ' + origin)

  const token = ref('')
  const show = ref(false)
  const title = ref('连接到 莱云')
  const buttonDisabled = ref(false)

  // const user = store.state.user

  console.log('store token:', store.state.token)
  console.log('store user:', store.state.user)

  const connect = () => {
    buttonDisabled.value = true
    title.value = '正在验证登录...'
    store.commit('updateToken', token.value)
    http
      .get('/users')
      .then((res) => {
        store.commit('updateUser', res.data)

        // app.isLogin = true

        console.log(res.data)

        title.value = '嗨, ' + res.data.name
        buttonDisabled.value = false

        show.value = true
        router.push('/')

        location.href = '/'
      })
      .catch((err) => {
        console.error(err)
        store.commit('updateToken', {
          token: null,
        })
        title.value = '无法验证登录，将在几秒钟后重试。'
        buttonDisabled.value = false
      })
    token.value = ''
  }

  // read the router query para
  const query = router.currentRoute.value.query

  if (query.token != null) {
    token.value = query.token
    connect()
  } else {
    show.value = false
    setTimeout(toLogin, 1000)
  }

  function toLogin() {
    // // if build for production, use the production url
    // if (process.env.NODE_ENV === 'production') {
    //   location.href = api.login
    // } else {
    //   location.href = api.login
    // }

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

      //   animation.destroy()
    })
  })

  onUnmounted(() => {
    if (animation_data !== null) {
      animation_data.destroy()
    }
  })
</script>
