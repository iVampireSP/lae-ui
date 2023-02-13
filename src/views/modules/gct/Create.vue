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
                      @update:value="selectedLocation = locations.find((location) => location.id === create_gct.location_id)"
                  />
                  <n-text v-else>暂时不能提供地区</n-text>
                  <!--                  <n-input-group-label>此节点基础价格 {{ create_gct.server_id }} 元</n-input-group-label>-->
                </n-input-group>
              </n-form-item>
              <n-form-item label="要开的服务器" path="egg_id">

                <n-select v-model:value="create_gct.egg_id" :options="options"/>

              </n-form-item>

              <n-form-item label="端口数量">
                <n-slider v-model:value="create_gct.allocations" :default-value="1"
                          :format-tooltip="formatCommonTooltip" :max="10" :min="1"
                          :show-tooltip="create_gct.allocations > 3" :step="1"/>
              </n-form-item>

            </n-gi>
            <n-gi>
              <n-form-item label="内存">
                <!--                <n-input v-model:value="create_gct.name" @keydown.enter.prevent/>-->
                <n-slider v-model:value="create_gct.memory" :default-value="1024" :format-tooltip="formatTooltip"
                          :max="32768" :min="1024"
                          :show-tooltip="create_gct.memory > 8192" :step="512"/>
              </n-form-item>
              <n-form-item label="CPU 限制">
                <n-slider v-model:value="create_gct.cpu_limit" :default-value="100"
                          :format-tooltip="formatCpuLimitTooltip" :max="800" :min="100"
                          :show-tooltip="create_gct.cpu_limit > 400" :step="50"/>
              </n-form-item>
              <n-form-item label="存储大小">
                <n-slider v-model:value="create_gct.disk" :default-value="1024" :format-tooltip="formatDiskTooltip"
                          :max="65536" :min="1024"
                          :show-tooltip="create_gct.disk > 4096" :step="512"/>
              </n-form-item>
              <n-form-item label="备份数量">
                <n-slider v-model:value="create_gct.backups" :default-value="1" :format-tooltip="formatCommonTooltip"
                          :max="20" :min="1"
                          :show-tooltip="create_gct.backups > 3" :step="1"/>
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-grid cols="1 s:2" responsive="screen" x-gap="12">
            <n-gi class="text-left">
                <n-form-item label="支付方式" class="overflow-x-auto">
                  <n-radio-group v-model:value="create_gct.billing_cycle" name="protocol">
                    <n-radio-button
                        label="动态"
                        value=""
                    />
                    <n-radio-button
                        label="月付"
                        value="monthly"
                    />
                    <n-radio-button
                        label="季付"
                        value="quarterly"
                    />
                    <n-radio-button
                        label="半年付"
                        value="semi-annually"
                    />
                    <n-radio-button
                        label="年付"
                        value="annually"
                    />
                    <n-radio-button
                        label="两年付"
                        value="biennially"
                    />
                    <n-radio-button
                        label="三年付"
                        value="triennially"
                    />
                  </n-radio-group>
                </n-form-item>
            </n-gi>

            <n-gi class="text-right">
              <n-p>
                <span v-text="price"></span> 元 / 月
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
import {h, onUnmounted, ref, watch} from 'vue'
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
  NRadioButton,
  NRadioGroup,
  useDialog
} from 'naive-ui'
import Humanize from "humanize-plus";
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
  billing_cycle: null
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

gateway.get('gct/locations').then(res => {
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

gateway.get('gct/nests').then(res => {

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

const price = ref(0)

function getPrice() {
  gateway.post('gct/calculate', create_gct.value).then((res) => {
    price.value = res.data.price

    console.log(res.data)
  })
}

let last_calculate_at = new Date().getTime()
let last_gct = create_gct.value

// 当 create_gct.value 发生变化时，重新计算价格
watch(create_gct.value, () => {
  // 防止重复计算
  if (new Date().getTime() - last_calculate_at < 1000) {
    return
  }

  if (!create_gct.value.egg_id) {
    return
  }

  last_calculate_at = new Date().getTime()
  last_gct = create_gct.value
  getPrice()
})

let calcPriceInter = setInterval(() => {
  // if (last_gct === create_gct.value) {
  //   // return
  // }

  if (new Date().getTime() - last_calculate_at < 1000) {
    return
  }

  if (!create_gct.value.egg_id) {
    return
  }


  getPrice()

}, 3000)

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


      gateway.post('gct/hosts', create_gct.value).finally(() => {
        creating.value = false

        dialog.success({
          title: '好~',
          content: '已经开始排队部署容器了，稍等一下就好了。',
          positiveText: '哇',
        })
      })


    }
  })

}


const formatTooltip = (value) => `${value / 1024} GB`
const formatCpuLimitTooltip = (value) => `相当于 ${value / 100} 核`
const formatDiskTooltip = (value) => {
  return Humanize.fileSize(value * 1024 * 1024)
}
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

onUnmounted(() => {
  clearInterval(calcPriceInter)
})


</script>

<style scoped>

</style>