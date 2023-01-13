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
    
    <ContainersList :containers="containers" :next="go" />
  </div>
</template>

<script setup>
import {NA, NAlert, NH1, NText} from 'naive-ui'

import {computed} from 'vue'

import router from '../../../plugins/router'

import containerStore from "../../../plugins/stores/gct";
import ContainersList from "./components/Containers.vue";

// containerStore.dispatch('fetchGct')

const containers = computed(() => {
  return containerStore.state.containers
})

const go = (ct) => {
  router.push({
    name: 'modules.gct.show',
    params: {
      id: ct.host_id
    }
  })
}


</script>

