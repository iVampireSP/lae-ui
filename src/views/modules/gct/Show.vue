<template>
  <div>
    <n-h1 align-text prefix="bar">
      <n-gradient-text>
        {{ gct.name }}
      </n-gradient-text>
    </n-h1>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {
  NButton,
  NButtonGroup,
  NForm,
  NFormItem,
  NGi,
  NGradientText,
  NGrid,
  NH1,
  NH3,
  NSlider,
  NSpin,
  useDialog,
  useMessage
} from 'naive-ui'

import http from '../../../plugins/http'
import {useRoute} from "vue-router";

const router = useRoute()

const modifying = ref(false)

const stopping = ref(false)

const message = useMessage()
const dialog = useDialog()

const gct = ref({
  name: '',
  server_id: '',
  price: '',
  egg_id: '',
  memory: 1024,
  disk: 1024,
  cpu_limit: 100,
  allocations: 1,
  backups: 1,
  databases: 1,
})

const formatTooltip = (value) => `${value / 1024} GB`
const formatCpuLimitTooltip = (value) => `相当于 ${value / 100} 核`
const formatDiskTooltip = (value) => `${value} MB`
const formatCommonTooltip = (value) => `${value} 个`


http.get('/modules/gct/hosts/' + router.params.id).then((res) => {
  gct.value = res.data
})


function update() {
}

function powerAction(type) {
  if (type === "kill") {
    dialog.warning({
      title: "警告",
      content: "你确定要强制停止服务器吗, 这样做可能会丢失数据!",
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        http.post('/modules/gct/hosts/' + router.params.id + '/server/power?signal=kill').then((res) => {
          message.success("正在强制停止服务器")
          stopping.value = false
        })
      }
    })
    return
  }
  // type: restart start stop kill
  http.post('/modules/gct/hosts/' + router.params.id + '/server/power?signal=' + type).then((res) => {
    if (type === "restart") {
      message.success("正在重启服务器")
    } else if (type === "start") {
      message.success("正在启动服务器")
    } else if (type === "stop") {
      message.success("正在停止服务器")
      stopping.value = true
    }
  })
}

</script>

<style scoped>
.light-green {
  height: 108px;
  background-color: rgba(0, 128, 0, 0.12);
}
</style>