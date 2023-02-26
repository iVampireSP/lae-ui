<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        创建隧道
      </n-text>
    </n-h1>

    <n-card>
      <n-tabs
          v-model:value="tab"
          animated
          class="card-tabs"
          default-value="clone"
          pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
          size="large"
          style="margin: 0 -4px"
      >
        <n-tab-pane name="create" tab="创建">
          <n-spin :show="creating">
            <n-form ref="form" :model="create_tunnel" :rules="rules">
              <n-grid cols="1 s:2" responsive="screen" x-gap="12">


                <n-gi>
                  <n-form-item label="隧道名称" path="name">
                    <n-input v-model:value="create_tunnel.name" @keydown.enter.prevent/>
                  </n-form-item>

                  <n-form-item label="本机地址" path="local_address">
                    <n-input v-model:value="create_tunnel.local_address"/>
                  </n-form-item>

                  <n-form-item v-if="create_tunnel.protocol === 'http' || create_tunnel.protocol === 'https'"
                               label="绑定域名"
                               path="custom_domain">
                    <n-input v-model:value="create_tunnel.custom_domain" placeholder="输入一个存在的域名"/>
                  </n-form-item>

                  <n-form-item v-if="create_tunnel.protocol === 'tcp' || create_tunnel.protocol === 'udp'"
                               label="远程端口"
                               path="remote_port">
                    <n-input-group>
                      <n-input v-model:value="create_tunnel.remote_port"
                               :placeholder="'需要输入一个在 ' + port_range.min_port + ' 和 ' + port_range.max_port + ' 之间的端口'"/>
                      <n-button ghost type="primary" @click="randomPort">
                        {{ isMobile ? '随机' : '随机生成' }}
                      </n-button>
                    </n-input-group>
                  </n-form-item>

                  <n-form-item v-if="create_tunnel.protocol === 'xtcp' || create_tunnel.protocol === 'stcp'"
                               label="密钥"
                               path="sk">
                    <n-input v-model:value="create_tunnel.sk" placeholder="输入一个自定义的密钥"/>
                  </n-form-item>

                </n-gi>


                <n-gi>
                  <n-form-item :label="'传输协议' + (isMobile ? '(可滑动)' : '')" class="overflow-x-auto"
                               path="protocol">
                    <n-radio-group v-model:value="create_tunnel.protocol" name="protocol">
                      <n-radio-button
                          label="TCP"
                          value="tcp"
                      />
                      <n-radio-button
                          label="UDP"
                          value="udp"
                      />
                      <n-radio-button
                          label="HTTP"
                          value="http"
                      />
                      <n-radio-button
                          label="HTTPS"
                          value="https"
                      />
                      <n-radio-button
                          label="XTCP"
                          value="xtcp"
                      />
                      <n-radio-button
                          label="STCP"
                          value="stcp"
                      />
                    </n-radio-group>
                  </n-form-item>

                  <n-form-item label="选择服务器" path="server_id">
                    <n-select
                        v-if="filterServer().length > 0"
                        v-model:value="create_tunnel.server_id"
                        :options="filterServer()"
                        placeholder="Select"
                    />
                    <n-text v-else>没有可用的服务器</n-text>
                  </n-form-item>

                  <n-form-item v-if="selectedServer" label="流量计费">
                    <n-text v-if="selectedServer.price_per_gb" type="secondary">
                      价格: {{ selectedServer.price_per_gb }} / GB
                    </n-text>
                    <n-text v-else>
                      此节点免费。
                    </n-text>
                  </n-form-item>

                </n-gi>

              </n-grid>

              <n-button block secondary strong type="primary" @click="handleCreate">
                新建
              </n-button>
            </n-form>

            <template #description>
              <n-p v-text="lyric()">
              </n-p>
            </template>
          </n-spin>

        </n-tab-pane>
        <n-tab-pane name="clone" tab="克隆">

          <n-spin :show="creating">
            <Tunnels :next="clone" :tunnels="tunnels"/>
            <template #description>
              <n-p v-text="lyric()">
              </n-p>
            </template>
          </n-spin>


        </n-tab-pane>

      </n-tabs>
    </n-card>


    <div class="mt-5">
      <n-h1 prefix="bar">
        <n-text type="primary">
          常见问题
        </n-text>
      </n-h1>

      <n-collapse>
        <n-collapse-item title="计费方式是什么？">
          <div>
            流量计费。每隔一段时间会统计一次流量，然后根据流量计算价格。
          </div>
        </n-collapse-item>
        <n-collapse-item title="是否拥有免费流量？">
          <div>
            是，并且签到获取。
            <br/>
            并且可能还会进行一些活动，获取更多的免费流量。
            <br/>
            公益项目也可以申请免费流量 <a
              href="https://forum.laecloud.com/d/15-gong-yi-ge-ren-xiang-mu-mian-fei-liu-liang-shen-qing"
              target="_blank">点击申请</a>。
          </div>
        </n-collapse-item>
        <n-collapse-item title="免费流量用完后会停止隧道吗？">
          <div>
            不会，超出的流量将会从余额中扣除，可能会造成欠费情况。
          </div>
        </n-collapse-item>
        <n-collapse-item title="限速吗？">
          <div>
            不限速。
          </div>
        </n-collapse-item>
        <n-collapse-item title="限制隧道数量吗？">
          <div>
            不限制。
          </div>
        </n-collapse-item>
        <n-collapse-item title="有 VIP 吗？">
          <div>
            没有。
          </div>
        </n-collapse-item>
        <n-collapse-item title="打算推出流量包吗？">
          <div>
            不打算，因为我们目前的方式不会造成流量浪费的情况。
          </div>
        </n-collapse-item>
        <n-collapse-item title="节点会稳定吗？">
          <div>
            收费后我们会有资金来维护节点。
          </div>
        </n-collapse-item>
        <n-collapse-item title="价格如何？">
          <div>
            每个节点都会说明流量费用。
            <br/>
            后期可能会调整价格。
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>

  </div>

