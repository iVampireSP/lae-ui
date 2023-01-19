<template>
  <IndexLayout>
    <n-alert class="mb-3" closable title="注意" type="warning">
      非常感谢您体验 莱云 新的仪表盘，我们并没有做完但是我们迫不及待想让您体验。
      <br/>
      如果在体验中有任何问题，是正常的。请到我们的社区反馈。
      <br/>
      如果您想使用游戏容器，工单等服务，请
      <n-a href="https://web.laecloud.com">点击这里回到旧版仪表盘</n-a>
      。
    </n-alert>

    <n-card size="small" title="用户信息">
      <n-list>
        <n-list-item>
          <n-avatar :src="avatar"/>

          <br/>

          <n-h3 prefix="bar">{{ user.name }} # {{ user.id }}</n-h3>
        </n-list-item>
      </n-list>

      <n-tag v-if="user.user_group" type="info">
        <span>
          {{ user.user_group.name }}
        </span>

        <!-- <span v-else>
          普通用户
        </span> -->
      </n-tag>
    </n-card>

    <n-card class="mt-3" size="small" title="财务">
      <n-h4 prefix="bar">余额: {{ user.balance }} 元</n-h4>
    </n-card>

    <n-card class="mt-3" size="small" title="用户">
      <n-button-group>
        <n-button ghost type="info" @click="go('auth.login')">
          更换账号
        </n-button>

        <n-button ghost type="info" @click="go('user')">用户中心</n-button>
      </n-button-group>
    </n-card>

    <n-card class="mt-3" size="small" title="测试" v-if="process.env.NODE_ENV !== 'production'">
      <n-button-group>
        <n-button ghost type="info" @click="test">测试新模块</n-button>

      </n-button-group>
    </n-card>


  </IndexLayout>
</template>

<script setup>
import {computed} from 'vue'

import {NA, NAlert, NAvatar, NButton, NButtonGroup, NCard, NH3, NH4, NList, NListItem, NTag} from 'naive-ui'

import userStore from '../plugins/stores/user' // 存储用户信息，供任意页面和 JS 调用，在 Vue 文件里，配合 computed 可以实现 ref 的效果
import http from '../plugins/http' // http 客户端
import conf from '../config/api'
import router from '../plugins/router.js'
import IndexLayout from '../components/menus/IndexLayout.vue'

import direct from "../plugins/direct.js";

// 就像下面这样
const user = computed(() => {
  return userStore.state.user
})

// import {message} from "../utils/layout.js";

const avatar = conf.avatar + user.value.email_md5 + '?s=64'

http.get('/users').then((res) => {
  userStore.commit('updateUser', res.data)
})

function test() {
  direct.get('http://remote.test/api/hosts').then((res) => {
    console.log(res.data)
  })
}

const go = (route_name) => {
  router.push({
    name: route_name,
  })
}
</script>
