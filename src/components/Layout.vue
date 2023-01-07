<template>
  <HeaderVue v-if="user.state.token"/>

  <div>
    <n-layout style="height: 100vh">
      <n-layout position="absolute" has-sider>
        <n-layout-sider
            :show-collapsed-content="false"
            :native-scrollbar="false"
            bordered
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            show-trigger="arrow-circle"
            v-if="user.state.token && (!isMobile && !isTablet)"
        >
          <Menu/>

          <div style="margin-top: 100px"></div>

        </n-layout-sider>
        <n-layout content-style="padding: 24px;" :native-scrollbar="false">

          <!--          <router-view v-slot="{ Component }">-->
          <!--            <transition name="fade" mode="out-in">-->
          <!--              <keep-alive>-->
          <!--                <component :is="Component"/>-->
          <!--              </keep-alive>-->
          <!--            </transition>-->
          <!--          </router-view>-->

          <router-view/>

          <div style="margin-top: 10rem" v-if="(isMobile)"></div>
          <div style="margin-top: 8rem" v-if="(!isMobile && !isTablet)"></div>


        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import {NLayout, NLayoutSider} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../utils/composables.js";
import user from "../plugins/stores/user.js";

import HeaderVue from './Header.vue'
import Menu from './Menu.vue'


const isMobile = useIsMobile()
const isTablet = useIsTablet()

</script>