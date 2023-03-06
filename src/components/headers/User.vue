<template>
  <div>
    <!--    <n-popover display-directive="show"-->
    <!--               placement="bottom-end"-->
    <!--               style="width: 288px"-->
    <!--               trigger="manual" :show="showPopover">-->
    <!--      <template #trigger>-->
    <n-badge :processing="taskProcessing" :type="taskStatus" :value="tasks.length"
             @click="showPopover = !showPopover">
      <n-avatar :src="avatar" class="cursor-pointer" round size="large" @click.stop="showDrawer"/>
    </n-badge>
    <!--      </template>-->
    <!--      <div>-->
    <!--        <Tasks />-->
    <!--      </div>-->
    <!--    </n-popover>-->
  </div>

  <!--    <router-link :to="{name:'user'}" >-->
  <!--    </router-link>-->


  <n-drawer v-model:show="show" :width="width" placement="right">
    <n-drawer-content :native-scrollbar="false" :title="user.name + ' # ' + user.id" closable>

      <Username/>

      <div>
        <n-h2 class="all-zero">财务</n-h2>
        <n-h4 class="all-zero">余额: {{ user.balance }}</n-h4>

        <div>
          交易记录:
          <n-a :href="api.auth + '/transactions'" target="_blank">查看</n-a>
        </div>
        <div>
          充值余额:
          <n-a :href="api.auth + '/balances'" target="_blank">充值</n-a>
        </div>
      </div>

      <div v-if="user.user_group_id" class="mt-5">
        <n-h2 class="all-zero">{{ user.user_group.name }}</n-h2>
        <p>
          享受 {{ user.user_group.discount }}% 的折扣
          <br/>
          <span v-if="user.user_group.exempt"> 并且豁免计费 </span>
        </p>
      </div>

      <div class="mt-5">
        <n-h2 class="all-zero">计费项目列表</n-h2>
        <n-a>
          <router-link :to="{ name: 'hosts' }" class="link">主机</router-link>
        </n-a>
      </div>

      <div class="mt-5">
        <n-h2 class="all-zero">服务与支持</n-h2>
        <n-a>
          <router-link :to="{ name: 'work-orders' }" class="link">
            工单列表
          </router-link>
        </n-a>
      </div>

      <div class="mt-5">
        <n-h2 class="all-zero">用户中心</n-h2>
        <n-a v-show="!loading" @click="goToUserCenter">
          用户中心
        </n-a>
        <span v-show="loading">
          正在载入...
        </span>
      </div>

      <div class="mt-5">
        <n-h2 class="all-zero">退出登录</n-h2>
        <n-a>
          <router-link :to="{ name: 'auth.login' }" class="link">
            退出登录
          </router-link>
        </n-a>
      </div>

    </n-drawer-content>
  </n-drawer>

</template>

<script setup>
import {NA, NAvatar, NBadge, NDrawer, NDrawerContent, NH2, NH4} from "naive-ui";
import {computed, ref} from "vue";
import Username from "./Username.vue";
import http from '../../plugins/http'

import api from "../../config/api.js";
import userStore from "../../plugins/stores/user.js";
import taskStore from '../../plugins/stores/tasks'

const loading = ref(false)

const user = computed(() => {
  return userStore.state.user
})

const width = computed(() => {
  // return document.body.clientWidth > 768 ? 400 : '90%'
  return 360
})

const avatar = computed(() => {
  return api.avatar + user.value.email_md5 + '?s=256?cache=0';
})

const show = ref(false)

let showPopover = ref(false)


const tasks = computed(() => taskStore.state.tasks)
const taskStatus = computed(() => taskStore.state.last_status)
const taskProcessing = computed(() => taskStore.state.processing)

taskStore.dispatch('fetch')

function showDrawer() {
  show.value = true

  userStore.dispatch('fetch')

}

function goToUserCenter() {
  loading.value = true
  http.post('sessions').then(res => {
    setTimeout(() => {
      window.open(res.data.url, '_blank')
    })
  }).finally(() => {
    loading.value = false
  })
}

</script>


<style scoped>
.all-zero {
  margin: 0 !important;
  padding: 0 !important;
}
</style>