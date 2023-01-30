<template>
  <div class="menu-item">
    <n-popover trigger="hover">
      <template #trigger>
        <n-icon :component="todayIsThursday ? FastFoodOutline : AttachMoneyRound" class="mr-3 cursor-pointer"
                size="30px"
                @click="show = true"/>
      </template>
      <span v-text="todayIsThursday ? '请我吃疯狂星期四' : '快速充值'"></span>
    </n-popover>
  </div>

  <n-modal v-model:show="show"
           :positive-text="todayIsThursday ? ' V 给你' : '开冲'"
           :title="todayIsThursday ? '请我吃疯狂星期四' : '快速充值'"
           negative-text="等等"
           preset="dialog"
           @positive-click="charge"
  >
    <div class="mt-3"></div>
    <n-space vertical>
      <n-input-group>
        <n-radio-group v-model:value="balance.payment" name="payment_radio_group">
          <n-space>
            <n-radio value="wechat">
              <n-icon :component="LogoWechat" class="relative top-0.5"/>
              <span v-text="' ' + (todayIsThursday ? 'V 信支付' : '微信支付')"></span>
            </n-radio>
            <n-radio value="alipay">
              <n-icon :component="LogoAlipay" class="relative top-0.5"/>
              支付宝
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-input-group>
      <n-input-group>
        <n-input-group-label>金额</n-input-group-label>
        <n-input v-model:value="balance.amount" :placeholder="placeholder" @keydown.enter.prevent/>
        <n-input-group-label>元</n-input-group-label>
      </n-input-group>
      <n-input-group v-if="todayIsThursday">
        <span v-if="parseInt(balance.amount) >= 1000">
          撑了撑了～
        </span>
        <span v-else-if="parseInt(balance.amount) >= 50">
          能吃 <span v-text="(parseInt(balance.amount) / 50).toFixed(0)"></span> 份疯狂星期四
        </span>
        <span v-else>
          吃不起疯狂星期四
        </span>

      </n-input-group>
    </n-space>
  </n-modal>

</template>

<script setup>
import {NIcon, NInput, NInputGroup, NInputGroupLabel, NModal, NPopover, NRadio, NRadioGroup, NSpace} from 'naive-ui'

import {FastFoodOutline, LogoAlipay, LogoWechat} from "@vicons/ionicons5"
import {AttachMoneyRound} from "@vicons/material"
import {computed, ref} from "vue";

import http from "../../plugins/http";

const show = ref(false)

const placeholder = ref('给你随机个～')

const todayIsThursday = computed(() => new Date().getDay() === 4)

const random = () => {
  if (todayIsThursday.value) {
    return "50"
  } else {
    // 返回 1 到 100 之间的随机整数
    return (Math.floor(Math.random() * 100) + 1).toString()
  }

}

const balance = ref({
  payment: 'wechat',
  amount: '10',
})

if (todayIsThursday.value) {
  balance.value.amount = ""
  placeholder.value = 'V 我 50'
}

const link = ref('')


function charge() {

  if (balance.value.amount === '') {
    balance.value.amount = random()
  }

  http.post('/balances', balance.value).then((res) => {
    link.value = res.data.url

    //   新标签打开，针对解决 Safari 问题
    setTimeout(() => window.open(link.value, '_blank'))
  }).finally(() => {
    balance.value.amount = ''
  })
}

</script>
