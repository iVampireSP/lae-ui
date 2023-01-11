<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        游戏容器
      </n-text>
    </n-h1>

    <n-alert class="mb-3" closable title="注意" type="warning">
      此页面我们还在制作 <br/>
      如果您想使用游戏容器，工单等服务，请
      <n-a href="https://web.laecloud.com">点击这里回到旧版仪表盘</n-a>
      。
    </n-alert>
  </div>
</template>

<script setup>
import {NA, NAlert, NH1, NText} from 'naive-ui'</script>

<style scoped>

</style>