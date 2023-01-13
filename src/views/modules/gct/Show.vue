<template>
  <div>
    <n-h1 align-text prefix="bar">
      <n-gradient-text>
        {{ gct.name }}
      </n-gradient-text>
    </n-h1>
    <n-grid cols="1 s:4" responsive="screen" x-gap="12" class="text-center">
      <n-gi>
        <n-h3>电源操作</n-h3>
        <n-button-group>
          <n-button strong secondary type="info" @click="powerAction('start')">
            开机
          </n-button>
          <n-button strong secondary type="error" @click="powerAction('stop')" v-if="stopping === false">
            停止
          </n-button>
          <n-button strong secondary type="error" @click="powerAction('kill')" v-else>
            强制停止
          </n-button>
          <n-button strong secondary type="warning" @click="powerAction('restart')">
            重启
          </n-button>
        </n-button-group>
      </n-gi>
      <n-gi>
        <n-h3>性能调整</n-h3>
        <n-spin :show="modifying">
          <n-form ref="form" :model="gct">
            <!-- :rules="rules" -->
            <n-form-item label="CPU 限制">
              <n-slider v-model:value="gct.cpu_limit" :default-value="gct.cpu_limit" :step="50" :max="800" :min="100"
                        :show-tooltip="gct.cpu_limit > 400" :format-tooltip="formatCpuLimitTooltip"/>
            </n-form-item>
            <n-form-item label="内存">
              <n-slider v-model:value="gct.memory" :default-value="gct.memory" :step="512" :max="10240" :min="512"
                        :show-tooltip="gct.memory > 2048" :format-tooltip="formatTooltip"/>
            </n-form-item>
            <n-form-item label="存储大小">
              <n-slider v-model:value="gct.disk" :default-value="gct.disk" :step="512" :max="10240" :min="512"
                        :show-tooltip="gct.disk > 4096" :format-tooltip="formatDiskTooltip"/>
            </n-form-item>
            <n-button type="primary" ghost attr-type="submit" @click="update()">保存</n-button>
          </n-form>
        </n-spin>
      </n-gi>
      <n-gi>
        <n-h3>高级设置</n-h3>
        <n-spin :show="modifying">
          <n-form ref="form" :model="gct">
            <!-- :rules="rules" -->
            <n-form-item label="备份数量">
              <n-slider v-model:value="gct.backups" :default-value="gct.backups" :step="1" :max="8" :min="1"
                        :show-tooltip="gct.backups > 3" :format-tooltip="formatCommonTooltip"/>
            </n-form-item>
            <n-form-item label="端口数量">
              <n-slider v-model:value="gct.allocations" :default-value="gct.allocations" :step="1" :max="10" :min="1"
                        :show-tooltip="gct.allocations > 3" :format-tooltip="formatCommonTooltip"/>
            </n-form-item>
            <n-form-item label="数据库数量">
              <n-slider v-model:value="gct.databases" :default-value="gct.databases" :step="1" :max="5" :min="0"
                        :show-tooltip="gct.databases > 0" :format-tooltip="formatCommonTooltip"/>
            </n-form-item>
            <n-button type="primary" ghost attr-type="submit" @click="update()">保存</n-button>
          </n-form>
        </n-spin>
      </n-gi>
      <n-gi>
        <n-h3>重设模板</n-h3>
      </n-gi>
    </n-grid>
    <div class="light-green mt-8"/>
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