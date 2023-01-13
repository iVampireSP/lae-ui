<template>
  <n-list v-if="containers.length > 0" clickable hoverable>
    <template v-for="(container, index) in containers" :key="index">
      <n-list-item @click="next(container)">
        <n-thing
            :title="'#' + container.host_id + ' ' + container.name"
            content-style="margin-top: 10px;"
        >
          <!--          <template #description>-->
          <!--            <n-space size="small" style="margin-top: 4px">-->

          <!--            </n-space>-->
          <!--          </template>-->
          <template #avatar>
            <n-avatar>
              {{ container.name.toUpperCase().substring(0, 1) }}
            </n-avatar>
          </template>
          <template #header-extra>
            <n-button-group @click.stop="() => { }">
              <n-button
                  ghost
                  type="info"
                  @click.stop="showDetail(container.host_id)"
              >
                {{ isMobile ? '信息' : '详细信息' }}
              </n-button>
              <n-button
                  ghost
                  type="info"
                  @click.stop="showTerminal(container.host_id)"
              >
                控制台
              </n-button>
            </n-button-group>
          </template>
        </n-thing>
      </n-list-item>
    </template>
  </n-list>
  <div v-else>
    <n-empty description="您还没有任何 游戏容器。"/>
  </div>

</template>

<script setup>
import {NAvatar, NButton, NButtonGroup, NEmpty, NList, NListItem, NThing,} from 'naive-ui'

import {useIsMobile} from '../../../../utils/composables.js'
import router from '../../../../plugins/router.js'

const isMobile = useIsMobile()

defineProps({
  containers: {
    type: Array,
    required: true,
  },
  next: {
    type: Function,
    required: false,
  },
})

function showDetail(host_id) {
  router.push({
    name: 'modules.gct.show',
    params: {
      id: host_id,
    },
  })
}

function showTerminal(host_id) {
  router.push({
    name: 'modules.gct.terminal',
    params: {
      id: host_id,
    },
  })
}

</script>

<style scoped>

</style>
