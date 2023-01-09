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
                {{ $tunnel.status === 'running' ? '正常' : '停止' }}
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
                {{ $tunnel.local_address }}
              </n-tag>
            </n-space>
          </template>
          <template #avatar>
            <n-avatar>
              {{ $tunnel.name.toUpperCase().substring(0, 1) }}
            </n-avatar>
          </template>
          <template #header-extra>
            <!--            <n-button strong secondary round type="info" @click="next($tunnel)">-->
            <!--              {{isMobile ? "信息" : "详细信息" }}-->
            <!--            </n-button>-->
            <!--            -->
            <!--            <n-button strong secondary round type="info">-->
            <!--              操作-->
            <!--            </n-button>-->

            <!--    按钮，忽略事件  -->
            <n-button-group @click.stop="() => {}">
              <n-button ghost type="info" @click.stop="showDetail($tunnel.host_id)">
                {{ isMobile ? "信息" : "详细信息" }}
              </n-button>

              <n-popselect v-model:value="$tunnel.status" :options="options" size="large"
                           @update:value="updateStatus($tunnel)">
                <!-- button 显示选中的 options 的 label  -->
                <n-button ghost slot="trigger">
                  <!--                  {{ options.find((option) => option.value === $tunnel.status)?.label || '操作' }}-->
                  操作
                </n-button>

              </n-popselect>
            </n-button-group>

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
import {defineProps, ref} from 'vue'
import {useIsMobile} from '../../../../utils/composables.js'
import router from "../../../../plugins/router.js";

import {NAvatar, NButton, NButtonGroup, NEmpty, NList, NListItem, NPopselect, NSpace, NTag, NThing} from 'naive-ui'
import http from "../../../../plugins/http.js";
import tunnelStore from "../../../../plugins/stores/tunnels.js";

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

function showDetail(host_id) {
  router.push({
    name: 'modules.tunnels.show',
    params: {
      id: host_id
    }
  })
}

function updateStatus($tunnel) {

  if ($tunnel.status === 'delete') {
    http.delete(`/modules/frp/hosts/${$tunnel.host_id}`).finally(() => {
      tunnelStore.dispatch('fetchTunnels')
    })
  } else {
    http.patch(`/modules/frp/hosts/${$tunnel.host_id}`, {
      status: $tunnel.status
    }).finally(() => {
      tunnelStore.dispatch('fetchTunnels')
    })
  }


}

const options = ref([
  {
    label: '停用',
    value: 'stopped'
  },
  {
    label: '启用',
    value: 'running'
  },
  {
    label: '删除',
    value: 'delete'
  }
])

</script>

<style scoped>

</style>