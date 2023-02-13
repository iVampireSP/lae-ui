<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        流量补给
      </n-text>
    </n-h1>

    <n-card>
      <n-row>
        <n-col :span="12">
          <n-statistic label="当前流量" :value="traffic.free_traffic">
            <template #suffix>
              GB
            </template>
          </n-statistic>
        </n-col>
        <n-col :span="12">
          <n-statistic label="签到状态">
            <div v-if="traffic.is_signed">
              今日已签到
            </div>
            <div v-else>
              <n-button :loading="loading" @click="sign">
                试试手气
              </n-button>
            </div>

          </n-statistic>
        </n-col>
      </n-row>
    </n-card>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {NButton, NCard, NCol, NH1, NRow, NStatistic, NText, useDialog} from 'naive-ui'
import gateway from "../../../plugins/gateway.js";

const dialog = useDialog()

const traffic = ref({
  last_sign_at: null,
  free_traffic: 0
})

// const nextSignAt = ref('')

const loading = ref(false)

gateway.get('frp/traffic').then(res => {
  traffic.value = res.data
}).finally(() => {
  // refreshSign()
})

function sign() {
  loading.value = true
  gateway.post('frp/traffic').then(res => {
    traffic.value = res.data

    let content = `获得了 ${res.data.traffic} GB 流量！`

    if (res.data.traffic === 0) {
      content = '没有获得流量～'
    }

    dialog.success({
      title: '签到成功',
      content: content,
      positiveText: res.data.traffic === 0 ? '呜' : '哇',
    })

  }).finally(() => {
    loading.value = false
    // refreshSign()
  })
}

// function refreshSign() {
//   const date = new Date(traffic.value.last_sign_at)
//
//
//   if (traffic.value.last_sign_at) {
//     date.setDate(date.getDate() + 1)
//     // nextSignAt.value = date.toLocaleString()
//     // 算出差多少小时
//     const diff = date.getTime() - new Date().getTime()
//     const hours = Math.floor(diff / 1000 / 60 / 60)
//     const minutes = Math.floor(diff / 1000 / 60 % 60)
//     nextSignAt.value = `${hours} 小时 ${minutes} 分钟`
//
//   } else {
//     nextSignAt.value = null
//   }
// }

</script>