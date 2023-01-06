<template>
  <n-config-provider :date-locale="dateZhCN" :locale="zhCN" :theme="theme">
    <n-global-style/>
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <LayoutVue/>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import {computed} from 'vue'

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
  zhCN
} from 'naive-ui'


const osThemeRef = useOsTheme();
const theme = computed(() => osThemeRef.value === "dark" ? darkTheme : null)

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

</script>