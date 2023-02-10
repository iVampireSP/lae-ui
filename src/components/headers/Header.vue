<template>
  <n-layout v-if="menuOptions.top.length">
    <n-layout-header bordered class="layout-header">
      <n-grid cols="2">
        <n-grid-item>
          <div class="menu-item">
            <n-menu :options="menuOptions.menu" :value="selectedKey"
                    mode="horizontal"/>

          </div>

          <!--            <router-link :to="{name: 'index'}" class="lae-logo ml-2" v-if="isMobile"></router-link>-->

          <!--            <router-link :to="{name: 'index'}" class="lae-logo" style="margin: 0"></router-link>-->
          <n-menu v-if="(!isMobile)" :options="menuOptions.top" :value="selectedKey" mode="horizontal"/>
        </n-grid-item>

        <n-grid-item class="text-right flex items-center justify-end mr-1.5">
          <!--  右侧菜单   -->
          <ClusterReady/>

          <Charge/>

          <User/>


          <n-popover
              v-if="isMobile || isTablet"
              ref="mobilePopoverRef"
              display-directive="show"
              placement="bottom-end"
              style="padding: 0; width: 288px"
              trigger="click"
          >
            <template #trigger>
              <n-icon size="20" style="margin-left: 12px">
                <menu-outline/>
              </n-icon>
            </template>
            <div style="overflow: auto; max-height: 79vh">
              <n-menu
                  :indent="18"
                  :options="menuOptions.top"
                  :value="selectedKey"
              />
              <n-menu
                  :indent="18"
                  :options="menuOptions.left"
                  :value="selectedKey"
              />
            </div>
          </n-popover>
          <div v-else>

            <!--                        <n-button-->
            <!--                            size="small"-->
            <!--                            tag="a"-->
            <!--                            quaternary-->
            <!--                            class="nav-picker"-->
            <!--                            href="#"-->
            <!--                            target="_blank"-->
            <!--                        >-->
            <!--                          GitHub-->
            <!--                        </n-button>-->
            <!--                        <n-text class="nav-picker padded">-->
            <!--                          version-->
            <!--                        </n-text>-->
          </div>
        </n-grid-item>

      </n-grid>
    </n-layout-header>
  </n-layout>

</template>

<script setup>

import {NGrid, NGridItem, NIcon, NLayout, NLayoutHeader, NMenu, NPopover} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../../utils/composables.js";
import {menuOptions, selectedKey} from "../../plugins/menuOptions.js"

import {MenuOutline} from "@vicons/ionicons5"


import ClusterReady from "./ClusterReady.vue";
import User from "./User.vue";
import Charge from "./Charge.vue";


const isMobile = useIsMobile()
const isTablet = useIsTablet()


</script>

<style scoped>
.layout-header {
  padding: 10px
}
</style>
