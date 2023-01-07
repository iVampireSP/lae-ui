<template>
  <div>
    <n-card title="用户信息" size="small">
      <n-list>
      <n-list-item>
      <n-avatar :src="avatar" />
      <NH3>{{ user.state.user.name }} # {{ id }}</NH3></n-list-item>
      </n-list>
      <n-tag>{{ user_group }}</n-tag>
    </n-card>
    <n-card title="财务" size="small">
      <NH3>余额: {{ data.balance }}</NH3>
    </n-card>

    <router-link :to="{name: 'auth.login'}">更换账号</router-link>
    <br />

    {{ data }}
  </div>
</template>

<script setup>
import {NList , NListItem, NAvatar, NH3 , NCard , NTag} from 'naive-ui'

import {addMenuOptions, removeAllMenuOptions} from "../config/menuOptions.js";

import user from "../plugins/stores/user";

import http from "../plugins/http";

import conf from "../config/api"

// import {message} from "../utils/layout.js";
import {ref} from "vue";
const data = ref({})
const id = ref()
const balance = ref()
const user_group_name = ref()
const avatar = conf.avatar + user.state.user.email_md5 + '?s=64'

http.get('/users').then((res) => {
  // message.create('success',)
  id.value = res.data["id"]
  balance.value = res.data["balances"]
  data.value = res.data
  user_group_name.value = res.data.user_group["name"]
})
// 用户组别判断
let user_group
console.log(user_group_name)
if (user_group_name == null) {
  user_group = '普通用户'
} else {
  user_group = user_group_name
}

removeAllMenuOptions('left')

addMenuOptions('left', 'index', 'Index',)
addMenuOptions('left', 'errors.404', '404',)
</script>

<style scoped>

</style>