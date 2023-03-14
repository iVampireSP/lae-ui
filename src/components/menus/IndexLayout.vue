<template>
  <div>
    <slot />
  </div>
</template>

<script setup>
  import {
    addMenuOptions,
    removeAllMenuOptionsThen,
  } from '../../plugins/menuOptions.js'

  import {
    HomeOutline,
    PinOutline,
    PricetagsSharp,
    Server,
    Information,
    DocumentTextOutline
  } from '@vicons/ionicons5'
  import {
    CakeRound,
    MessageOutlined,
    MonitorHeartFilled,
    SupportAgentRound,
  } from '@vicons/material'

  removeAllMenuOptionsThen('left', () => {
    // 注册菜单
    addMenuOptions('left', 'index', '首页', HomeOutline)
    addMenuOptions('left', 'forum.pinned', '固钉', PinOutline)
    addMenuOptions('left', 'forum.announcements', '公告', MessageOutlined)
    addMenuOptions('left', 'forum.partner', '合作', PricetagsSharp)
    addMenuOptions('left', 'hosts', '主机', Server)
    addMenuOptions('left', 'status', '监控', MonitorHeartFilled)
    addMenuOptions('left', 'work-orders', '工单', SupportAgentRound)
    addMenuOptions('left', 'stars', '繁星', CakeRound)
    addMenuOptions('left', 'api-docs', 'API 文档', DocumentTextOutline)
    addMenuOptions('left', 'about', '关于', Information)
  })
</script>
