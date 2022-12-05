<template>
  <div>
    <Nav />
  </div>
  <div>
    <div class="background-container text-center d-none" id="bg-container">
      <div class="bg-center">
        <!-- 文字居中 -->
        <div>
          <h1>请等一下</h1>
          <p>
            我们知道您很忙，但是在期间，您可以暂时放下手中的工作。 <br />默哀 3
            分钟。
          </p>
        </div>
      </div>
    </div>
    <!-- <Modals /> -->
    <Layout />
  </div>
</template>

<script setup>
  import { onMounted, onUnmounted } from 'vue'

  import Layout from './components/Layout.vue'
  import Nav from './components/Nav.vue'

  let timeinterval = null

  onMounted(() => {
    timeinterval = setInterval(() => {
      const bgContainer = document.getElementById('bg-container')

      // 如果时间是 12 月 6 日，上午 10 点整到 10点 3 分
      const date = new Date()
      const month = date.getMonth() + 1
      const day = date.getDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      if (
        month === 12 &&
        day === 6 &&
        hour === 10 &&
        minute >= 0 &&
        minute <= 3
      ) {
        bgContainer.classList.remove('d-none')
        bgContainer.classList.add('d-block')
      } else {
        bgContainer.classList.remove('d-block')
        bgContainer.classList.add('d-none')
      }
    }, 1000)
  })

  onUnmounted(() => {
    if (timeinterval !== null) {
      clearInterval(timeinterval)
    }
  })

  // import Modals from './components/Modals.vue';
  //   import app from './config/app'

  //   document.title = app.name

  //   get client height
  //   let clientHeight = document.documentElement.clientHeight

  //   //   when resize window
  //   window.onresize = () => {
  //     clientHeight = document.documentElement.clientHeight
  //   }
</script>

<style>
  .background-container {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 2;
    background: black;
  }

  .bg-center {
    /* 将 div 的内容上下左右居中 */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .editable {
    border: 0;
    outline: 0;
    background: transparent;
    width: 100%;
  }
</style>
