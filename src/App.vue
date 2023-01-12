<template>

  <n-config-provider :date-locale="dateZhCN" :hljs="hljs" :locale="zhCN" :theme="theme" preflight-style-disabled
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
                    <Lottie name="lae-jump" :loop="false" v-if="osThemeRef === 'dark'"/>
                    <Lottie name="lae-mouse-leave-2" :loop="false" v-if="osThemeRef !== 'dark'"/>
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
  NLoadingBarProvider,
  NMessageProvider,
  NNotificationProvider,
  useOsTheme,
  zhCN,
    NH3
} from 'naive-ui'
import Lottie from "./components/Lottie.vue";


const osThemeRef = useOsTheme();
const theme = computed(() => osThemeRef.value === "dark" ? darkTheme : null)

const load_step = ref(1)

// 当页面加载完成后，设置 loaded 为 true
window.onload = () => {
  setTimeout(() => {
    load_step.value = 1
    setTimeout(() => {
      load_step.value = 2
    }, 500)
  }, 150)
}

// import {initRouter, siteSetup} from './store'

// export default defineComponent({
//   name: 'SiteProvider',
//   components: {
//     Site
//   },
//   setup() {
//     initRouter(useRouter(), useRoute())
//     return siteSetup()
//   }
// })

hljs.registerLanguage('ini', ini)


</script>