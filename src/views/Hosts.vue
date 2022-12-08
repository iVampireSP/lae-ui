<template>
  <div>
    <h3>计费项目列表</h3>

    <p v-if="store.state.user.user_group_id !== null">
      此账号拥有 {{ store.state.user.user_group.discount }}% 的折扣。
      <span v-if="store.state.user.user_group.exempt"> 并且豁免计费。 </span>
      <span class="text-danger">价格均为使用折扣后的价格。</span>
    </p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">服务</th>
            <th scope="col">名称</th>
            <th scope="col">元 / 月(大约)</th>
            <th scope="col">本月消耗</th>
            <th scope="col">状态</th>
            <th scope="col">几分扣费</th>
            <th scope="col">创建时间</th>
            <!-- <th scope="col">更新时间</th> -->
            <th scope="col">释放</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="host in hosts">
            <td>{{ host.module.name }}</td>
            <td>{{ host.name }}</td>
            <td>
              <span
                v-if="
                  host.price == 0 &&
                  (host.managed_price == 0 || host.managed_price == null)
                "
                class="text-danger"
              >
                被接管
              </span>
              <span v-else class="text-success">
                {{ host.price }} 元 / 月
              </span>
            </td>
            <td>
              <span v-if="usages.balances[host.id]">
                {{ usages.balances[host.id] }} 元
              </span>
              <span v-else> 0 元 </span>
            </td>
            <td>
              <span v-if="host.status == 'running'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i> &nbsp;运行中</span
                >
              </span>
              <span v-else-if="host.status == 'pending'">
                <span class="text-warning"
                  ><i class="bi bi-clock-history"></i> &nbsp;等待中</span
                >
              </span>
              <span v-else-if="host.status == 'suspended'">
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp;已暂停
                </span>
              </span>
              <span v-else>
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp;已停止
                </span>
              </span>
            </td>
            <td>{{ new Date(host.created_at).getMinutes() }} 分</td>
            <td>{{ new Date(host.created_at).toLocaleString() }}</td>
            <!-- <td>{{ new Date(host.updated_at).toLocaleString() }}</td> -->
            <td>
              <a href="#" @click="deleteHost(host.id)">释放</a>
              <span
                v-show="host.status == 'suspended' || host.status == 'stopped'"
                >&nbsp;</span
              >
              <a
                v-show="host.status == 'suspended' || host.status == 'stopped'"
                href="#"
                @click="startHost(host.id)"
                >启动</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p>
      注意:
      部分服务会接管价格。价格被接管后，我们将不会自动扣费，扣费控制权将交给对应服务。
    </p>
    <p>如果价格被接管，则可能是按量计费等。</p>

    <p>当您释放资源后，我们将会在后台排队处理，这可能需要一些时间。</p>
    <p>请注意: 余额 计算并不准确。它可能与实际获得有点偏差。</p>
    <p>现在，计费已经改为每小时一次。在每小时的第几分扣费。</p>
  </div>
</template>

<script setup>
  import http from '../api/http'
  import store from '../plugins/store'
  import { ref, onMounted, onUnmounted } from 'vue'

  const hosts = ref([])

  const usages = ref([])

  function refresh() {
    http
      .get('/hosts')
      .then((res) => {
        const user = store.state.user

        let temp_hosts = []

        if (user.user_group_id !== null) {
          res.data.forEach((host) => {
            host.price = parseFloat(host.managed_price ?? host.price)

            if (host.price != 0) {
              host.price = host.price * ((1 - user.user_group.discount) / 100)

              // 转正数
              host.price = Math.abs(host.price)

              // 保留两位小数
              host.price = host.price.toFixed(4)
            }

            temp_hosts.push(host)
          })
        } else {
          temp_hosts = res.data
        }

        hosts.value = temp_hosts
      })
      .catch((err) => {
        console.log(err)
      })

    http
      .get('/hosts/usages')
      .then((res) => {
        usages.value = res.data
      })
      .catch((err) => {
        console.log(err)
      })
  }

  function deleteHost(id) {
    if (
      confirm(
        '释放后，您将无法再次使用此资源，它的数据将会被彻底删除并且无法找回，是否继续？'
      )
    ) {
      http.delete('/hosts/' + id).then((res) => {
        refresh()
      })
    }
  }

  function startHost(id) {
    http
      .patch('/hosts/' + id, { status: 'running' })
      .then((res) => {
        // if status 400
        if (res.status == 400) {
          alert(res.data.message)
        } else {
          refresh()
        }
      })

      .catch(() => {
        alert('无法解除暂停。可能是您的余额不足。')
      })
  }

  onMounted(() => {
    refresh()
    const interval = setInterval(refresh, 5000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
</script>
