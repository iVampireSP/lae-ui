<template>
  <HeaderVue v-if="user.state.token"/>

  <div>
    <n-layout style="height: 100vh">
      <n-layout position="absolute" has-sider>
        <n-layout-sider
            :show-collapsed-content="false"
            content-style="padding-left: 10px;padding-right: 10px;"
            :native-scrollbar="false"
            bordered
            collapse-mode="width"
            :collapsed-width="20"
            :width="240"
            show-trigger="arrow-circle"
            v-if="user.state.token"
        >
          <Menu/>
        </n-layout-sider>
        <n-layout content-style="padding: 24px;" :native-scrollbar="false">

          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <keep-alive>
                <component :is="Component"/>
              </keep-alive>
            </transition>
          </router-view>

        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>
import {NLayout, NLayoutSider} from 'naive-ui'
import HeaderVue from './Header.vue'
import Menu from './Menu.vue'

// import user from "../plugins/stores/user.js";
import user from "../plugins/stores/user.js";</script>