<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      工单
    </n-text>
  </n-h1>
  <n-alert title="抱歉" type="warning">
    工单页面正在开发中，因此暂时无法使用，敬请期待。
  </n-alert>
</template>

<script setup>
import {NAlert, NH1, NText} from 'naive-ui'
import {addMenuOptions, removeAllMenuOptionsThen} from "../../config/menuOptions.js"
import {MessageOutlined} from "@vicons/material"
import {HomeOutline, PinOutline} from "@vicons/ionicons5"

removeAllMenuOptionsThen('left', () => {

// 注册菜单
  addMenuOptions('left', 'index', '首页', HomeOutline)
  addMenuOptions('left', 'pinned', '固钉', PinOutline)
  addMenuOptions('left', 'announcements', '公告', MessageOutlined)
})
</script>

<style scoped></style>
