<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        主机列表
      </n-text>
    </n-h1>
    <n-p v-if="user.user_group_id !== null">
      此账号拥有 {{ user.user_group.discount }}% 的折扣。
      <span v-if="user.user_group.exempt"> 并且豁免计费。 </span>
      <n-text type="error">价格均为使用折扣后的价格。</n-text>
    </n-p>
    <div class="overflow-auto">
      <n-table :single-line="false" striped>
        <thead>
        <tr class="text-center">
          <th>服务</th>
          <th>名称</th>
          <th>元 / 月（大约）</th>
          <th>状态</th>
          <th>几分扣费</th>
          <th>创建时间</th>
          <th>释放</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="host in hosts" v-if="hosts.length !== 0" class="text-center">
          <td>
            {{ host.module.name }}
          </td>
          <td>
            {{ host.name }}
          </td>
          <td>
            <n-text
                v-if="(host.price === '0.00' || !host.price) && (host.managed_price === 0 || host.managed_price === null)"
                type="error">
              被接管
            </n-text>
            <n-text v-else type="success">
              {{ host.price }} 元 / 月
            </n-text>
          </td>
          <td>
            <n-text v-if="host.status === 'running'" type="success">
              <n-icon size="20">
                <CheckmarkCircleOutline style="margin-top: 5px"/>
              </n-icon>
              运行中
            </n-text>
            <n-text v-else-if="host.status === 'suspended'" type="warning">
              <n-icon size="20">
                <AlertCircleOutline style="margin-top: 5px"/>
              </n-icon>
              已暂停
            </n-text>
            <n-text v-else-if="host.status === 'error'" type="error">
              <n-icon size="20">
                <CloseCircleOutline style="margin-top: 5px"/>
              </n-icon>
              错误
            </n-text>
            <n-popover v-else-if="host.status === 'unavailable'" trigger="hover">
              <template #trigger>
                <div>
                  <n-icon size="20">
                    <CloseCircleOutline style="margin-top: 5px"/>
                  </n-icon>
                  <n-text depth="3">
                    不可用
                  </n-text>
                </div>
              </template>
              一般是由于模块通信问题导致的，请联系管理员。
            </n-popover>

            <n-text v-else type="error">
              <n-icon size="20">
                <CloseCircleOutline style="margin-top: 5px"/>
              </n-icon>
              已停止
            </n-text>
          </td>
          <td>
            {{ host.minute_at }} 分
          </td>
          <td>
            {{ new Date(host.created_at).toLocaleString() }}
          </td>
          <td>
            <n-button-group v-if="host.status === 'suspended' || host.status === 'stopped'">
              <n-button ghost type="error" @click="delete_host(host.id)">
                释放
              </n-button>
              <n-button ghost type="info" @click="start_host(host.id)">
                启动
              </n-button>
            </n-button-group>
            <n-button v-else-if="host.status === 'stopped' || host.status === 'running'" ghost type="error"
                      @click="delete_host(host.id)">
              释放
            </n-button>
            <div v-else-if="host.status === 'error' || host.status === 'unavailable'">

            </div>
          </td>
        </tr>
        <tr v-else>
          <td colspan="7">
            <n-empty description="您目前还未创建主机"/>
          </td>
        </tr>
        </tbody>
      </n-table>
    </div>
  </IndexLayout>
</template>

<script setup>
import {NButton, NButtonGroup, NEmpty, NH1, NIcon, NP, NPopover, NTable, NText, useDialog, useMessage} from 'naive-ui'
import userStore from '../plugins/stores/user.js'
import {computed, ref} from "vue";
import http from "../plugins/http.js";
import {AlertCircleOutline, CheckmarkCircleOutline, CloseCircleOutline} from "@vicons/ionicons5";
import IndexLayout from '../components/menus/IndexLayout.vue'
import {listen} from "../plugins/echo.js";

const user = computed(() => {
  return userStore.state.user
})

const hosts = ref([])

const message = useMessage()
const dialog = useDialog()

refresh_host()

function processHost(host) {
  host.price = parseFloat(host.managed_price ?? host.price)
  if (host.price !== 0) {
    host.price = host.price * ((1 - user.value.user_group.discount) / 100)
    // 转正数
    host.price = Math.abs(host.price)
    // 保留两位小数
    host.price = host.price.toFixed(2)
  }

  return host
}

function refresh_host() {
  http.get("/hosts").then(res => {
    let temp_hosts = []
    if (user.value.user_group_id !== null) {
      res.data.forEach(host => {
        temp_hosts.push(processHost(host))
      })
    } else {
      temp_hosts = res.data
    }
    hosts.value = temp_hosts
  })
}


// listen hosts.created
listen('hosts.created', (e) => {
  refresh_host()
})

// listen hosts.updated
listen('hosts.updated', (e) => {
  const host = e.data
  const index = hosts.value.findIndex(h => h.id === host.id)
  hosts.value[index] = processHost(host)
})

// listen hosts.deleted
listen('hosts.deleted', (e) => {
  const host = e.data
  const index = hosts.value.findIndex(h => h.id === host.id)
  hosts.value.splice(index, 1)
})

function start_host(host_id) {
  http.patch('/hosts/' + host_id, {status: 'running'}).then((res) => {
    if (res.status === 400) {
      dialog.error({
        title: "400 错误",
        content: res.data.message,
        positiveText: "好",
      });
    } else {
      message.loading("正在解除暂停...")
      refresh_host()
    }
  }).catch((err) => {
    console.error('start_host', err)
    message.error("无法解除暂停，可能是您的余额不足。")
  })
}

function delete_host(host_id) {
  dialog.warning({
    title: "释放",
    content: "释放后，您将无法再次使用此资源，它的数据将会被彻底删除并且无法找回，是否继续？",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      http.delete("/hosts/" + host_id).then(() => {
        message.loading("正在释放此主机...")
        refresh_host()
      }).catch(err => {
        console.error('delete host failed', err)
        message.error("暂时无法释放此主机。")
      })
    }
  })
}
</script>