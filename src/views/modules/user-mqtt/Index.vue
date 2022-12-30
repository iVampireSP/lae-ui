<template>
  <p>此功能目前还在测试阶段。</p>
  <div>
    <div v-show="hosts.length === 0">
      <h5>此账户下还没有消息队列服务。</h5>

      <label for="password">请输入密码</label>
      <input
        type="password"
        class="form-control"
        id="password"
        v-model="create.password"
        placeholder="设置一个用于 MQTT 的登录密码。"
      />

      <button class="btn btn-primary mt-3" @click="createHost">创建</button>
    </div>

    <div v-show="hosts.length > 0">
      <div>
        <h5>欢迎使用消息队列</h5>

        <span>此主机 ID: {{ host.host_id }}</span>
        <br />
        <span>MQTT 服务器地址: mqtt.laecloud.com:1883</span>
        <br />
        <span>MQTT WS 接入地址: mqtt.laecloud.com:8083, Path 为 /mqtt</span>
        <br />
        <span>MQTT WSS 接入地址: mqtt.laecloud.com:8084, Path 为 /mqtt</span>
        <br />

        <span>用户名: user-mqtt.{{ host.host_id }}</span>
        <br />

        <span>密码: 您设置的密码</span>
      </div>

      <div class="mt-3">
        <h5>信任列表</h5>

        <div v-for="allow in allows" class="mt-3 text-success">
          <div class="d-flex justify-content-between mt-1">
            <div>
              <p>对端 主机 ID: {{ allow.allow_host_id }}</p>
            </div>

            <div>
              <a
                class="link cursor-pointer"
                @click="deleteAllow(allow.allow_host_id)"
              >
                删除
              </a>
            </div>
          </div>
        </div>

        <!-- 添加信任表单 -->
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="输入对方的 主机 ID"
            aria-label="输入对方的 主机 ID"
            aria-describedby="button-addon2"
            v-model="allow_host_id"
          />

          <button
            class="btn btn-outline-secondary"
            type="button"
            id="button-addon2"
            @click="addAllow"
          >
            添加
          </button>
        </div>

        <span class="form-text text-muted"
          >在您添加信任后，对方将可以在您的专属 Topic 中 发布/订阅 内容。</span
        >
      </div>

      <div class="mt-3">
        <h5>一些问题</h5>

        <span
          >您可以订阅的 Topic: <code>user-mqtt/{{ host.host_id }}/#</code></span
        >
        <br />
        <span>如果要订阅对方的 Topic，您需要要求对方信任您的主机 ID。</span>
        <br />
        <span
          >Topic 的格式为:
          <code
            >user-mqtt/<strong>主机 ID</strong>/<strong>Topic</strong></code
          ></span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../../../api/http'

  const hosts = ref({})
  const host = ref({})

  const allows = ref({})

  const allow_host_id = ref('')

//   const pwd = ref('点击显示')

  const create = ref({
    password: '',
  })

  function createHost() {
    http.post('/modules/user-mqtt/hosts', create.value).then((res) => {
      reloadHosts()
    })
  }

  function addAllow() {
    http
      .post('/modules/user-mqtt/hosts/' + host.value.host_id + '/allows', {
        host_id: allow_host_id.value,
      })
      .then((res) => {
        reloadHosts()
      })
  }

  function deleteAllow(allow_host_id) {
    http
      .delete(
        '/modules/user-mqtt/hosts/' +
          host.value.host_id +
          '/allows/' +
          allow_host_id
      )
      .then((res) => {
        reloadHosts()
      })
  }

  function reloadHosts() {
    http.get('/modules/user-mqtt/hosts').then((res) => {
      hosts.value = res.data

      if (hosts.value.length > 0) {
        host.value = hosts.value[0]
        http
          .get('/modules/user-mqtt/hosts/' + host.value.host_id + '/allows')
          .then((res) => {
            allows.value = res.data
          })
      }
    })
  }
  reloadHosts()
</script>
