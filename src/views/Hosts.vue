<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        主机列表
      </n-text>
    </n-h1>
    <n-p v-if="user.user_group_id !== null">
      此账号拥有 {{ user.user_group.discount }}% 的折扣。
      <span v-if="user.user_group.exempt"> 并且豁免计费。 </span>
      <span style="color: #d03050;">价格均为使用折扣后的价格。</span>
    </n-p>
  </div>
</template>

<script setup>
import {
  NH1,
  NText,
  NP
} from 'naive-ui'
import userStore from '../plugins/stores/user.js'
import {computed} from "vue";

const user = computed(() => {
  return userStore.state.user
})

const columns = []
const data = []

</script>

<style scoped></style>
