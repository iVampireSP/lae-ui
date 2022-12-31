<template>

  <div v-if="currentTime >= new Date('2022-12-31 23:00:00').getTime()">
    <p class="text-center" style="margin-top: 20%">
      <span class="display-1">{{ currentTime.getHours() }}</span>
      <span class="display-1">:</span>
      <span class="display-1">{{
          currentTime.getMinutes() < 10 ? '0' + currentTime.getMinutes() : currentTime.getMinutes()
        }}</span>
      <span class="display-1">:</span>
      <span class="display-2">{{
          currentTime.getSeconds() < 10 ? '0' + currentTime.getSeconds() : currentTime.getSeconds()
        }}</span>
    </p>
  </div>
  <div v-else-if="currentTime >= new Date('2023-01-01 00:00:00').getTime()">
    <div>
      <div class="text-center display-1 animate__animated animate__jackInTheBox" style="margin-top: 10%"
           v-show="step === 0">欢迎来到 2023
      </div>

      <div class="animate__animated animate__fadeIn" v-show="step === 1">
        <h1>镜缘映射</h1>

        Aehxy 运营的 镜缘映射，截止到目前为止一共累计了 <br/>
        <span class="display-1">2185</span>个用户，
        <br/>

        他们一共创建了
        <br/>

        <span class="display-1">2294</span>个隧道。
        <br/>

        <span v-show="tunnels.length">
          其中，有
          <span class="display-4">{{ tunnels.length }}</span> 条隧道是由您所创建的，感谢您的支持！
        </span>

        <br/>
        2023 年，镜缘映射将会继续为您提供服务。

      </div>

      <div class="animate__animated animate__fadeIn" v-show="step === 2">
        <h4>游戏容器</h4>

        游戏容器，也有 903 个用户了，<br/> 他们共创建了 69 个容器。<br/> 感谢您的支持！

        <br/>
        <span v-if="containers.length">
          其中，这里面有 <span class="dsisplay-4">{{ containers.length }}</span> 个容器是由你创建的。
        </span>

        <div class="mt-3">
          创始人寄语:

          <span>游戏容器 是一个高性价比的开服选择。我们主力于让更多的人用上服务器，以及对 莱云 这种计费模式的认识。在新的一年里，我们将努力优化 游戏容器，我们会将 游戏容器 做的更好。</span>
        </div>


      </div>
      <div class="display-6 animate__animated animate__fadeIn" v-show="step === 3">
        <p>现在，你可以前往社区中，撰写你的故事。</p>
      </div>

      <div class="animate__animated animate__fadeIn" v-show="step === 4">
        <GctIntroVue/>
      </div>
    </div>


  </div>
  <div v-else>
    <GctIntroVue/>

    <div>
      <hr/>
      <a
          href="https://forum.laecloud.com/d/73-wo-men-ke-yi-yin-dao-chuang-jian-fu-wu-qi-liao"
          class="d-block mt-3"
          target="_blank"
      >反馈此向导</a
      >
    </div>
  </div>


</template>

<script setup>
import {onUnmounted, ref} from 'vue'
import http from '../api/http'
import GctIntroVue from '../components/GctIntro.vue'

const birthdays = ref({data: []})

const currentTime = ref(new Date())

const step = ref(0)

const tunnels = ref([])

const containers = ref([])

const timer = setInterval(() => {
  currentTime.value = new Date()

  //   如果 year 是 2023
  if (currentTime.value.getFullYear() === 2022) {
    http.get('/birthdays').then((res) => {
      birthdays.value = res.data
    })

    http.get('/modules/frp/hosts').then((res) => {
      tunnels.value = res.data
    })

    http.get('/modules/gct/hosts').then((res) => {
      containers.value = res.data
    })

    const newTimer = setInterval(() => {
      if (step.value < 4) {
        step.value++
      } else {
        clearInterval(newTimer)
      }

      console.log(step.value)
    }, 5000)


    onUnmounted(() => {
      clearInterval(newTimer)
    })

    clearInterval(timer)

  }
}, 1000)


onUnmounted(() => {
  clearInterval(timer)

})


</script>
