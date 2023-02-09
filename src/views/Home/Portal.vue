<template>
  <!--  <n-h1 prefix="bar" align-text type="success">-->
  <!--    <n-text type="success">-->
  <!--      游戏容器 i9 限量出售-->
  <!--    </n-text>-->
  <!--  </n-h1>-->

  <div class="flex items-center align-center justify-center h-full">
    <div class="text-center">
      <div style="left: -22.5px" class="relative">
        <img src="/assets/images/i7.jpeg" alt="i7" width="200" class="rounded-1 relative inline z-10"
        >
        <img src="/assets/images/i9.jpeg" alt="i9" width="200" class="rounded-1 inline absolute"
             style="left: 45px"
        >
      </div>

      <br/>
      <n-h1>
        游戏容器
        <br/>
        即将推出
      </n-h1>
      <br/>
      <LoginButton text="现在登录" :join="true"/>
    </div>
  </div>

  <div class="absolute bottom-3 left-0 right-0">
    <n-p class="text-center">
      <n-text depth="3">
        <n-a target="_blank" href="https://muhan.ltd">木韩网络</n-a>
        提供服务
      </n-text>
    </n-p>
  </div>

</template>

<script setup>
import {NA, NH1, NP, NText} from 'naive-ui'
import LoginButton from "../../components/LoginButton.vue";

//
</script>