<template>
  <div class="mt-3">
    <div v-if="loaded">
      <h3>
        <input
          class="editable"
          v-model="tunnel.name"
          @change="change()"
          placeholder="隧道名称是必填项"
        />
      </h3>

      <button
        class="btn btn-primary"
        v-if="tunnel.status == 'running'"
        @click="stop()"
      >
        停用隧道
      </button>

      <p v-else-if="tunnel.status == 'suspended'">
        隧道已被暂停，无法进一步操作。
      </p>

      <button
        v-else-if="tunnel.status == 'stopped'"
        class="btn btn-primary"
        @click="start()"
      >
        启用隧道
      </button>

      <button
        class="btn btn-danger m-lg-2"
        v-show="canDelete"
        @click="deleteTunnel()"
        type="button"
        data-bs-toggle="tooltip"
        data-bs-placement="right"
        title="删除后，你将无法恢复该隧道。如果你的隧道没有停止，则你看不见删除按钮。"
      >
        删除
      </button>

      <button
        class="btn btn-danger"
        v-show="canDelete"
        @click="resetToken()"
        type="button"
      >
        重置 Token
      </button>

      <div v-if="showChart">
        <vue-echarts :option="option" style="height: 500px" ref="chart" />
      </div>
      <div v-else>暂时没有流量数据。</div>

      <p v-if="tunnel.status == 'stopped'">
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

      <p class="mt-3">隧道外部链接地址 {{ tunnel.server.server_address }}</p>

      <!-- 隧道配置文件 -->
      <div class="mt-3">
        <nav>
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button
              class="nav-link active"
              id="nav-conf-all-tab"
              data-bs-toggle="tab"
              data-bs-target="#nav-conf-all"
              type="button"
              role="tab"
              aria-controls="nav-conf-all"
              aria-selected="true"
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
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent">
          <div
            class="tab-pane fade show active"
            id="nav-conf-all"
            role="tabpanel"
            aria-labelledby="nav-conf-all-tab"
          >
            <p class="mt-1">您可以随时更改<strong>本地 IP 和端口</strong>。</p>
            <textarea class="w-100" rows="20" readonly
              >{{ tunnel.config.server }} 

# {{ tunnel.name }} 在 {{ tunnel.server.name }} 上
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
        </div>
      </div>
    </div>
    <div v-else>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
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

  const tunnel = ref([])

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

  function stop() {
    http.patch(url, { status: 'stopped' }).then(() => {
      tunnel.value.status = 'stopped'
    })
    refresh()
  }

  function start() {
    http.patch(url, { status: 'running' }).then(() => {
      tunnel.value.status = 'running'
    })
    refresh()
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
