<template>
  <div>
    <slot/>
  </div>
</template>

<script setup>

import {addMenuOptions, removeAllMenuOptionsThen} from "../../config/menuOptions.js";

import {HomeOutline, PinOutline, Server} from "@vicons/ionicons5";
import {MessageOutlined, SupportAgentRound, CakeRound} from "@vicons/material"

removeAllMenuOptionsThen('left', () => {
  // 注册菜单
  addMenuOptions('left', 'index', '首页', HomeOutline)
  addMenuOptions('left', 'pinned', '固钉', PinOutline)
  addMenuOptions('left', 'announcements', '公告', MessageOutlined)
  addMenuOptions('left', 'hosts', '主机', Server)
  addMenuOptions('left', 'work-orders', '工单', SupportAgentRound)
  addMenuOptions('left', 'stars', '繁星', CakeRound)
})


</script>

<style scoped>

</style>