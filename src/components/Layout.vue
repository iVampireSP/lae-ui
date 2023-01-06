<template>
  <div>
    <div>
      <HeaderVue/>
    </div>

    <div>
      <n-layout has-sider>
        <n-layout-sider
            bordered
            show-trigger
            collapse-mode="width"
            :collapsed-width="64"
            :width="240"
            :native-scrollbar="false"
            style="max-height: 320px"
        >
          <n-menu
              :collapsed-width="64"
              :collapsed-icon-size="22"
              :options="menuOptions"
          />
        </n-layout-sider>
        <n-layout style="max-height: 320px"/>
      </n-layout>
      <router-view/>
    </div>

    <div>
      <!--      <n-layout-footer  bordered>-->
      <!--        Footer Footer Footer-->
      <!--      </n-layout-footer>-->
    </div>
  </div>
</template>

<script setup>
import HeaderVue from './Header.vue'
import {NIcon, NLayout, NLayoutSider, NMenu} from 'naive-ui'
import {BookOutline as BookIcon, PersonOutline as PersonIcon, WineOutline as WineIcon} from "@vicons/ionicons5";
import {h} from "vue";

function renderIcon(icon) {
  return () => h(NIcon, null, {default: () => h(icon)});
}


const menuOptions = [
  {
    label: "且听风吟",
    key: "hear-the-wind-sing",
    icon: renderIcon(BookIcon)
  },
  {
    label: "1973年的弹珠玩具",
    key: "pinball-1973",
    icon: renderIcon(BookIcon),
    disabled: true,
    children: [
      {
        label: "鼠",
        key: "rat"
      }
    ]
  },
  {
    label: "寻羊冒险记",
    key: "a-wild-sheep-chase",
    disabled: true,
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
