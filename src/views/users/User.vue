<template>
  <div class="h-100">
    <div>

      <div class="text-center w-100">
        <n-avatar :size="256" :src="avatar" lazy round></n-avatar>
      </div>


      <!--      <n-grid x-gap="2" :cols="2" class="text-center" style="padding-top: 50px">-->
      <!--        <n-gi>-->
      <!--          <div>-->
      <!--            <div-->
      <!--              class="relative"-->
      <!--              style="width: 256px; height: 256px; margin: 0 auto"-->
      <!--            >-->
      <!--              <div class="absolute">-->
      <!--                <n-avatar :size="256" :src="avatar" lazy round></n-avatar>-->
      <!--              </div>-->

      <!--              &lt;!&ndash; <div class="absolute">-->
      <!--                <div class="absolute">-->
      <!--                  <Lottie name="Confetti-ball" :height="150" :width="150" />-->
      <!--                </div>-->

      <!--                <div class="absolute" style="height:100%;width:100%">-->
      <!--                  <Lottie name="Balloon" -->
      <!--                  :height="60" -->
      <!--                  :width ="60" />-->
      <!--                </div>-->
      <!--              </div> &ndash;&gt;-->
      <!--            </div>-->

      <!--            <n-h1>{{ user.name }} #{{ user.id }}</n-h1>-->
      <!--            <n-h3>{{ user.email }}</n-h3>-->
      <!--            <n-text depth="3"-->
      <!--              >注册于 {{ new Date(user.created_at).toLocaleString() }}</n-text-->
      <!--            >-->
      <!--          </div>-->
      <!--        </n-gi>-->
      <!--        <n-gi>-->
      <!--          <n-h2>财务</n-h2>-->
      <!--          <n-h3>余额：{{ user.balance }} 元</n-h3>-->
      <!--        </n-gi>-->
      <!--      </n-grid>-->

      <!--      {{ new Date().getMilliseconds() }}-->

      <!-- <div>
        <Lottie name="" />
      </div> -->
      <!--      <div class="text-center">-->
      <!--        {{ isBirthDayToday }}-->
      <!--        {{ user }}-->
      <!--        &lt;!&ndash;    TODO: 钱 email 注册时间 任务列表&ndash;&gt;-->
      <!--        &lt;!&ndash;    TODO: 彩蛋：生日彩蛋&ndash;&gt;-->
      <!--      </div>-->
    </div>

    <!-- birthday easter egg -->
    <div v-if="!isBirthDayToday">
      <div class="absolute bottom-0 left-8">
        <Lottie :height="200" name="Party-popper"/>
      </div>
      <div class="absolute bottom-0 right-8" style="transform: scale(-1, 1) ">
        <Lottie :height="200" name="Party-popper"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import userStore from '../../plugins/stores/user.js'
import conf from '../../config/api.js'

import {osTheme as osThemeRef} from '../../utils/layout.js'

import {NAvatar,} from 'naive-ui'

import Lottie from '../../components/Lottie.vue'

const user = computed(() => {
  return userStore.state.user
})

// const isMobile = useIsMobile()

const avatar = computed(() => {
  return conf.avatar + user.value.email_md5 + '?s=256'
})

const isBirthDayToday = computed(() => {
  const today = new Date()
  const birthday = new Date(user.value.birthday_at)
  return (
      today.getMonth() === birthday.getMonth() &&
      today.getDate() === birthday.getDate()
  )
})

const isDarkMode = computed(() => {
  return osThemeRef.value === 'dark'
})
</script>
