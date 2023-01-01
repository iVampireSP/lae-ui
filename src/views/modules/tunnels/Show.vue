<template>
  <div>
    <div v-if="loaded">
      <h3>
        <input
          class="editable"
          v-model="tunnel.name"
          @change="change()"
          placeholder="隧道名称是必填项"
        />
      </h3>

      <div class="btn-group" role="group" aria-label="隧道控制按钮组">
        <button
          class="btn btn-outline-primary"
          v-if="tunnel.status == 'running'"
          @click="stopTunnel()"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="不再接受新的隧道连接并立即下线客户端。"
        >
          停用隧道
        </button>

        <button
          v-else-if="tunnel.status == 'stopped'"
          class="btn btn-outline-primary"
          @click="startTunnel()"
        >
          启用隧道
        </button>

        <button
          class="btn btn-outline-secondary"
          v-show="canDelete"
          @click="resetToken()"
          type="button"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="你需要关闭客户端后，才能重置。"
        >
          重置 Token
        </button>

        <button
          class="btn btn-outline-danger"
          v-show="canDelete"
          @click="deleteTunnel()"
          type="button"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="删除后，你将无法恢复该隧道。如果你的隧道没有停止，则你看不见删除按钮。"
        >
          删除
        </button>
      </div>

      <!-- <p v-else-if="tunnel.status == 'suspended'">
        隧道已被暂停，无法进一步操作。
      </p> -->

      <p v-if="tunnel.status == 'suspended'">隧道已被暂停，无法进一步操作。</p>

      <div v-if="showChart">
        <vue-echarts :option="option" style="height: 500px" ref="chart" />
      </div>

      <p v-if="tunnel.status == 'stopped'" class="mt-1">
        隧道已经停止，如果客户端还在运行，则会正常计费。<span
          v-show="!canDelete"
          >在客户端关闭大约1分钟左右，才可以删除隧道。</span
        >
      </p>

      <p v-show="tunnel.today_traffic_in">
        今日入流量 {{ tunnel.today_traffic_in / (1024 * 1024 * 1024) }} GB
      </p>

      <p v-show="tunnel.today_traffic_in">
        今日出流量 {{ tunnel.today_traffic_in / (1024 * 1024 * 1024) }} GB
      </p>

      <p class="mt-3">
        外部连接:
        <span
          v-if="tunnel.protocol == 'http' || tunnel.protocol == 'https'"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="在新标签页打开"
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

        <span
          v-else
          class="cursor-pointer"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="点击来复制"
          @click="copy(tunnel.server.server_address + ':' + tunnel.remote_port)"
        >
          {{
            tunnel.protocol +
            '://' +
            tunnel.server.server_address +
            ':' +
            tunnel.remote_port
          }}
        </span>
      </p>

      <!-- 隧道配置文件 -->
      <div class="mt-3">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              class="nav-link active"
              id="nav-tunnel-status-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-tunnel-status"
              type="button"
              role="tab"
              aria-controls="nav-tunnel-status"
              aria-selected="true"
            >
              隧道状态
            </button>

            <button
              class="nav-link"
              id="nav-conf-all-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-conf-all"
              type="button"
              role="tab"
              aria-controls="nav-conf-all"
              aria-selected="false"
            >
              全部配置
            </button>
            <button
              class="nav-link"
              id="nav-conf-server-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-conf-server"
              type="button"
              role="tab"
              aria-controls="nav-conf-server"
              aria-selected="false"
            >
              服务器
            </button>
            <button
              class="nav-link"
              id="nav-conf-client-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-conf-client"
              type="button"
              role="tab"
              aria-controls="nav-conf-client"
              aria-selected="false"
            >
              客户端
            </button>
            <button
              class="nav-link"
              id="nav-conf-client-in-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-conf-client-in"
              type="button"
              role="tab"
              aria-controls="nav-conf-client-in"
              aria-selected="false"
            >
              传入配置
            </button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade"
            id="nav-conf-all"
            role="tabpanel"
            aria-labelledby="nav-conf-all-tab"
          >
            <p class="mt-1">您可以随时更改<strong>本地 IP 和端口</strong>。</p>
            <textarea class="w-100" rows="20" readonly
              >{{ tunnel.config.server }} 

