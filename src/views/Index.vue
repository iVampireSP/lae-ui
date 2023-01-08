<template>
  <div>
    <n-card size="small" title="用户信息">
      <n-list>
        <n-list-item>
          <n-avatar :src="avatar"/>

          <br/>

          <n-h3 prefix="bar">{{ user.name }} # {{ user.id }}</n-h3>
        </n-list-item>
      </n-list>

      <n-tag type="info">
        <span v-if="user.user_group">
          {{ user.user_group.name }}
        </span>

        <span v-else>
          普通用户
        </span>
      </n-tag>
    </n-card>

    <n-card size="small" title="财务" class="mt-3">
      <n-h4 prefix="bar">余额: {{ user.balance }} 元</n-h4>
    </n-card>

    <n-card size="small" title="用户" class="mt-3">
      <n-button-group>
        <n-button ghost type="info">
          <router-link :to="{name: 'auth.login'}">更换账号</router-link>
        </n-button>

        <n-button ghost type="info">
          <router-link :to="{name: 'user'}">用户中心</router-link>
        </n-button>

      </n-button-group>
    </n-card>
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