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
    <n-card class="mt-3" title="LoCyan Frp">
      <n-data-table
          :columns="headers"
          :data="sponsors.LoCyan"
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
      "name": "PH",
      "items": "哥斯达黎加节点"
    },
    {
      "name": "夏小叶",
      "items": "新加坡节点"
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
  LoCyan: [
    {
      "name": "沫墨",
      "comment": "",
      "items": "100 RMB",
    },
    {
      "name": "你东半球官方指定唯一损友",
      "comment": "",
      "items": "24 RMB",
    },
    {
      "name": "方鸡腿",
      "comment": "",
      "items": "36 RMB, 一台香港CN2映射服务器。",
    },
    {
      "name": "Alpaca233",
      "comment": "",
      "items": "12 RMB",
    },
    {
      "name": "Aidan_EAT",
      "comment": "",
      "items": "30 RMB",
    },
    {
      "name": "-__人間失格__-",
      "comment": "",
      "items": "40 RMB",
    },
    {
      "name": "Star﹏",
      "comment": "",
      "items": "8 RMB",
    }, {
      "name": "我是一只小云缨吖",
      "comment": "",
      "items": "10 RMB",
    }, {
      "name": "灰色头像",
      "comment": "",
      "items": "10 RMB",
    }, {
      "name": "282****061",
      "comment": "",
      "items": "捐赠美国圣何塞二号服务器x1（回程9929+CMI）备注：1号线路为 三网4837，经上海二次中转。",
    }, {
      "name": "YukiJudai",
      "comment": "",
      "items": "30 RMB",
    }, {
      "name": "HK5538",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "爱发电用户_mgqC",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "LiteCat",
      "comment": "",
      "items": "36 RMB",
    }, {
      "name": "ganshity",
      "comment": "",
      "items": "12 RMB",
    }, {
      "name": "爱发电用户_Ekgw",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "承心网络",
      "comment": "",
      "items": "12 RMB",
    }, {
      "name": "爱发电用户_jNHx",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "爱发电用户_adWy",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "咕咕",
      "comment": "",
      "items": "36 RMB",
    }, {
      "name": "the_system",
      "comment": "",
      "items": "45 RMB",
    }, {
      "name": "Potyz0",
      "comment": "",
      "items": "伦敦节点x2，法国节点x1",
    }, {
      "name": "XiaMoHuaHuo-CN",
      "comment": "",
      "items": "5 RMB",
    }, {
      "name": "fyt714",
      "comment": "",
      "items": "5 RMB",
    }
  ]
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