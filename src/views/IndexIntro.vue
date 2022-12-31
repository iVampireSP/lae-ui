<template>
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

      <div class="mt-3">
        创始人寄语:

        <span>万里征途奋今朝，峥嵘岁月宏图起，去年前夕，经历改版的 镜缘映射 正式推出，在这一年里获得了各位用户的珍贵陪伴，也带给了各位丰富的使用体验，我在此由衷的感谢各位的一路陪伴，雄关漫道真如铁，而今迈步从头越，新的一年，新的开始，望 镜缘映射 能够继续带给您更加优秀的使用体验，也祝各位新年快乐，阖家团圆！</span>
      </div>



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
      <p>今天有 {{ birthdays.data.length }} 位用户在莱云度过他们的生日，让我们一同祝他们新年快乐，以及生日快乐！</p>

    </div>

    <div class="animate__animated animate__fadeIn" v-show="step === 4">
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
  </div>


</template>

<script setup>
import {onUnmounted, ref} from 'vue'
import http from '../api/http'
import GctIntroVue from '../components/GctIntro.vue'

const birthdays = ref({data: []})

const step = ref(0)

const tunnels = ref([])

const containers = ref([])

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

</script>
