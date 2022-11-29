<template>
  <div
    class="w-100 text-center justify-content-center align-middle"
    v-show="!show"
  >
    <div id="lae-logo-container" class="w-100" style="height: 500px">
      <div id="lottie"></div>
    </div>
  </div>

  <div class="mb-2" v-show="show">
    <h4>欢迎使用 莱云</h4>

    <!-- <span v-if="item.attributes">
      {{ item.attributes.title }}
    </span>

    <span v-if="item.attributes">
      {{ new Date(item.attributes.createdAt).toLocaleString() }}
    </span> -->

    <div v-show="base_url">
      <h4 class="mt-3">公告</h4>
      <div class="list-group mt-3" v-for="item in pinned">
        <span v-if="item.attributes">
          <a
            class="list-group-item list-group-item-action shadow-sm rounded"
            target="_blank"
            :href="base_url + '/d/' + item.attributes.slug"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 text-success">
                {{ item.attributes.title }}
              </h5>
              <small>
                {{ new Date(item.attributes.lastPostedAt).toLocaleString() }}
              </small>
            </div>
          </a>
        </span>
      </div>
    </div>

    <!-- 贡献代码 -->
    <h3>GitHub</h3>
    <p>如果您想要为莱云 控制面板 贡献代码，或者自定义它。</p>
    <a target="_blank" href="https://github.com/iVampireSP/lae-ui"
      >https://github.com/iVampireSP/lae-ui</a
    >

    <br />
    <br />
    <a @click="toggleAnimation()" class="link cursor-pointer">动画好可爱，去看动画～</a>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import http from '../api/http'
  import axios from 'axios'
  import lottie from 'lottie-web'
  //   import store from '../plugins/store'

  const pinned = ref([])
  const base_url = ref('')
  const show = ref(false)

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

  http.get('forum/pinned').then((res) => {
    pinned.value = res.data

    base_url.value = pinned.value.base_url

    setTimeout(() => {
      show.value = true
    }, 500)
  })

  function toggleAnimation() {
    show.value = false
  }
</script>
