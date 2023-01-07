<template>
  <n-layout v-if="menuOptions.top.length">
    <n-layout-header bordered class="layout-header">

      <n-grid cols="2">
        <n-grid-item>
          <n-menu mode="horizontal" :value="selectedKey" :options="menuOptions.top" v-if="(!isMobile)"/>
          <router-link :to="{name: 'index'}" class="lae-logo ml-2" v-if="isMobile"></router-link>
        </n-grid-item>

        <n-grid-item class="text-right flex items-center justify-end mr-1.5">

          <ClusterReady />

          <n-popover
              v-if="isMobile || isTablet"
              ref="mobilePopoverRef"
              style="padding: 0; width: 288px"
              placement="bottom-end"
              display-directive="show"
              trigger="click"
          >
            <template #trigger>
              <n-icon size="20" style="margin-left: 12px">
                <menu-outline/>
              </n-icon>
            </template>
            <div style="overflow: auto; max-height: 79vh">
              <n-menu
                  :value="selectedKey"
                  :options="menuOptions.left"
                  :indent="18"
              />
            </div>
          </n-popover>
          <div v-else>

            <!--            <n-button-->
            <!--                size="small"-->
            <!--                tag="a"-->
            <!--                quaternary-->
            <!--                class="nav-picker"-->
            <!--                href="#"-->
            <!--                target="_blank"-->
            <!--            >-->
            <!--              GitHub-->
            <!--            </n-button>-->
            <!--            <n-text class="nav-picker padded">-->
            <!--              version-->
            <!--            </n-text>-->
          </div>
        </n-grid-item>

      </n-grid>
    </n-layout-header>
  </n-layout>

</template>

<style scoped>
.layout-header {
  padding: 8px
}
</style>

<script setup>
import {NGrid, NGridItem, NIcon, NLayout, NLayoutHeader, NMenu, NPopover} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../utils/composables.js";

import {h} from "vue"

import {menuOptions, selectedKey} from "../config/menuOptions.js"

import {MenuOutline} from "@vicons/ionicons5"
import ClusterReady from "./ClusterReady.vue";

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const isMobile = useIsMobile()
const isTablet = useIsTablet()


</script>

<style scoped>
/*.nav-end {*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/
</style>