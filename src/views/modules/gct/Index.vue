<template>
  <div>
    <h3>游戏容器</h3>

    <div class="overflow-auto">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">名称</th>
            <th scope="col">IP:端口</th>
            <th scope="col">模板</th>
            <th scope="col">状态</th>
            <th scope="col">创建时间</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="host in hosts">
            <tr
              @click="
                route.push({
                  name: 'modules.gct.show',
                  params: { id: host.host_id },
                })
              "
              class="cursor-pointer"
            >
              <td>{{ host.host_id }}</td>
              <td>{{ host.name }}</td>
              <td>{{ host.ip + ':' + host.port }}</td>
              <td>{{ host.egg.name }}</td>
              <td>
                <span v-if="host.stats">
                  <span
                    v-if="host.stats.attributes.current_state === 'running'"
                    class="text-success"
                  >
                    运行中
                  </span>
                  <span
                    v-else-if="
                      host.stats.attributes.current_state === 'offline'
                    "
                    class="text-danger"
                  >
                    关机
                  </span>
                  <span
                    v-else-if="
                      host.stats.attributes.current_state === 'starting'
                    "
                    class="text-warning"
                  >
                    启动中
                  </span>
                  <span v-else>
                    {{ host.stats.attributes.current_state }}
                  </span>
                </span>

                <span v-else> ... </span>
              </td>
              <td>{{ new Date(host.created_at).toLocaleString() }}</td>
            </tr>
          </template>
          <!-- <tr v-for="host in hosts">
            <td>{{ host.host_id }}</td>
            <td>{{ host.name }}</td>
            <td>{{ host.ip + ':' + host.port }}</td>
            <td>{{ host.egg.name }}</td>
            <td>{{ new Date(host.updated_at).toLocaleString() }}</td>
            <td>{{ new Date(host.created_at).toLocaleString() }}</td>
            <td>
              <router-link
                :to="{ name: 'modules.gct.show', params: { id: host.host_id } }"
                >查看</router-link
              >
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>

  <div
    class="modal fade"
    id="updatePasswordModel"
    tabindex="-1"
    aria-labelledby="updatePasswordModel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">修改密码</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div
            v-if="passwordChanged == 'success'"
            class="alert alert-success"
            role="alert"
          >
            密码修改成功。
          </div>
          <div
            v-if="passwordChanged == 'error'"
            class="alert alert-danger"
            role="alert"
          >
            无法修改密码。可能是没有创建过服务器。
          </div>
          <div
            v-if="passwordChanged == 'wrong'"
            class="alert alert-danger"
            role="alert"
          >
            密码长度必须大于等于 8 位。
          </div>
          <div v-else class="alert alert-primary" role="alert">
            我们将修改对应您邮箱账户的面板密码。
          </div>
          <div class="form-floating mb-3">
            <input
              class="form-control"
              id="floatingPassword"
              placeholder="新的密码"
              v-model="password"
              min="8"
              type="password"
            />
            <label for="floatingPassword">新密码</label>
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
          <button type="button" class="btn btn-primary" @click="updatePwd()">
            修改
          </button>
        </div>
      </div>
    </div>
  </div>

  <div>
    <div class="btn-group" role="group">
      <router-link
        type="button"
        class="btn btn-outline-primary"
        :to="{ name: 'modules.gct.create' }"
        >创建服务器
      </router-link>
      <a
        type="button"
        class="btn btn-outline-primary"
        target="_blank"
        href="https://panel.muhanyun.cn"
        >前往控制面板</a
      >

      <button
        type="button"
        class="btn btn-outline-primary"
        data-bs-toggle="modal"
        data-bs-target="#updatePasswordModel"
      >
        修改面板密码
      </button>
    </div>
  </div>

  <div class="mt-3">
    <p>如果您是第一次使用，请在创建好服务器后前往邮箱中查看账号或密码。</p>
  </div>

  <div class="mt-3 text-center text-muted">
    <span>莱云 策划 / 运营 / 所有</span>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  //   import { useRoute } from 'vue-router'
  import http from '../../../api/http'
  import route from '../../../plugins/router'

  const hosts = ref({})

  //   const route = useRoute()

  const passwordChanged = ref('')
  const password = ref('')

  // 随机生成字符串
  //   function randomString(len) {
  //     len = len || 32
  //     var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  //     var maxPos = $chars.length
  //     var pwd = ''
  //     for (var i = 0; i < len; i++) {
  //       pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
  //     }
  //     return pwd
  //   }

  //   function toRoute(id) {
  //     // key.value = Math.round(Math.random() * 1000)
  //     route.push({ name: 'modules.gct.show', params: { id: id } })
  //     // key.value = Math.round(Math.random() * 1000)
  //   }

  function updatePwd() {
    if (password.value.length < 8) {
      passwordChanged.value = 'wrong'
      return
    }

    http
      .patch('/modules/gct/account', {
        password: password.value,
      })
      .then(() => {
        passwordChanged.value = 'success'
      })
      .catch(() => {
        passwordChanged.value = 'error'
      })
  }
  http.get('/modules/gct/hosts').then((res) => {
    hosts.value = res.data

    //   get resources
    hosts.value.forEach((host) => {
      http
        .get('/modules/gct/hosts/' + host.host_id + '/server/resources')
        .then((res) => {
          if (res.status == 200) {
            host.stats = res.data
          } else {
            host.stats = null
          }
        })
    })
  })
</script>
