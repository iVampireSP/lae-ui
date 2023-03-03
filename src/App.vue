<template>

  <n-config-provider :date-locale="dateZhCN" :hljs="hljs" :locale="zhCN" :theme="theme"
                     :theme-overrides="themeOverrides" preflight-style-disabled
  >
    <n-global-style/>
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider :max="3">
          <n-dialog-provider>

            <!--  加载动画  -->
            <transition name="fade">

              <div v-show="load_step === 1">
                <div class="flex h-screen">
                  <div class="m-auto text-center">
                    <Lottie v-if="osThemeRef === 'dark'" :loop="false" name="lae-jump"/>
                    <Lottie v-else :loop="false" name="lae-jump-black"/>
                    <n-h3>莱云</n-h3>
                  </div>
                </div>
              </div>
            </transition>

            <!--  页面   -->
            <transition name="fade">
              <div v-if="load_step === 2">
                <LayoutVue/>
              </div>
            </transition>

          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {computed, ref} from 'vue'
import hljs from 'highlight.js/lib/core';
import ini from 'highlight.js/lib/languages/ini'

import LayoutVue from './components/Layout.vue'

import {
  darkTheme,
  dateZhCN,
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NH3,
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useOsTheme,
  zhCN
} from 'naive-ui'
import Lottie from "./components/Lottie.vue";

const osThemeRef = useOsTheme();
const theme = computed(() => osThemeRef.value === "dark" ? darkTheme : null)

const load_step = ref(1)

if (process.env.NODE_ENV === 'production') {
  window.onload = () => {
    setTimeout(() => {
      load_step.value = 1
      setTimeout(() => {
        load_step.value = 2
      }, 500)
    }, 250)
  }
} else {
  load_step.value = 2
}

hljs.registerLanguage('ini', ini)

// 主题调整
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
// const themeOverrides = {
//   common: {
//     primaryColor: '#ec4b2d',
//     primaryColorHover: '#ec4b2d',
//   },
//   Button: {
//     textColor: '#ec4b2d'
//   },
//
// }

const themeOverrides = {}


</script>