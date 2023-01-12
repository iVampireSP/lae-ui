<template>
  <div class="menu-item cursor-pointer" @click="show = true">
    <n-avatar :src="avatar" round size="large"/>
  </div>

  <!--    <router-link :to="{name:'user'}" >-->
  <!--    </router-link>-->


  <n-drawer v-model:show="show" :width="width" placement="right">
    <n-drawer-content :native-scrollbar="false" :title="user.name + ' # ' + user.id" closable @click="show = false">

      <div class="text-center">
        <n-avatar :size="128" :src="avatar" round/>
        <br/>
        <n-h1 class="all-zero">{{ user.name }} # {{ user.id }}</n-h1>
      </div>

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

    </n-drawer-content>
  </n-drawer>

</template>

<script setup>
import {NA, NAvatar, NDrawer, NDrawerContent, NH1, NH2, NH4} from "naive-ui";
import {computed, ref} from "vue";

import api from "../../config/api.js";
import userStore from "../../plugins/stores/user.js";

const user = computed(() => {
  return userStore.state.user
})

const width = computed(() => {
  // return document.body.clientWidth > 768 ? 400 : '90%'
  return 360
})

const avatar = computed(() => {
  return api.avatar + user.value.email_md5 + '?s=128';
})

const show = ref(false)

</script>


<style scoped>
.all-zero {
  margin: 0 !important;
  padding: 0 !important;
}
</style>