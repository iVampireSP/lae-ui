<template>
  <n-spin :show="loading">
    <div class="text-center">
      <div v-if="packet['remain'] ?? 0 > 0">
        <div v-if="packet.user_id === user.state.user.id">
          <Lottie name="Party-popper" :loop="false"/>
          <n-h2>你的红包已准备好～</n-h2>
          <n-p>将此页面的 URL 告诉他们，让他们输入 {{ packet['password'] }} 来领取。</n-p>

          <n-button @click="refund">
            退还 {{ packet['remaining_amount'] ?? 0 }} 元
          </n-button>
        </div>

        <div v-if="packet.user_id && packet.user_id !== user.state.user.id">

          <div v-if="step === 0">
            <Lottie name="Partying-face" :loop="false"/>
            <n-h2>{{ packet.greeting ?? '你发现了一个红包！' }}</n-h2>

            <div class="mt-3 text-center">
              <n-input class="w-fit" v-model:value="password" placeholder="输入红包密码。"/>
            </div>

            <div class="mt-2">
              <n-button @click="open">
                打开红包
              </n-button>
            </div>
          </div>
          <div v-else-if="step === 1">
            <Lottie name="Glowing-star" />

            <n-h1>恭喜你获得了 {{ amount }} 元！</n-h1>

          </div>

        </div>
      </div>

      <div v-else-if="packet['remain'] === 0">
        <Lottie name="Balloon"/>
        <n-h2>红包已经被领完了。</n-h2>

        <n-button @click="refund" v-if="packet.user_id === user.state.user.id">
          删除记录
        </n-button>
      </div>
    </div>
  </n-spin>


</template>

<script setup>

import {NButton, NH1, NH2, NInput, NP, NSpin} from 'naive-ui'

import gateway from "../../../plugins/gateway.js";
import {useRoute} from "vue-router";
import {ref} from "vue";
import Lottie from "../../../components/Lottie.vue";
import user from "../../../plugins/stores/user"
import router from "../../../plugins/router.js";

const loading = ref(false)

const route = useRoute()

const packet = ref({})

const password = ref('')
const amount = ref('')

const step = ref(0)

gateway.get('red-packets', route.params.id).then((response) => {
  packet.value = response.data
})


function refund() {
  loading.value = true
  gateway.delete('red-packets', route.params.id).then((response) => {
    packet.value = response.data
  }).finally(() => {
    loading.value = false
    router.push({name: 'modules.red-packets.index'})
  })
}

function open() {
  loading.value = true
  gateway.post('red-packets', route.params.id + '/grab', {
    password: password.value
  }).then((response) => {
    amount.value = response.data.amount
    step.value = 1
    //
    // setTimeout(() => {
    //   step.value = 2
    // }, 1800)

  }).finally(() => {
    loading.value = false
  })
}


</script>

<style scoped>

</style>