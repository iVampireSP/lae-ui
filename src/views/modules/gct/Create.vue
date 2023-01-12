<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        新建容器
      </n-text>
    </n-h1>
    <n-p>游戏容器具有无法比拟的弹性伸缩优势，只需要一个页面即可快速新建。</n-p>

    <n-card>
      <n-spin :show="creating">
        <n-form ref="form" :model="create_gct" :rules="rules">
          <n-grid cols="1 s:2" responsive="screen" x-gap="12">
            <n-gi>
              <n-form-item label="容器名称" path="name">
                <n-input v-model:value="create_gct.name" @keydown.enter.prevent/>
              </n-form-item>
              <n-form-item label="地区" path="location_id">
                <n-input-group>
                  <n-select
                      v-if="locations.length > 0"
                      v-model:value="create_gct.location_id"
                      :options="returnLocation()"
                      :render-option="locationSelectRenderOption"
                      placeholder="请选择地区"
                  />
                  <n-text v-else>暂时不能提供地区</n-text>
                  <!--                  <n-input-group-label>此节点基础价格 {{ create_gct.server_id }} 元</n-input-group-label>-->
                </n-input-group>
              </n-form-item>
              <n-form-item label="要开的服务器" path="egg_id">

                <n-select v-model:value="create_gct.egg_id" :options="options"/>

              </n-form-item>

              <n-form-item label="端口数量">
                <n-slider v-model:value="create_gct.allocations" :default-value="1" :step="1" :max="10" :min="1"
                          :show-tooltip="create_gct.allocations > 3" :format-tooltip="formatCommonTooltip"/>
              </n-form-item>

            </n-gi>
            <n-gi>
              <n-form-item label="内存">
                <!--                <n-input v-model:value="create_gct.name" @keydown.enter.prevent/>-->
                <n-slider v-model:value="create_gct.memory" :default-value="1024" :step="512" :max="10240" :min="512"
                          :show-tooltip="create_gct.memory > 2048" :format-tooltip="formatTooltip"/>
              </n-form-item>
              <n-form-item label="CPU 限制">
                <n-slider v-model:value="create_gct.cpu_limit" :default-value="100" :step="50" :max="800" :min="100"
                          :show-tooltip="create_gct.cpu_limit > 400" :format-tooltip="formatCpuLimitTooltip"/>
              </n-form-item>
              <n-form-item label="存储大小">
                <n-slider v-model:value="create_gct.disk" :default-value="100" :step="50" :max="10240" :min="100"
                          :show-tooltip="create_gct.disk > 300" :format-tooltip="formatDiskTooltip"/>
              </n-form-item>
              <n-form-item label="备份数量">
                <n-slider v-model:value="create_gct.backups" :default-value="1" :step="1" :max="8" :min="1"
                          :show-tooltip="create_gct.backups > 3" :format-tooltip="formatCommonTooltip"/>
              </n-form-item>
            </n-gi>
          </n-grid>
        </n-form>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import {h, ref} from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NH1,
  NInput,
  NInputGroup,
  NP,
  NSelect,
  NSlider,
  NSpin,
  NText,
  NTooltip
} from 'naive-ui'

import http from '../../../plugins/http'

import {useIsMobile} from "../../../utils/composables.js";

const creating = ref(false)

const create_gct = ref({
  name: '',
  server_id: '',
  price: '',
  egg_id: '',
  memory: 1024,
  disk: 100,
  cpu_limit: 100,
  allocations: 1,
  backups: 1,
  databases: 1,
})

const locations = ref([])

const form = ref(null)

const isMobile = useIsMobile()

http.get('/modules/gct/locations').then((res) => {
  locations.value = res.data
  // 先预先选择
  create_gct.value.location_id = locations.value[0].id
})

const returnLocation = () => {
  return locations.value.map(location => {
    return {
      label: location.name,
      value: location['id']
    }
  })
}

const locationSelectRenderOption = ({node, option}) => h(NTooltip, null, {
  trigger: () => node,
  default: () => {

    // 寻找对于的地区
    const location = locations.value.find(location => location['id'] === option.value)
    return h("pre", null, {
      default: () => location['description'] ?? '描述加载失败'
    })
  }
})

const nests = ref([])

const options = ref([])


http.get('/modules/gct/nests').then((res) => {
  nests.value = res.data

  for (let nest in nests.value) {
    nest = nests.value[nest]

    options.value.push({
      label: nest.name,
      disabled: true
    })

    // push eggs
    for (let egg in nest['eggs']) {
      egg = nest['eggs'][egg]

      options.value.push({
        label: egg.name,
        value: egg.id,
        disabled: false
      })
    }
  }
}).then(() => {
  // 先预先选择
  create_gct.value.egg_id = options.value[1].value
})


const formatTooltip = (value) => `${value / 1024} GB`
const formatCpuLimitTooltip = (value) => `相当于 ${value / 100} 核`
const formatDiskTooltip = (value) => `${value} MB`
const formatCommonTooltip = (value) => `${value} 个`

const rules = {
  name: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('名称是必填的')
        }
        if (value.length > 20) {
          return new Error('名称不能超过 20 个字符')
        }
        return true;
      },
      trigger: ["input", "blur"]
    }
  ],
  egg_id: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要选择镜像')
        }

        return true;
      },
      trigger: ["input", "blur"]
    }
  ],
  location_id: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请指定地区')
        }

        return true;
      },
      trigger: ["input", "blur"]
    }
  ],
};


</script>

<style scoped>

</style>