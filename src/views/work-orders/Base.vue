<template>

</template>
<script setup>
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