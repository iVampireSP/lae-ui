<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">赞助我们</n-text>
    </n-h1>
    <n-card>
      <n-p>
        镜缘映射 自创立以来，为用户提供 免费 稳定 高质量 的内网穿透服务。久而久之，运营成本也成为一笔不菲的支出。因此，如果您有能力，可以为我们赞助
        资金 / 服务器节点 来支持我们，我们将不胜感激。
      </n-p>
      <n-button-group>
        <n-popover trigger="hover">
          <template #trigger>
            <n-button
                ghost
                href="https://afdian.net/a/aehxy"
                tag="a"
                target="_blank"
                type="info"
            >
              爱发电
            </n-button>
          </template>
          <span>资金赞助</span>
        </n-popover>
        <n-popover trigger="hover">
          <template #trigger>
            <n-button
                ghost
                href="https://qm.qq.com/cgi-bin/qm/qr?k=fFJ-xsZe-0YWPDJYgMLH-g9uT83rigkb&noverify=0&personal_qrcode_source=4"
                tag="a"
                target="_blank"
                type="info"
            >
              联系我们
            </n-button>
          </template>
          <span>服务器赞助</span>
        </n-popover>
      </n-button-group>
    </n-card>
    <n-card class="mt-3" title="赞助者列表">
      <n-p>赞助列表 可能存在缺失，请点击上方联系我们以补录。</n-p>
      <n-data-table
          :columns="headers"
          :data="items"
      />
    </n-card>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {NButton, NButtonGroup, NCard, NDataTable, NH1, NP, NPopover, NText} from 'naive-ui';

const sponsors = [
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
]
const items = ref(sponsors)
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