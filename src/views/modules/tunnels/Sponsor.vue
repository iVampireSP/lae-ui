<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">赞助者列表</n-text>
    </n-h1>
    <n-card class="mt-3" title="镜缘映射">
      <n-data-table
          :columns="headers"
          :data="sponsors.MirrorEdge"
      />
    </n-card>
  </div>
</template>

<script setup>
import {NCard, NDataTable, NH1, NText} from 'naive-ui';

const sponsors = {
  MirrorEdge: [
    {
      "name": "LL Town Server",
      "items": "200 RMB"
    },
    {
      "name": "麒明星",
      "items": "140 RMB"
    },
    {
      "name": "木韩",
      "items": "广东联通/辽宁电信节点"
    },
    {
      "name": "akchiji888",
      "comment": "祝 ME Frp 越来越好，越来越长久地运营下去",
      "items": "10 RMB"
    },
    {
      "name": "Ashrend",
      "items": "10 RMB"
    },
    {
      "name": "该死的注册",
      "items": "5 RMB"
    },
    {
      "name": "爱发电用户_9xMF",
      "comment": "希望把免费 Frp 做的长远",
      "items": "5 RMB"
    },
    {
      "name": "爱发电用户_dWqy",
      "comment": "emmm ,加油",
      "items": "5 RMB"
    },
    {
      "name": "Daiyangcheng",
      "comment": "我是 shabi",
      "items": "1 RMB"
    },
  ],

}

const headers = [
  {
    "title": "名称",
    "key": "name",
  },
  {
    "title": "项目",
    "key": "items",
  },
  {
    "title": "留言",
    "key": "comment",
  },
]
</script>

<style scoped>
</style>