# {{ tunnel.name }} 在 {{ tunnel.server.name }} 上
# 请在截图时打码下一行信息。
{{ tunnel.config.client }}</textarea
            >
          </div>
          <div
            class="tab-pane fade"
            id="nav-conf-server"
            role="tabpanel"
            aria-labelledby="nav-conf-server-tab"
          >
            <p class="mt-1">您可以在同一个服务器中启动多个隧道。</p>

            <textarea class="w-100" rows="20" readonly>{{
              tunnel.config.server
            }}</textarea>
          </div>
          <div
            class="tab-pane fade"
            id="nav-conf-client"
            role="tabpanel"
            aria-labelledby="nav-conf-client-tab"
          >
            <p class="mt-1">您可以随时更改<strong>本地 IP 和端口</strong>。</p>

            <textarea class="w-100" rows="20" readonly>{{
              '# ' +
              tunnel.name +
              ' 在 ' +
              tunnel.server.name +
              ' 上 ' +
              '\n' +
              tunnel.config.client
            }}</textarea>
          </div>

          <div
            id="nav-tunnel-status"
            class="tab-pane fade show active"
            role="tabpanel"
            aria-labelledby="nav-conf-client-tab"
          >
            <div class="mt-2">
              <div v-if="tunnel.tunnel">
                <h4 class="mt-3">连接信息</h4>

                <div class="p">
                  域名解析到: {{ tunnel.server.server_address }}
                </div>

                <div class="p">
                  <p>活动连接: {{ tunnel.tunnel.cur_conns ?? 0 }}</p>
                  <p>
                    上次关闭时间:
                    {{ tunnel.tunnel.last_close_time ?? '未捕获' }}
                  </p>
                  <p>
                    上次启动时间:
                    {{ tunnel.tunnel.last_start_time ?? '未捕获' }}
                  </p>
                  <p v-show="tunnel.tunnel.today_traffic_in">
                    今日入流量:
                    {{
                      tunnel.tunnel.today_traffic_in / 1024 / 1024 / 1024 ?? 0
                    }}
                    GB
                  </p>
                  <p v-show="tunnel.tunnel.today_traffic_out">
                    今日出流量:
                    {{
                      tunnel.tunnel.today_traffic_out / 1024 / 1024 / 1024 ?? 0
                    }}
                    GB
                  </p>
                </div>
              </div>
              <div v-else>当前隧道不在线。</div>
            </div>
          </div>
        </div>

        <div
          id="nav-conf-client-in"
          class="tab-pane fade"
          role="tabpanel"
          aria-labelledby="nav-conf-client-in-tab"
        >
          <h4 class="mt-3">客户端传入配置</h4>
          <table class="table table-hover" v-if="tunnel.tunnel.conf">
            <thead>
              <th>配置键名称</th>
              <th>配置键值</th>
            </thead>
            <tbody>
              <tr v-for="(value, key) in tunnel.tunnel.conf" :key="key">
                <td>{{ key }}</td>
                <td>{{ value }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>隧道不在线。</p>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="placeholder-wave">
        <div class="placeholder w-50" style="height: 100px"></div>
      </div>

      <div class="placeholder-wave mt-4">
        <div class="placeholder w-100" style="height: 500px"></div>
      </div>

      <div class="placeholder-wave mt-4">
        <div class="placeholder w-100" style="height: 300px"></div>
      </div>
    </div>
  </div>
  <!-- <pre v-text="tunnel"></pre> -->
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { VueEcharts } from 'vue3-echarts'

  import Humanize from 'humanize-plus'

  import http from '../../../api/http'
  import route from '../../../plugins/router'

  const router = useRoute()

  const tunnel = ref({})

  const loaded = ref(false)

  const url = '/modules/frp/hosts/' + router.params.id

  const canDelete = ref(true)
  const showChart = ref(false)

  function refresh() {
    http.get(url).then((res) => {
      tunnel.value = res.data
      loaded.value = true

      if (tunnel.value.tunnel.length !== 0) {
        if (tunnel.value.tunnel.status !== 'offline') {
          canDelete.value = false
        }
      }

      if (tunnel.value.traffic.length !== 0) {
        showChart.value = true
        freshChart()
      }
    })
  }

  refresh()

  function change() {
    http.patch(url, { name: tunnel.value.name })
  }

  //   function stop() {
  //     http.patch(url, { status: 'stopped' }).then(() => {
  //       tunnel.value.status = 'stopped'
  //     })
  //     refresh()
  //   }

  //   function start() {
  //     http.patch(url, { status: 'running' }).then(() => {
  //       tunnel.value.status = 'running'
  //     })
  //     refresh()
  //   }

  function copy(text) {
    navigator.clipboard.writeText(text)
  }

  function deleteTunnel() {
    if (confirm('确定删除该隧道？')) {
      http.delete(url).then(() => {
        route.push({ name: 'modules.tunnels' })
      })
    }
  }

  function resetToken() {
    if (confirm('重置后，原来的配置文件将不能登录隧道。要继续吗？')) {
      http.patch(url, { reset_token: true }).then(() => {
        refresh()
      })
    }
  }

  function stopTunnel() {
    http.patch(url, { status: 'stopped' }).then(() => {
      setTimeout(() => {
        refresh()
      }, 1000)
    })
  }

  function startTunnel() {
    http.patch(url, { status: 'running' }).then(() => {
      setTimeout(() => {
        refresh()
      }, 1000)
    })
  }

  const option = ref({})

  function freshChart() {
    if (showChart.value) {
      let trafficInArr = tunnel.value.traffic.traffic_in
      let trafficOutArr = tunnel.value.traffic.traffic_out

      trafficInArr = trafficInArr.reverse()
      trafficOutArr = trafficOutArr.reverse()
      let now = new Date()
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      let dates = new Array()
      for (let i = 0; i < 7; i++) {
        dates.push(
          now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        )
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      }

      option.value = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (data) {
            let html = ''
            if (data.length > 0) {
              html += data[0].name + '<br/>'
            }
            for (let v of data) {
              let colorEl =
                '<span style="display:inline-block;margin-right:5px;' +
                'border-radius:10px;width:9px;height:9px;background-color:' +
                v.color +
                '"></span>'
              html +=
                colorEl +
                v.seriesName +
                ': ' +
                Humanize.fileSize(v.value) +
                '<br/>'
            }
            return html
          },
        },
        legend: {
          data: ['入站流量', '出站流量'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: dates,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              formatter: function (value) {
                return Humanize.fileSize(value)
              },
            },
          },
        ],
        series: [
          {
            name: '入站流量',
            type: 'bar',
            data: trafficInArr,
          },
          {
            name: '出站流量',
            type: 'bar',
            data: trafficOutArr,
          },
        ],
      }
    }
  }
</script>

<style scoped>
  .p p {
    padding: 0;
    margin: 1px;
  }
</style>
