<template>
  <n-list v-if="tunnels.length > 0" clickable hoverable>
    <template v-for="($tunnel, index) in tunnels" :key="index">
      <n-list-item @click="next($tunnel)">

        <n-thing :title="'#'+ $tunnel.host_id + ' '+$tunnel.name "
                 content-style="margin-top: 10px;"
        >
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" size="small" :type="$tunnel.status==='running'?'success':'error'">
              {{$tunnel.status==='running'?'运行中':'已停止'}}
              </n-tag>
              <n-tag :bordered="false" size="small" type="info">
                {{ $tunnel.protocol.toUpperCase() }}
              </n-tag>
              <n-tag v-if="$tunnel.custom_domain" :bordered="false" size="small" type="info">
                {{ $tunnel.custom_domain }}
              </n-tag>
              <n-tag v-else :bordered="false" size="small" type="info">
                {{ $tunnel.remote_port }}
              </n-tag>
              <n-tag :bordered="false" size="small" type="info">
                {{$tunnel.local_address}}
              </n-tag>
            </n-space>
          </template>
          <template #avatar>
            <n-avatar>
              {{$tunnel.name.toUpperCase().substring(0,1)}}
            </n-avatar>
          </template>
          <template #header-extra>
            <n-button strong secondary round type="info" @click="next($tunnel)">
              {{isMobile ? "信息" : "详细信息" }}
            </n-button>
          </template>
        </n-thing>

      </n-list-item>
    </template>
  </n-list>
  <div v-else>
    <n-empty description="您还没有创建任何隧道。"/>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'
import {useIsMobile} from '../../../../utils/composables.js'

import {NButton, NEmpty, NList,NAvatar, NListItem, NSpace, NTag, NThing} from 'naive-ui'

const isMobile = useIsMobile()

defineProps({
  tunnels: {
    type: Array,
    required: true
  },
  next: {
    type: Function,
    required: false
  }
})

</script>

<style scoped>

</style>