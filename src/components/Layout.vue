<template>
  <HeaderVue/>

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
        >
          <Menu/>
        </n-layout-sider>
        <n-layout content-style="padding: 24px;" :native-scrollbar="false">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component"/>
            </keep-alive>
          </router-view>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<script setup>

import HeaderVue from './Header.vue'
import Menu from './Menu.vue'


import {NLayout, NLayoutSider} from 'naive-ui'

//


</script>