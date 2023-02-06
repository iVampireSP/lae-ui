<template>
  <IndexLayout>

    <div v-if="sending" class="flex justify-center h-screen text-center">
      <div class="flex items-center">
        <span class="loader"></span>
      </div>
    </div>

    <div v-if="!sending">
      <div v-show="!(workOrder.host_id !== null || workOrder.module_id !== null)">
        <n-h2 prefix="bar">
          <n-text type="success">
            有什么我们能帮助您的吗？
          </n-text>
        </n-h2>

        <n-h1 prefix="bar">
          <n-text type="primary">
            主机
          </n-text>
        </n-h1>

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
              <th>选择</th>
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
                <n-button @click="workOrder.host_id = host.id">
                  选择
                </n-button>
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

        <n-h1 prefix="bar">
          <n-text type="primary">
            模块
          </n-text>
        </n-h1>

        <div class="overflow-auto">
          <n-table :single-line="false" striped>
            <thead>
            <tr class="text-center">
              <th>ID</th>
              <th>名称</th>
              <th>状态</th>
              <th>选择</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="module in modules" v-if="modules.length !== 0" class="text-center">
              <td>
                {{ module.id }}
              </td>
              <td>
                {{ module.name }}
              </td>
              <td>
                <n-text v-if="module.status === 'up'" type="success">
                  <n-icon size="20">
                    <CheckmarkCircleOutline style="margin-top: 5px"/>
                  </n-icon>
                  运行中
                </n-text>
                <n-text v-else-if="module.status === 'down'" type="error">
                  <n-icon size="20">
                    <CloseCircleOutline style="margin-top: 5px"/>
                  </n-icon>
                  已停止
                </n-text>
                <n-text v-else-if="module.status === 'maintenance'" type="warning">
                  <n-icon size="20">
                    <AlertCircleOutline style="margin-top: 5px"/>
                  </n-icon>
                  维护中
                </n-text>
              </td>
              <td>
                <n-button @click="workOrder.module_id = module.id">
                  选择
                </n-button>
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
      </div>

      <div v-show="workOrder.host_id !== null || workOrder.module_id !== null">
        <n-h2 prefix="bar">
          <n-text type="success">
            嗯，请简要描述您的问题。
          </n-text>
        </n-h2>

        <n-input v-model:value="workOrder.title" maxlength="30" placeholder="一句话概括一下" size="large" type="text"/>

        <div class="mt-5">
          <v-md-editor
              v-model="workOrder.content"
              height="500px"
              placeholder="请说明您遇到的问题的具体情况，必要时可以告知我们对应服务的密码。"
          ></v-md-editor>
        </div>

        <div class="mt-3 text-right">
          <n-button secondary size="large" strong type="primary" @click="submitWorkOrder">
            投递工单
          </n-button>
        </div>

      </div>
    </div>


  </IndexLayout>
</template>

<script setup>
import {ref} from "vue"
import {NButton, NEmpty, NH1, NH2, NIcon, NInput, NPopover, NTable, NText} from 'naive-ui'
import IndexLayout from '../../components/menus/IndexLayout.vue'
import http from "../../plugins/http.js"
import {AlertCircleOutline, CheckmarkCircleOutline, CloseCircleOutline} from "@vicons/ionicons5";
import hljs from 'highlight.js'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import router from "../../plugins/router.js";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

const hosts = ref([])
const modules = ref([])

const sending = ref(false)

const workOrder = ref({
  title: null,
  content: '',
  host_id: null,
  module_id: null,
})


http.get("/hosts").then(res => {
  hosts.value = res.data
})

http.get("/modules").then(res => {
  modules.value = res.data

  modules.value.unshift({
    id: 'lae',
    name: "莱云",
    status: "up"
  })
})

function submitWorkOrder() {
  sending.value = true

  if (workOrder.value.module_id === 'lae') {
    workOrder.value.module_id = null
  }

  http.post('/work-orders', workOrder.value).then((res) => {
    setTimeout(() => router.push({
      name: 'work-orders.show',
      params: {
        id: res.data.uuid,
      },
    }), 1000)
  }).catch(() => {
    sending.value = false
  })
}

</script>


<style scoped>
.loader {
  position: relative;
  border-style: solid;
  box-sizing: border-box;
  border-width: 40px 60px 30px 60px;
  border-color: #3760C9 #96DDFC #96DDFC #36BBF7;
  animation: envFloating 1s ease-in infinite alternate;
}

.loader:after {
  content: "";
  position: absolute;
  right: 62px;
  top: -40px;
  height: 70px;
  width: 50px;
  background-image: linear-gradient(#dcdcdc 45px, transparent 0),
  linear-gradient(#dcdcdc 45px, transparent 0),
  linear-gradient(#dcdcdc 45px, transparent 0);
  background-repeat: no-repeat;
  background-size: 30px 4px;
  background-position: 0 11px, 8px 35px, 0 60px;
  animation: envDropping 0.75s linear infinite;
}

@keyframes envFloating {
  0% {
    transform: translate(-2px, -5px)
  }
  100% {
    transform: translate(0, 5px)
  }
}

@keyframes envDropping {
  0% {
    background-position: 100px 11px, 115px 35px, 105px 60px;
    opacity: 1;
  }
  50% {
    background-position: 0 11px, 20px 35px, 5px 60px;
  }
  60% {
    background-position: -30px 11px, 0 35px, -10px 60px;
  }
  75%, 100% {
    background-position: -30px 11px, -30px 35px, -30px 60px;
    opacity: 0;
  }
}

</style>