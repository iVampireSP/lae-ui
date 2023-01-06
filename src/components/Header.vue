<template>

    <n-layout>
      <n-layout-header bordered class="layout-header">

        <n-grid cols="2" >
          <n-grid-item style="text-align: left">
            <n-menu mode="horizontal" :options="menuOptions"/>
          </n-grid-item>

          <n-grid-item class="text-right flex items-center justify-end">
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
                    :value="mobileMenuValue"
                    :options="mobileMenuOptions"
                    :indent="18"

                />
              </div>
            </n-popover>
            <div v-else>

              <n-button
                  size="small"
                  tag="a"
                  quaternary
                  class="nav-picker"
                  href="#"
                  target="_blank"
              >
                GitHub
              </n-button>
              <n-text class="nav-picker padded">
                version
              </n-text>
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
import {NButton, NGrid, NGridItem, NIcon, NLayoutHeader, NMenu, NPopover, NText, NLayout} from 'naive-ui'

import {useIsMobile, useIsTablet} from "../utils/composables.js";

import {computed, h} from "vue"
import {useRoute} from 'vue-router'

import {findMenuValue} from "../utils/route.js";


import {
  BookOutline as BookIcon,
  MenuOutline,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon
} from "@vicons/ionicons5"

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const route = useRoute()
// const routers = computed(() => routers.value)

const isMobile = useIsMobile()
const isTablet = useIsTablet()

const mobileMenuOptions = computed(() => {
  return [
    {
      key: 'github',
      label: 'GitHub'
    }
  ]
})


const mobileMenuValue = computed(() => {
  if (route.name === 'index') return 'index'
  return findMenuValue(mobileMenuOptions.value, route.path)
})

const menuOptions = [
  {
    label: "且听风吟",
    key: "hear-the-wind-sing",
    icon: renderIcon(BookIcon)
  },
  {
    label: "舞，舞，舞",
    key: "dance-dance-dance",
    icon: renderIcon(BookIcon),
    children: [
      {
        type: "group",
        label: "人物",
        key: "people",
        children: [
          {
            label: "叙事者",
            key: "narrator",
            icon: renderIcon(PersonIcon)
          },
          {
            label: "羊男",
            key: "sheep-man",
            icon: renderIcon(PersonIcon)
          }
        ]
      },
      {
        label: "饮品",
        key: "beverage",
        icon: renderIcon(WineIcon),
        children: [
          {
            label: "威士忌",
            key: "whisky"
          }
        ]
      },
      {
        label: "食物",
        key: "food",
        children: [
          {
            label: "三明治",
            key: "sandwich"
          }
        ]
      },
      {
        label: "过去增多，未来减少",
        key: "the-past-increases-the-future-recedes"
      }
    ]
  }
];


</script>

<style scoped>
/*.nav-end {*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/
</style>