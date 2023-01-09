<template>
  <div>
    <slot/>
  </div>
</template>

<script setup>

import {addMenuOptions, removeAllMenuOptionsThen} from "../../config/menuOptions.js";

import {HomeOutline, PinOutline} from "@vicons/ionicons5";
import {MessageOutlined} from "@vicons/material"

removeAllMenuOptionsThen('left', () => {

// 注册菜单
  addMenuOptions('left', 'index', '首页', HomeOutline)
  addMenuOptions('left', 'announcements', '公告', MessageOutlined)
  addMenuOptions('left', 'pinned', '固钉', PinOutline)
})


</script>

<style scoped>

</style>