</template>

<script setup>
import {computed, ref, watch} from 'vue'
import {
  NButton,
  NCard,
  NCollapse,
  NCollapseItem,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NH1,
  NInput,
  NInputGroup,
  NP,
  NRadioButton,
  NRadioGroup,
  NSelect,
  NSpin,
  NTabPane,
  NTabs,
  NText,
  useMessage
} from 'naive-ui'

import http from "../../../plugins/http";

import {useIsMobile} from "../../../utils/composables.js";
import tunnelsStore from "../../../plugins/stores/tunnels";
import Tunnels from "./components/Tunnels.vue";
import lyric from "../../../plugins/lyric.js";
import gateway from "../../../plugins/gateway.js";

const tab = ref('create')

const tunnels = computed(() => {
  return tunnelsStore.state.tunnels
})

const isMobile = useIsMobile()

const create_tunnel = ref({
  name: '',
  protocol: 'tcp',
  local_address: '',
  remote_port: '',
  host_id: '',
  id: '',
  server_id: '',
  status: '',
  custom_domain: '',
  sk: '',
})

const form = ref(null)

const selectedServer = ref({
  price_per_gb: 0
})

const servers = ref([
  {
    id: 1,
    name: 'test',
    tunnels: 0,
    max_tunnels: 0,
  }
])


const port_range = ref({
  min_port: 0,
  max_port: 0
})

const creating = ref(false)


watch(create_tunnel.value, () => {
  if (create_tunnel.value.server_id) {
    const server = servers.value.find(server => server.id === create_tunnel.value.server_id)
    port_range.value.min_port = server.min_port
    port_range.value.max_port = server.max_port
    selectedServer.value = servers.value.filter(server => server.id === create_tunnel.value.server_id)[0]

    console.log(selectedServer.value)
  }
})

