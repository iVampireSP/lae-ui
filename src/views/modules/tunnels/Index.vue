<template>
  <div>
    <h3>镜缘映射</h3>

    <p>镜缘映射可以帮助您映射您的内网服务到公网中。</p>
    <p v-show="traffics.free_traffic">
      您当前的可抵用流量: {{ traffics.free_traffic }} GB
    </p>

    <div class="list-group mt-3" v-for="tunnel in tunnels">
      <router-link
        :to="{ name: 'modules.tunnels.show', params: { id: tunnel.id } }"
        class="list-group-item list-group-item-action shadow-sm rounded"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1 text-success">{{ tunnel.name }}</h5>
          <small>{{ new Date(tunnel.updated_at).toLocaleString() }}</small>
        </div>
        <p class="mb-1">
          <span
            v-if="tunnel.protocol == 'http' || tunnel.protocol == 'https'"
            data-bs-toggle="tooltip"
            data-bs-placement="right"
            title="按住 Shift 或 Ctrl 来打开"
          >
            <a
              rel="noreferrer"
              target="_blank"
              :href="tunnel.protocol + '://' + tunnel.custom_domain"
              class="text-decoration-none"
            >
              {{ tunnel.protocol + '://' + tunnel.custom_domain }}
              <i class="bi bi-box-arrow-up-right text-decoration-none"></i
            ></a>
          </span>

          <span v-else>
            {{
              tunnel.protocol +
              '://' +
              tunnel.server.server_address +
              ':' +
              tunnel.remote_port
            }}
          </span>
        </p>
        <!-- <small class="text-muted">
        
        </small> -->
      </router-link>
    </div>
  </div>

  <div class="mt-3">
    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#createTunnelModel"
      @click="getServers()"
    >
      创建隧道
    </button>
  </div>

  <div
    class="modal fade"
    id="createTunnelModel"
    tabindex="-1"
    aria-labelledby="createTunnelModel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">新建隧道</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="tunnelCreated" class="alert alert-success" role="alert">
            隧道创建成功。
          </div>
          <div
            v-else-if="tunnelCreateError"
            class="alert alert-danger"
            role="alert"
          >
            {{ tunnelCreateError }}
          </div>
          <div v-else class="alert alert-primary" role="alert">
            为了防止隧道被滥用，我们会不定期检查映射内容。
          </div>
          <div class="form-floating mb-3">
            <input
              class="form-control"
              id="floatingName"
              placeholder="xxx"
              v-model="createTunnel.name"
            />
            <label for="floatingName">隧道名称</label>
          </div>

          <div class="form-floating mb-3">
            <input
              class="form-control"
              id="floatingName"
              placeholder="xxx"
              v-model="createTunnel.local_address"
            />
            <label for="floatingName">本地 地址和端口</label>
          </div>

          <!-- 选择协议 -->
          <div class="form-floating mb-3">
            <select
              class="form-control"
              id="floatingProtocol"
              v-model="createTunnel.protocol"
            >
              <option value="http">HTTP</option>
              <option value="https">HTTPS</option>
              <option value="tcp">TCP</option>
              <option value="udp">UDP</option>
            </select>
            <label for="floatingProtocol">协议</label>
          </div>

          <!-- 选择服务器 -->
          <div
            class="form-floating mb-3"
            v-show="createTunnel.protocol == 'http'"
          >
            <select
              class="form-control"
              id="floatingServer"
              v-model="createTunnel.server_id"
            >
              <option v-for="server in servers_http" :value="server.id">
                {{ server.name }}
              </option>
            </select>
            <label for="floatingServer">支持 HTTP 协议的服务器</label>
          </div>

          <div
            class="form-floating mb-3"
            v-show="createTunnel.protocol == 'https'"
          >
            <select
              class="form-control"
              id="floatingServer"
              v-model="createTunnel.server_id"
            >
              <option v-for="server in servers_https" :value="server.id">
                {{ server.name }}
              </option>
            </select>
            <label for="floatingServer">支持 HTTPS 协议的服务器</label>
          </div>

          <div
            class="form-floating mb-3"
            v-show="createTunnel.protocol == 'tcp'"
          >
            <select
              class="form-control"
              id="floatingServer"
              v-model="createTunnel.server_id"
              @change="randomRemotePort"
            >
              <option v-for="server in servers_tcp" :value="server.id">
                {{ server.name }}
              </option>
            </select>
            <label for="floatingServer">支持 TCP 协议的服务器</label>
          </div>

          <div
            class="form-floating mb-3"
            v-show="createTunnel.protocol == 'udp'"
          >
            <select
              class="form-control"
              id="floatingServer"
              v-model="createTunnel.server_id"
              @change="randomRemotePort"
            >
              <option v-for="server in servers_udp" :value="server.id">
                {{ server.name }}
              </option>
            </select>
            <label for="floatingServer">支持 UDP 协议的服务器</label>
          </div>

          <!-- 如果是 http,https 则要求输入域名 -->
          <div
            class="form-floating mb-3"
            v-show="
              createTunnel.protocol == 'http' ||
              createTunnel.protocol == 'https'
            "
          >
            <input
              class="form-control"
              id="floatingDomain"
              placeholder="xxx"
              v-model="createTunnel.custom_domain"
            />
            <label for="floatingDomain">域名</label>
          </div>

          <div
            class="form-floating mb-3"
            v-show="
              createTunnel.protocol == 'tcp' || createTunnel.protocol == 'udp'
            "
          >
            <input
              class="form-control"
              id="floatingPort"
              placeholder="xxx"
              v-model="createTunnel.remote_port"
            />
            <label for="floatingPort">远程端口</label>
            <div v-if="selectedServer">
              <div
                v-if="
                  createTunnel.remote_port < selectedServer.min_port ||
                  createTunnel.remote_port > selectedServer.max_port
                "
                class="text-danger ms-1"
              >
                当前端口范围不正确。
              </div>
            </div>
          </div>

          <span class="d-none">
            <span v-text="getCurrentServer(createTunnel.server_id)"></span>
          </span>

          <div v-if="selectedServer">
            <h3>服务器信息</h3>
            <p>名称: {{ selectedServer.name }}</p>
            <p>
              端口范围: {{ selectedServer.min_port }} -
              {{ selectedServer.max_port }}
            </p>

            <p>
              隧道数量: {{ selectedServer.tunnels }}/{{
                selectedServer.max_tunnels
              }}
            </p>

            <p v-if="selectedServer.price_per_gb !== 0">
              每 GB 流量消耗的 Drops: {{ selectedServer.price_per_gb }}
            </p>
            <p v-else>此节点目前不收取费用</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button type="button" class="btn btn-primary" @click="create">
            创建
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  //   import { useRoute } from 'vue-router'
  import http from '../../../api/http'
  import route from '../../../plugins/router'

  //   const router = useRoute()

  const traffics = ref([])
  const tunnels = ref([])
  const servers = ref([])
  const servers_http = ref([])
  const servers_https = ref([])
  const servers_tcp = ref([])
  const servers_udp = ref([])

  const tunnelCreated = ref(false)
  const tunnelCreateError = ref(false)

  const selectedServer = ref({
    name: null,
  })

  const createTunnel = ref({
    name: null,
    protocol: 'http',
    local_address: '127.0.0.1:80',
    server_id: 1,
    remote_port: null,
    custom_domain: null,
  })

  // 随机生成字符串
  function randomString(len) {
    len = len || 32
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = $chars.length
    var str = ''
    for (var i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }

  createTunnel.value.name = randomString(10)

  function toRoute(id) {
    // key.value = Math.round(Math.random() * 1000)
    route.push({ name: 'modules.tunnels.show', params: { id: id } })
    // key.value = Math.round(Math.random() * 1000)
  }

  http.get('/modules/frp/hosts').then((res) => {
    tunnels.value = res.data
  })

  http.get('/modules/frp/traffics').then((res) => {
    traffics.value = res.data
  })

  function getServers() {
    http.get('/modules/frp/servers').then((res) => {
      tunnelCreated.value = false

      servers.value = res.data

      createTunnel.server_id = servers.value[0].id

      servers_http.value = servers.value.filter((server) => {
        return server.allow_http == 1
      })

      servers_https.value = servers.value.filter((server) => {
        return server.allow_https == 1
      })

      servers_tcp.value = servers.value.filter((server) => {
        return server.allow_tcp == 1
      })

      servers_udp.value = servers.value.filter((server) => {
        return server.allow_udp == 1
      })
    })
  }

  function getCurrentServer(id) {
    // 从 servers 中找到 id 对应的服务器
    selectedServer.value = servers.value.find((server) => {
      return server.id == id
    })
  }

  function randomRemotePort() {
    const input = createTunnel.value.remote_port ?? 0

    const start = selectedServer.value.min_port
    const end = selectedServer.value.max_port

    if (input < start || input > end) {
      createTunnel.value.remote_port = Math.floor(
        Math.random() * (end - start + 1) + start
      )
    }
  }

  function create() {
    http
      .post('/modules/frp/hosts', createTunnel.value)
      .then((res) => {
        // 刷新列表

        if (res.status == 200 || res.status == 201) {
          http.get('/modules/frp/hosts').then((res) => {
            tunnels.value = res.data
          })
          tunnelCreated.value = true
        } else {
          tunnelCreateError.value = res.message
        }
      })
      .catch((status, message) => {
        tunnelCreateError.value =
          '无法创建隧道，可能是表单没有填写完整，或者服务器不接受此端口（端口被占用或者不在范围内）'
      })
  }
</script>