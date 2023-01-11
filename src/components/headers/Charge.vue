<template>
  <n-popover trigger="hover">
    <template #trigger>
      <n-icon :component="AttachMoneyRound" class="mr-3 cursor-pointer" size="30px" @click="show = true"/>
    </template>
    <span>快速充值</span>
  </n-popover>

  <n-modal v-model:show="show"
           negative-text="等等"
           positive-text="开冲"
           preset="dialog"
           title="快速充值"
           @positive-click="charge"
  >
    <div class="mt-3"></div>
    <n-space vertical>
      <n-input-group>
        <n-radio-group v-model:value="balance.payment" name="payment_radio_group">
          <n-space>
            <n-radio value="wechat">
              <n-icon :component="LogoWechat" class="relative top-0.5"/>
              微信支付
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
        <n-input v-model:value="balance.amount" placeholder="给你随机个～" @keydown.enter.prevent/>
        <n-input-group-label>元</n-input-group-label>
      </n-input-group>
    </n-space>
  </n-modal>

</template>

<script setup>
import {NIcon, NInput, NInputGroup, NInputGroupLabel, NModal, NPopover, NRadio, NRadioGroup, NSpace} from 'naive-ui'

import {LogoAlipay, LogoWechat} from "@vicons/ionicons5"
import {AttachMoneyRound} from "@vicons/material"
import {ref} from "vue";

import http from "../../plugins/http";

const show = ref(false)

const random = () => {
  // 返回 1 到 100 之间的随机整数
  return (Math.floor(Math.random() * 100) + 1).toString()
}

const balance = ref({
  payment: 'wechat',
  amount: '10',
})
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
