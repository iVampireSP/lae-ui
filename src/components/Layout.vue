<template>
  <HeaderVue v-if="user.state.token"/>

  <n-layout
      :position="isMobile ? 'static' : 'absolute'"
      :style="{
      top: user.state.token ? (isMobile ? '' : 'var(--header-height)') : '',
    }"
      has-sider
  >
    <n-layout-sider
        v-if="user.state.token && !isMobile && !isTablet"
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
        content-style="padding: 24px;padding-top: 10px"
    >
      <Maintenance v-if="user.state.token" class="mb-5 mt-1"/>

      <LoadingVue :show="app.loading.value">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="fade">
            <component :is="Component"/>
          </transition>
        </router-view>
      </LoadingVue>

      <n-back-top/>

      <div class="mt-2"></div>
    </n-layout>
  </n-layout>

  <div>
    <Notifications/>
  </div>
</template>

<script setup>


import {NBackTop, NLayout, NLayoutSider} from 'naive-ui'

import {useIsMobile, useIsTablet} from '../utils/composables.js'
import user from '../plugins/stores/user.js'

import HeaderVue from './headers/Header.vue'
import Menu from './Menu.vue'
import Maintenance from './Maintenance.vue'
import LoadingVue from './Loading.vue'

import {menuCollapsed} from '../plugins/menuOptions.js'
import Notifications from './Notifications.vue'

import app from '../config/app'

const isMobile = useIsMobile()
const isTablet = useIsTablet()
</script>
