<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      发红包
    </n-text>
  </n-h1>

  <n-spin :show="creating">

    <n-form
        ref="formRef"
        :model="packet"
        :style="{
      maxWidth: '640px'
    }"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
    >
      <n-form-item label="你要发多少元的红包？">
        <n-input v-model:value="packet.total_amount" placeholder="输入金额"/>
      </n-form-item>
      <br/>
      <n-form-item label="你要发多少个红包">
        <n-input v-model:value="packet.total" placeholder="输入数量"/>
      </n-form-item>
      <n-form-item label="输入一个打开红包的密码">
        <n-input v-model:value="packet.password" placeholder="没有必要太复杂。"/>
      </n-form-item>
      <n-form-item label="祝福语">
        <n-input v-model:value="packet.greeting" placeholder="你想对看到红包的人说什么？"/>
      </n-form-item>
      <n-form-item label="确认一下">
        <n-button @click="pack()">
          包红包
        </n-button>
      </n-form-item>
    </n-form>

    <template #description>
      <n-p>
        <span v-if="packet.greeting">
          正在红包上写上 <span v-text="packet.greeting"></span> ...
        </span>
        <span v-else>
          正在将钱装进红包...
        </span>
      </n-p>
    </template>
  </n-spin>

</template>

<script setup>
import {ref} from 'vue'
import {NButton, NForm, NFormItem, NH1, NInput, NP, NSpin, NText} from 'naive-ui'
import gateway from "../../../plugins/gateway.js";
import router from "../../../plugins/router.js";

const packet = ref({
  total_amount: "50",
  total: "5",
  greeting: "",
  password: "",
})

const creating = ref(false)

function pack() {
  creating.value = true
  gateway.post('red-packets', packet.value).then((response) => {

    router.push({
      name: 'modules.red-packets.show',
      params: {
        id: response.data.uuid
      }
    })

  }).finally(() => {
    creating.value = false
  })
}

//
</script>

<style scoped>

</style>