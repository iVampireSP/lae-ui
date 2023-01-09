<template>
  <div>
    <n-h1 prefix="bar" align-text :type="tunnel.status === 'running' ? 'success' : 'error'">
      <n-gradient-text :type="tunnel.status === 'running' ? 'success' : 'error'">
        {{ tunnel.name }}
      </n-gradient-text>
    </n-h1>

    <div>
      <div id="chart" style="height: 400px"></div>
    </div>

    <n-tabs animated type="line">
      <n-tab-pane name="status" tab="隧道状态">
        <n-h2 prefix="bar">连接信息</n-h2>
        <n-h3 prefix="bar" v-if="tunnel.protocol === 'http' || tunnel.protocol === 'https'">域名解析到:
          {{ tunnel.server.server_address }}
        </n-h3>
        <n-h3 prefix="bar" v-else>
          <span v-if="tunnel.server.server_address !== ''">使用 {{ tunnel.server.server_address }}:{{
              tunnel.remote_port
            }} 来连接到服务器</span>
        </n-h3>
      </n-tab-pane>
      <n-tab-pane name="config_all" tab="全部配置">

        <n-popover trigger="hover">
          <template #trigger>
            <n-code
                :code="tunnel.config.server + '\n\n' + tunnel.config.client"
                @click="copy(tunnel.config.client)"
                language="ini"
                trim
                show-line-numbers
            />
            <!--            <n-input-->
            <!--                :autosize="{-->
            <!--              minRows: 10-->
            <!--            }"-->
            <!--                :value="tunnel.config.server + '\n\n' + tunnel.config.client"-->
            <!--                placeholder=""-->
            <!--                readonly-->
            <!--                type="textarea"-->
            <!--                @click="copy(tunnel.config.server + '\n\n' + tunnel.config.client)"-->
            <!--            />-->
          </template>
          <span>点击复制</span>
        </n-popover>
      </n-tab-pane>
      <n-tab-pane name="server" tab="服务端">
        <n-popover trigger="hover">
          <template #trigger>
            <n-code
                :code="tunnel.config.server"
                @click="copy(tunnel.config.client)"
                language="ini"
                trim
                show-line-numbers
            />
            <!--            <n-input-->
            <!--                :autosize="{-->
            <!--                  minRows: 4-->
            <!--                }"-->
            <!--                :value="tunnel.config.server"-->
            <!--                placeholder=""-->
            <!--                readonly-->
            <!--                type="textarea"-->
            <!--                @click="copy(tunnel.config.server)"-->
            <!--            />-->
          </template>
          <span>点击复制</span>
        </n-popover>
      </n-tab-pane>
      <n-tab-pane name="client" tab="客户端">
        <n-popover trigger="hover">
          <template #trigger>
            <n-code
                :code="tunnel.config.client"
                @click="copy(tunnel.config.client)"
                language="ini"
                trim
                show-line-numbers
            />
            <!--            <n-input-->
            <!--                :autosize="{-->
            <!--                  minRows: 4-->
            <!--                }"-->
            <!--                :value="tunnel.config.client"-->
            <!--                placeholder=""-->
            <!--                readonly-->
            <!--                type="textarea"-->
            <!--                @click="copy(tunnel.config.client)"-->
            <!--            />-->
          </template>
          <span>点击复制</span>
        </n-popover>
      </n-tab-pane>
      <n-tab-pane name="post_config" tab="传入配置">
        <n-data-table
            :bordered="true"
            :columns="tunnelColumns"
            :data="tunnelData"
        />
        <template #trigger>
        </template>
      </n-tab-pane>
    </n-tabs>

    <div class="mt-80"></div>
  </div>


</template>

<script setup>

import {computed, onMounted, onUnmounted, ref} from 'vue'
import {NCode, NDataTable, NGradientText, NH1, NH2, NH3, NPopover, NTabPane, NTabs} from 'naive-ui'
import {useRoute} from "vue-router";

import Humanize from 'humanize-plus'

import http from "../../../plugins/http";

import * as echarts from 'echarts'
import {message} from "../../../utils/layout.js";


const router = useRoute()
const showChart = ref(false)

// const tunnel = ref({});
const tunnel = ref({
  name: '',
  status: 'running',
  traffic: {
    traffic_in: [],
    traffic_out: []
  },
  server: {
    server_address: ''
  },
  tunnel: {
    conf: {}
  }
})

let chart = undefined
let chartOptions = {
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
      data: [],
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
      data: []
    },
    {
      name: '出站流量',
      type: 'bar',
      data: [],
    },
  ],

}

function copy(content) {
  navigator.clipboard.writeText(content);
  message.success("复制成功");
}

function initChart() {
  let chartDom = document.getElementById('chart')
  chart = echarts.init(chartDom, {
    backgroundColor: 'transparent',
    renderer: 'svg',
  })

  chartOptions && chart.setOption(chartOptions)
}

function refresh() {
  http.get('/modules/frp/hosts/' + router.params.id).then((res) => {
    tunnel.value = res.data

    // tunnel.value.tunnel = res.data.tunnel
    // console.log(tunnel.value.tunnel.conf)
    // console.log(tunnel,tunnel.value,res.data);
    // console.log(res.data);

    if (res.data.traffic) {

      if (!showChart.value) {
        // initChart()
        showChart.value = true
      }

      let now = new Date()
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      let dates = []
      for (let i = 0; i < 7; i++) {
        dates.push(
            now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate()
        )
        now = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      }

      chartOptions.xAxis[0].data = dates

      let trafficInArr = res.data.traffic.traffic_in
      let trafficOutArr = res.data.traffic.traffic_out

      if (!trafficInArr || !trafficOutArr) {
        return;

      }

      trafficInArr = trafficInArr.reverse()
      trafficOutArr = trafficOutArr.reverse()


      if (chart) {
        chartOptions.series[0].data = trafficInArr
        chartOptions.series[1].data = trafficOutArr

        chart.setOption(chartOptions)
      }

    }

  })
}

refresh()

let resizeInterval = setInterval(() => {
  chart && chart.resize()
},)
onMounted(() => {
  initChart()

  window.addEventListener('resize', () => {

    chart && chart.resize()
  })
})

const timer = setInterval(refresh, 10000)

// 销毁时清除定时器
onUnmounted(() => {
  clearInterval(timer)

  if (resizeInterval) {
    clearInterval(resizeInterval)
  }

  // remove listener
  window.removeEventListener('resize', () => {
    resizeInterval = setInterval(() => {
      chart && chart.resize()
    }, 1000)
    initChart()
    chart && chart.resize()
  })

})
const tunnelColumns = [
  {
    title: "键名",
    key: "key"
  },
  {
    title: "值",
    key: "value"
  }
];

let tunnelData = computed(() => {
  let data = [];
  const conf = tunnel.value.tunnel.conf;
  for (const key in conf) {
    if (conf[key] !== null)
        // if(conf[key] !== null || conf[key] !== '')
      data.push({'key': key, value: conf[key].toString()});
    // console.log(key,conf[key],typeof(conf[key]))
  }
  return data;
})

</script>