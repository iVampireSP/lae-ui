<template>
  <div>
    <div>
      <NH1>{{ tunnel.name }}</NH1>
    </div>

    <div id="chart" style="height: 500px"></div>
  </div>


</template>

<script setup>

import {onMounted, onUnmounted, ref} from 'vue'
import {NH1} from 'naive-ui'
import {useRoute} from "vue-router";

import Humanize from 'humanize-plus'

import http from "../../../plugins/http";

import * as echarts from 'echarts'


const router = useRoute()
const showChart = ref(false)

const tunnel = ref({
  name: '',
  traffic: {
    traffic_in: [],
    traffic_out: []
  }
})

let chart = undefined
let chartTimer = undefined
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

    if (res.data.traffic) {

      if (!showChart.value) {
        initChart()
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

onMounted(() => {
  window.addEventListener('resize', () => {
    initChart()
    chart && chart.resize()
  })
})

// 10 秒钟刷新一次
const timer = setInterval(refresh, 2000)

// 销毁时清除定时器
onUnmounted(() => {
  clearInterval(timer)

  if (chartTimer) {
    clearInterval(chartTimer)
  }

  // remove listener
  window.removeEventListener('resize', () => {
    initChart()
    chart && chart.resize()
  })

})

</script>