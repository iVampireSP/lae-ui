<template>
  <HeaderVue v-if="user.state.token"/>

  <n-layout :position="isMobile ? 'static' : 'absolute'"
            :style="{top: isMobile ? '' : 'var(--header-height)'}"
            has-sider
  >

    <n-layout-sider
        v-if="user.state.token && (!isMobile && !isTablet)"
        :collapsed="menuCollapsed.left"
        :collapsed-width="64"
        :native-scrollbar="false"
        :show-collapsed-content="false"
        :width="240"
        bordered
        collapse-mode="width"
        show-trigger="arrow-circle"
        @collapse="menuCollapsed.left = true"
        @expand="menuCollapsed.left = false"
    >
      <Menu/>
    </n-layout-sider>

    <n-layout
        :native-scrollbar="false"
        content-style="padding: 24px"
    >

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component"/>
        </transition>
      </router-view>
    </n-layout>
  </n-layout>
</template>

<script setup>
import {NLayout, NLayoutSider} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../utils/composables.js";
import user from "../plugins/stores/user.js";

import HeaderVue from './headers/Header.vue'
import Menu from './Menu.vue'

import {menuCollapsed} from "../config/menuOptions.js";

const isMobile = useIsMobile()
const isTablet = useIsTablet()

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>