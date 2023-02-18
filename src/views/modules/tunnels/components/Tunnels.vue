<template>
  <n-list v-if="tunnels.length > 0" clickable hoverable>
    <template v-for="($tunnel, index) in tunnels" :key="index">
      <n-list-item @click="next($tunnel)">
        <n-thing
            :title="'#' + $tunnel.host_id + ' ' + $tunnel.name"
            content-style="margin-top: 10px;"
        >
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <!-- running: success, stopped: error, suspended: warning -->
              <n-tag
                  v-if="$tunnel.status === 'running'"
                  :bordered="false"
                  size="small"
                  type="success"
              >
                正常
              </n-tag>
              <n-tag
                  v-else-if="$tunnel.status === 'delete'"
                  :bordered="false"
                  size="small"
                  type="error"
              >
                删除中
              </n-tag>
              <n-tag
                  v-else-if="$tunnel.status === 'stopped'"
                  :bordered="false"
                  size="small"
                  type="error"
              >
                停止
              </n-tag>
              <n-tag
                  v-else-if="$tunnel.status === 'suspended'"
                  :bordered="false"
                  size="small"
                  type="warning"
              >
                暂停
              </n-tag>

              <n-tag :bordered="false" size="small" type="info">
                {{ $tunnel.protocol.toUpperCase() }}
              </n-tag>
              <n-tag
                  v-if="$tunnel.custom_domain"
                  :bordered="false"
                  size="small"
                  type="info"
              >
                {{ $tunnel.custom_domain }}
              </n-tag>
              <n-tag v-else v-if="$tunnel.remote_port" :bordered="false" size="small" type="info">
                {{ $tunnel.remote_port }}
              </n-tag>
              <n-tag v-if="$tunnel.local_address" :bordered="false" size="small" type="info">
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
            <n-button-group @click.stop="() => { }">
              <n-button
                  ghost
                  type="info"
                  @click.stop="showDetail($tunnel.host_id)"
              >
                {{ isMobile ? '信息' : '详细信息' }}
              </n-button>

              <n-popselect
                  v-model:value="$tunnel.status"
                  :options="options"
                  size="large"
                  @update:value="updateStatus($tunnel)"
              >
                <!-- button 显示选中的 options 的 label  -->
                <n-button slot="trigger" ghost type="success">
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

  <n-modal
      v-model:show="showModal"
      negative-text="算了"
      positive-text="确认"
      preset="dialog"
      title="修改名称"
      @positive-click="submitCallback"
  >
    <n-input v-model:value="selectedTunnel.name" @keydown.enter.prevent/>
  </n-modal>
</template>

<script setup>
import {ref} from 'vue'

import {
  NAvatar,
  NButton,
  NButtonGroup,
  NEmpty,
  NInput,
  NList,
  NListItem,
  NModal,
  NPopselect,
  NSpace,
  NTag,
  NThing,
} from 'naive-ui'

import {useIsMobile} from '../../../../utils/composables.js'
import router from '../../../../plugins/router.js'
import gateway from '../../../../plugins/gateway.js'
import tunnelStore from '../../../../plugins/stores/tunnels.js'
import {dialog, message} from '../../../../utils/layout.js'
import user from '../../../../plugins/stores/user.js'

const isMobile = useIsMobile()

defineProps({
  tunnels: {
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
    name: 'modules.tunnels.show',
    params: {
      id: host_id,
    },
  })
}

const selectedTunnel = ref({
  host_id: 0,
  name: '',
})

const showModal = ref(false)

function copy(content) {
  navigator.clipboard.writeText(content);
  message.success("复制成功");
}

function updateStatus($tunnel) {
  selectedTunnel.value = $tunnel
  const copyCommand = "frpc " + "-t " + "\"" + user.state.token + "\" " + "-i " + $tunnel.host_id
  const linuxSystemdCommand = "curl -s https://dash.laecloud.com/scripts/mefrp.sh | bash -s " + "\"" + user.state.token + "\" " + $tunnel.host_id

  if ($tunnel.status === 'delete') {
    dialog.warning({
      title: '注意！',
      content: '你正在删除一个隧道！',
      positiveText: '删除',
      negativeText: '不对',
      onPositiveClick: () => {
        // http.delete('/modules/frp/hosts/' + $tunnel.host_id).then(() => {
        //   tunnelStore.dispatch('fetchTunnels')
        // })
        gateway.delete('frp/hosts/' + $tunnel.host_id).then(() => {
          tunnelStore.dispatch('fetchTunnels')
        })

      },
      onNegativeClick: () => {
        $tunnel.status = 'running'
      },
    })
  } else if ($tunnel.status === 'stopped') {
    dialog.warning({
      title: '你正在断开连接！',
      content: '停止一个隧道，将断开 frpc 客户端连接！',
      positiveText: '关闭',
      negativeText: '不对',
      onPositiveClick: () => {
        patch({
          status: $tunnel.status,
        })
      },
      onNegativeClick: () => {
        $tunnel.status = 'running'
      },
    })
  } else if ($tunnel.status === 'rename') {
    showModal.value = true
    $tunnel.status = 'running'
  } else if ($tunnel.status === 'copy') {
    copy(copyCommand)
  } else if ($tunnel.status === 'copy_startup') {
    copy(linuxSystemdCommand)
  } else {
    patch({
      status: $tunnel.status,
    })
  }
}

const submitCallback = () => {
  showModal.value = false

  patch({
    name: selectedTunnel.value.name,
  })
}

function patch(data = {}) {
  // http
  //     .patch(`/modules/frp/hosts/${selectedTunnel.value.host_id}`, data)
  //     .finally(() => {
  //       tunnelStore.dispatch('fetchTunnels')
  //     })

  gateway.patch(`frp/hosts/${selectedTunnel.value.host_id}`, data).then(() => {
    tunnelStore.dispatch('fetchTunnels')
  })
}

const options = ref([
  {
    label: '停用',
    value: 'stopped',
  },
  {
    label: '启用',
    value: 'running',
  },
  {
    label: '删除',
    value: 'delete',
  },
  {
    label: '改名',
    value: 'rename',
  },
  {
    label: '复制一键配置命令(推荐)',
    value: 'copy_startup',
  },
  {
    label: '复制简单启动命令',
    value: 'copy',
  },
])
</script>