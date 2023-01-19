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
  NP,
  NDataTable,
  NButton
} from 'naive-ui'
import userStore from '../plugins/stores/user.js'
import {computed} from "vue";

const user = computed(() => {
  return userStore.state.user
})

const columns = [{
    title: '服务',
    key: 'service'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '元 / 月(大约)',
    key: 'one_month_cost'
  },
  {
    title: '本月消耗',
    key: 'current_month_cost'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '几分扣费',
    key: 'time'
  },
  {
    title: '创建时间',
    key: 'create_time'
  },
  {
    title: '释放',
    key: 'delete_host',
    render (row) {
      return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: 'small',
            onClick: () => delete_host()
          },
      )
    }
  }
]
const data = []

</script>

<style scoped></style>
