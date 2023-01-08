<template>
  <div>
    <n-card size="small" title="用户信息">
      <n-list>
        <n-list-item>
          <n-avatar :src="avatar"/>
          <NH3>{{ user.name }} # {{ user.id }}</NH3>
        </n-list-item>
      </n-list>
      <n-tag>
        <span v-if="user.user_group">
          {{ user.user_group.name }}
        </span>

        <span v-else>
          普通用户
        </span>
      </n-tag>
    </n-card>
    <n-card size="small" title="财务">
      <NH3>余额: {{ user.balance }}</NH3>
    </n-card>

    <router-link :to="{name: 'auth.login'}">更换账号</router-link>
    <br/>
    <router-link :to="{name: 'user'}">user</router-link>

  </div>
</template>

<script setup>

import {computed} from "vue";

import {NAvatar, NButton, NButtonGroup, NCard, NH3, NH4, NList, NListItem, NTag} from 'naive-ui'

import {addMenuOptions, removeAllMenuOptions} from "../config/menuOptions.js";

import userStore from "../plugins/stores/user"; // 存储用户信息，供任意页面和 JS 调用，在 Vue 文件里，配合 computed 可以实现 ref 的效果
import http from "../plugins/http"; // http 客户端
import conf from "../config/api"

// 就像下面这样
const user = computed(() => {
  return userStore.state.user
})

// import {message} from "../utils/layout.js";

const avatar = conf.avatar + user.value.email_md5 + '?s=64'

http.get('/users').then((res) => {
  userStore.commit('updateUser', res.data)
})


// 移除 left 菜单所有项目
removeAllMenuOptions('left')

// 注册菜单
addMenuOptions('left', 'index', 'Index',)
addMenuOptions('left', 'errors.404', '404',)
addMenuOptions('left', 'errors.500', '500',)
</script>