const filterServer = () => {
  const allow_protocol = 'allow_' + create_tunnel.value.protocol

  // 过滤后的服务器
  let filter_servers = servers.value.filter((server) => {
    return server[allow_protocol]
  })

  // 再根据隧道数量过滤
  filter_servers = filter_servers.filter(server => server.tunnels < server.max_tunnels)

  // 返回过滤后的服务器
  return filter_servers.map(server => {
    return {
      label: server.name,
      value: server.id
    }
  })
}

// "
// http.get('/modules/frp/servers').then((res) => {
//
// })"

gateway.get('frp/servers',).then(res => {
  servers.value = res.data
  // 先预先选择
  create_tunnel.value.server_id = filterServer()[0].value
})

//
const rules = {
  name: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('隧道名称是必填的')
        }
        if (value.length > 20) {
          return new Error('隧道名称不能超过 20 个字符')
        }
        return true;
      },
      trigger: ["input", "blur"]
    }
  ],
  local_address: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要定义本地地址')
        }

        const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\:([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/
        if (!reg.test(value)) {
          return new Error('本地地址只能是 IPv4:Port 格式')
        }

        // 需要定义端口
        const port = value.split(':')[1]
        if (!port) {
          return new Error('需要指定端口')
        }

        return true;
      },
      trigger: ["input", "blur"]
    }
  ],
  custom_domain: {
    validator(rule, value) {
      if (create_tunnel.value.protocol === 'http' || create_tunnel.value.protocol === 'https') {
        if (!value) {
          return new Error('需要定义自定义域名')
        }
      }

      // 检测域名是否合法
      const reg = /^[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(?:\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
      if (!reg.test(value)) {
        return new Error('自定义域名必须是合法的域名格式')
      }
    },
    trigger: ["input", "blur"]
  },
  server_id: {
    required: true,
    message: '请选择服务器',
  },
  sk: {
    required: true,
    message: '需要输入密钥',
  },
  remote_port: {
    validator(rule, value) {
      // 检测是否是 TCP / UDP 协议
      if (create_tunnel.value.protocol === 'tcp' || create_tunnel.value.protocol === 'udp') {
        if (!value) {
          return new Error('需要定义远程端口')
        }

        // 检测端口是否合法
        const reg = /^\d+$/
        if (!reg.test(value)) {
          return new Error('远程端口必须是合法的端口格式')
        }

        // 检测端口是否在范围内
        if (value < port_range.value.min_port || value > port_range.value.max_port) {
          return new Error('远程端口必须在 ' + port_range.value.min_port + ' - ' + port_range.value.max_port + ' 范围内')
        }
      }

      return true;
    },
    trigger: ["input", "blur"]
  }
};

const message = useMessage()

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function randomPort() {
  // 随机生成一个端口，在 min_port - max_port 范围内
  create_tunnel.value.remote_port = random(port_range.value.min_port, port_range.value.max_port).toString()
}

function handleCreate() {
  form.value?.validate().then((errors) => {
    if (!errors) {

      creating.value = true

      // http.post('/modules/frp/hosts', create_tunnel.value).then((res) => {
      //
      //   tunnelsStore.commit('addTunnel', res.data)
      //
      //   message.success('隧道已创建，欢迎使用 ME Frp。')
      // }).finally(() => {
      //   creating.value = false
      // })

      gateway.post('frp/hosts', create_tunnel.value).then(res => {

        tunnelsStore.commit('addTunnel', res.data)
        message.success('隧道成功创建。')
      }).finally(() => {
        creating.value = false
      })


    }
  })
}


const clone = ($tunnel) => {
  tab.value = 'create'
  create_tunnel.value.name = $tunnel.name?.toString() + ' 副本'
  create_tunnel.value.protocol = $tunnel.protocol?.toString()
  create_tunnel.value.local_address = $tunnel.local_address?.toString()

  if ($tunnel.remote_port) {
    create_tunnel.value.remote_port = $tunnel.remote_port?.toString()
  }

  create_tunnel.value.server_id = $tunnel.server_id
  create_tunnel.value.custom_domain = $tunnel.custom_domain?.toString()

}

</script>
