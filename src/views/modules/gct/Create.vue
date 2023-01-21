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
                      @update:value="selectedLocation = locations.find((location) => location.id === create_gct.location_id)"
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
                <n-slider v-model:value="create_gct.memory" :default-value="1024" :step="512" :max="10240" :min="1024"
                          :show-tooltip="create_gct.memory > 2048" :format-tooltip="formatTooltip"/>
              </n-form-item>
              <n-form-item label="CPU 限制">
                <n-slider v-model:value="create_gct.cpu_limit" :default-value="100" :step="50" :max="800" :min="100"
                          :show-tooltip="create_gct.cpu_limit > 400" :format-tooltip="formatCpuLimitTooltip"/>
              </n-form-item>
              <n-form-item label="存储大小">
                <n-slider v-model:value="create_gct.disk" :default-value="1024" :step="512" :max="10240" :min="1024"
                          :show-tooltip="create_gct.disk > 4096" :format-tooltip="formatDiskTooltip"/>
              </n-form-item>
              <n-form-item label="备份数量">
                <n-slider v-model:value="create_gct.backups" :default-value="1" :step="1" :max="8" :min="1"
                          :show-tooltip="create_gct.backups > 3" :format-tooltip="formatCommonTooltip"/>
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-grid cols="1 s:2" responsive="screen" x-gap="12">
            <n-gi class="text-left">
              <n-grid cols="1 s:2" responsive="screen" x-gap="12">
                <n-gi>
                  节点: <span v-text="selectedLocation.price.toFixed(2)"></span> 元
                </n-gi>
                <n-gi>
                  核心: <span v-text="((create_gct.cpu_limit / 100) * selectedLocation.cpu_price).toFixed(2)"></span> 元
                </n-gi>
                <n-gi>
                  内存: <span v-text="((create_gct.memory / 1024) * selectedLocation.memory_price).toFixed(2)"></span> 元

                </n-gi>
                <n-gi>
                  存储: <span v-text="((create_gct.disk / 1024) * selectedLocation.disk_price).toFixed(2)"></span> 元

                </n-gi>

                <n-gi>
                  端口: <span v-text="(create_gct.allocations * selectedLocation.allocation_price).toFixed(2)"></span> 元

                </n-gi>

                <n-gi>
                  备份: <span v-text="(create_gct.backups * selectedLocation.backup_price).toFixed(2)"></span> 元

                </n-gi>
              </n-grid>

            </n-gi>

            <n-gi class="text-right">
              <n-p>
                大约: <span v-text="(
                (create_gct.disk / 1024) * selectedLocation.disk_price +
                (create_gct.memory / 1024) * selectedLocation.memory_price +
                (create_gct.cpu_limit / 100) * selectedLocation.cpu_price +
                selectedLocation.price
              ).toFixed(2)"></span> 元 / 月
              </n-p>
              <n-button type="primary" @click="deploy">部署我的服务器</n-button>
            </n-gi>
          </n-grid>

        </n-form>

        <template #description>
          <n-p v-text="lyric()">
          </n-p>
        </template>
      </n-spin>
    </n-card>
  </div>
</template>

<script setup>
import {h, ref} from 'vue'
import {
  NButton,
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
  NTooltip,
  useDialog
} from 'naive-ui'
import gateway from '../../../plugins/gateway'
import lyric from "../../../plugins/lyric.js";

const creating = ref(false)

const create_gct = ref({
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

const locations = ref([])

const form = ref(null)

// http.get('/modules/gct/locations').then((res) => {
//   locations.value = res.data
//   // 先预先选择
//   create_gct.value.location_id = locations.value[0].id
//   selectedLocation.value = locations.value[0]
//
//   console.log(selectedLocation.value)
// })

gateway.get('gct', 'locations', [], (res) => {
  locations.value = res.data
  // 先预先选择
  create_gct.value.location_id = locations.value[0].id
  selectedLocation.value = locations.value[0]

  console.log(selectedLocation.value)
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


const selectedLocation = ref({
  id: '',
  name: '',
  description: '',
  price: 0,
  cpu_price: 0,
  memory_price: 0,
  disk_price: 0,
  allocation_price: 0.01,
  backup_price: 0.01,
})


const nests = ref([])

const options = ref([])

// http.get('/modules/gct/nests').then((res) => {
//   nests.value = res.data
//
//   for (let nest in nests.value) {
//     nest = nests.value[nest]
//
//     options.value.push({
//       label: nest.name,
//       disabled: true
//     })
//
//     // push eggs
//     for (let egg in nest['eggs']) {
//       egg = nest['eggs'][egg]
//
//       options.value.push({
//         label: egg.name,
//         value: egg.egg_id,
//         disabled: false
//       })
//     }
//   }
// }).then(() => {
//   // 先预先选择
//   create_gct.value.egg_id = options.value[1].value
// })

gateway.get('gct', 'nests', [], (res) => {

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
        value: egg.egg_id,
        disabled: false
      })
    }
  }

  create_gct.value.egg_id = options.value[1].value

})


const dialog = useDialog()

const deploy = () => {
  form.value?.validate().then((errors) => {
    if (!errors) {

      // creating.value = true
      //
      // http
      //     .post('/modules/gct/hosts', create_gct.value)
      //     .then((res) => {
      //       console.log(res)
      //       dialog.success({
      //         title: '好~',
      //         content: '已经开始排队部署容器了，稍等一下就好了。',
      //         positiveText: '哇',
      //       })
      //     }).finally(() => {
      //   creating.value = false
      // })


      dialog.success({
        title: '好~',
        content: '已经开始排队部署容器了，稍等一下就好了。',
        positiveText: '哇',
      })

      gateway.post('gct', 'hosts', create_gct.value).then(() => {
        // console.log(res)
        // creating.value = false
      })

    }
  })

}


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