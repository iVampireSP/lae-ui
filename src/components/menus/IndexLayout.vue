<template>
  <div>
    <div v-if="maintenances.length">
      <n-alert
        :title="
          (maintenances[0].module ? maintenances[0].module.name : '') +
          ': ' +
          maintenances[0].name
        "
        type="warning"
        :bordered="bordered"
      >
        {{ maintenances[0].content }}

        <br />
        <span v-if="maintenances[0].start_at">
          <span>开始时间: </span>
          <span>{{ new Date(maintenances[0].start_at).toLocaleString() }}</span>
        </span>
        <span v-if="maintenances[0].end_at">
          <span v-show="maintenances[0].start_at">, </span>

          <span>结束时间: </span>
          <span>{{ new Date(maintenances[0].end_at).toLocaleString() }}</span>
        </span>
      </n-alert>
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { ref, onUnmounted } from 'vue'

  import {
    addMenuOptions,
    removeAllMenuOptionsThen,
  } from '../../plugins/menuOptions.js'

  import http from '../../plugins/http.js'

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

  import { NAlert } from 'naive-ui'

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

  const maintenances = ref([])
  const bordered = ref(false)

  let interval = null

  http.get('maintenances').then((res) => {
    maintenances.value = res.data

    interval = setInterval(() => {
      bordered.value = !bordered.value
    }, 1000)
  })

  onUnmounted(() => {
    interval && clearInterval(interval)
  })
</script>
