<template>
  <HeaderVue v-if="user.state.token"/>

  <n-layout :position="isMobile ? 'static' : 'absolute'"
            :style="{top: isMobile ? '' : 'var(--header-height)'}"
            has-sider
  >
    <n-layout-sider
        v-if="user.state.token && (!isMobile && !isTablet) && !menuHide.left"
        :collapsed-width="0"
        :native-scrollbar="false"
        :show-collapsed-content="false"
        :width="240"
        bordered
        collapse-mode="transform"
        show-trigger="arrow-circle"
    >
      <Menu/>

    </n-layout-sider>
    <n-layout
        :native-scrollbar="false"
        content-style="padding: 24px"

    >

      <!--          <router-view v-slot="{ Component }">-->
      <!--            <transition name="fade" mode="out-in">-->
      <!--              <keep-alive>-->
      <!--                <component :is="Component"/>-->
      <!--              </keep-alive>-->
      <!--            </transition>-->
      <!--          </router-view>-->

      <router-view/>

      <!--          <div style="height: 10rem" v-if="(isMobile)"></div>-->
      <!--          <div style="height: 8rem" v-if="(!isMobile && !isTablet)"></div>-->

      <!--      <n-layout-footer bordered>-->
      <!--        Footer Footer Footer-->
      <!--        <br/>-->
      <!--        Footer Footer Footer-->
      <!--        <br/>Footer Footer Footer-->
      <!--        <br/>Footer Footer Footer-->
      <!--        <br/>Footer Footer Footer-->
      <!--        <br/>-->
      <!--      </n-layout-footer>-->

    </n-layout>
  </n-layout>
</template>

<script setup>
import {NLayout, NLayoutSider} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../utils/composables.js";
import user from "../plugins/stores/user.js";

import HeaderVue from './headers/Header.vue'
import Menu from './Menu.vue'

import {menuHide} from "../config/menuOptions.js";


const isMobile = useIsMobile()
const isTablet = useIsTablet()

</script>