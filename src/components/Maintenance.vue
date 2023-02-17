<template>
  <div v-if="maintenances.length">
    <n-alert
      :title="
        (maintenances[0].module
          ? maintenances[0].module.name + ': '
          : '维护通知: ') + maintenances[0].name
      "
      type="warning"
      :bordered="bordered"
      :closable="true"
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
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { NAlert } from 'naive-ui'
  import http from '../plugins/http.js'

  const maintenances = ref([])
  const bordered = ref(false)

  let interval = null
  let refresh_interval = null

  function refresh() {
    http.get('maintenances').then((res) => {
      maintenances.value = res.data
    })
  }

  onMounted(() => {
    refresh()

    refresh_interval = setInterval(() => {
      refresh()
    }, 10000)

    interval = setInterval(() => {
      bordered.value = !bordered.value
    }, 1000)
  })

  onUnmounted(() => {
    interval && clearInterval(interval)
    refresh_interval && clearInterval(refresh_interval)
  })
</script>
