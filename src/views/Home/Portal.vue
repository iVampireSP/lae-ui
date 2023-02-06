<template>
  <!--  <n-h1 prefix="bar" align-text type="success">-->
  <!--    <n-text type="success">-->
  <!--      游戏容器 i9 限量出售-->
  <!--    </n-text>-->
  <!--  </n-h1>-->

  <div class="flex items-center align-center justify-center h-full">
    <div class="text-center">
      <img src="/assets/images/i9.jpeg" alt="i9" width="200" class="rounded inline"
           style="box-shadow: rgb(22 57 141) 0 0 20px 6px">
      <br/>
      <n-h1>
        游戏容器
        <br/>
        即将推出
      </n-h1>
      <br />
      <LoginButton text="现在登录" />
    </div>
  </div>

</template>

<script setup>
import {NH1} from 'naive-ui'
import LoginButton from "../../components/LoginButton.vue";

//
</script>