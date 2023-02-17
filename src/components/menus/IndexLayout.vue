<template>
  <div>
    <Maintenance v-if="user.state.token" />
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  import {
    addMenuOptions,
    removeAllMenuOptionsThen,
  } from '../../plugins/menuOptions.js'

  import user from '../../plugins/stores/user'

  import {
    HomeOutline,
    PinOutline,
    PricetagsSharp,
    Server,
  } from '@vicons/ionicons5'
  import {
    CakeRound,
    MessageOutlined,
    MonitorHeartFilled,
    SupportAgentRound,
  } from '@vicons/material'

  import Maintenance from '../Maintenance.vue'

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
  })
</script>
