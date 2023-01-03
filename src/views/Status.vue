<template>
  <div class="mb-3 btn-group container">
    <a href="#" @click="changeType('basic')" class="btn btn-outline-primary">基础</a>
    <a href="#" @click="changeType('gauge')" class="btn btn-outline-primary">仪表</a>
    <a href="#" @click="changeType('chart')" class="btn btn-outline-primary">折线</a>
  </div>
  <div class="text-center" v-show="type === 'basic'">
    <div class="row mt-5">
      <div class="col">
        <h3>活动连接</h3>
        <p class="display-5">
          <Number :to="array.active" />
        </p>
      </div>
    </div>
    <div class="row mt-5">
      <div class="col">
        <h3>连接量</h3>
        <p class="display-5">
          <Number :to="array.accepts" />
        </p>
      </div>
      <div class="col">
        <h3>握手数</h3>
        <p class="display-5">
          <Number :to="array.handled" />
        </p>
      </div>
      <div class="col">
        <h3>请求数</h3>
        <p class="display-5">
          <Number :to="array.requests" />
        </p>
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <h3>读取连接</h3>
        <p class="display-5">
          <Number :to="array.reading" />
        </p>
      </div>
      <div class="col">
        <h3>响应量</h3>
        <p class="display-5">
          <Number :to="array.writing" />
        </p>
      </div>
      <div class="col">
        <h3>驻留连接</h3>
        <p class="display-5">
          <Number :to="array.waiting" />
        </p>
      </div>
    </div>
  </div>

  <div
    v-show="type === 'gauge'"
    style="width: 100%; height: 500px"
    id="gauge"
  ></div>

  <div
    v-show="type === 'chart'"
    style="width: 100%; height: 500px"
    id="chart"
  ></div>
</template>

<script setup>
  import { ref, onUnmounted, onMounted } from 'vue'
  import axios from 'axios'
  import * as echarts from 'echarts'
  import Number from '../components/Number.vue'
  import api from '../config/api'

  const type = ref('basic')

  const array = ref({
    active: 0,
    accepts: 0,
    handled: 0,
    requests: 0,
    reading: 0,
    writing: 0,
    waiting: 0,
  })

  const requests = []
  const requests_at = []

  requests_at.push(new Date().getSeconds() - 2)
  requests_at.push(new Date().getSeconds() - 1)

  function refresh() {
    axios
      .get(api.status + '?time=' + new Date().getMilliseconds())
      .then((res) => {
        let response = res.data

        // 处理 nginx status 数据，提取为 json
        let data = response.split('\n')

        // 处理第一行
        let first = data[0].split(': ')
        let firstKey = first[0]
        let firstValue = first[1].split(' ')
        let firstData = {}
        firstData[firstKey] = firstValue

        array.value['active'] = firstValue[0]

        // requests
        // 转成string
        requests.push(firstValue[0])

        requests_at.push(new Date().getSeconds())

        // 如果 requests 长度大于 10，删除第一个
        if (requests.length > 10) {
          requests.shift()
          requests_at.shift()
        }

        // 第三行
        let third = data[2].split(' ')
        // 去除空值
        third = third.filter((item) => {
          return item !== ''
        })

        array.value['accepts'] = third[0]
        array.value['handled'] = third[1]
        array.value['requests'] = third[2]

        // 第四行，分割空格，去除空值，只保留数字
        let fourth = data[3].split(' ')
        fourth = fourth.filter((item) => {
          return item !== ''
        })
        fourth = fourth.filter((item) => {
          return !isNaN(item)
        })

        array.value['reading'] = fourth[0]
        array.value['writing'] = fourth[1]
        array.value['waiting'] = fourth[2]
      })
  }

  refresh()
  // 重复请求
  const timer = setInterval(refresh, 1000)

  onUnmounted(() => {
    clearInterval(timer)
  })

  let gauge = undefined
  let gaugeTimer = undefined
  let gaugeOption = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}%',
    },
    series: [
      {
        name: '活动连接',
        type: 'gauge',
        progress: {
          show: true,
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
        },
        data: [
          {
            value: array.value.active,
            name: '活动连接',
          },
        ],
      },
    ],
  }

  let chart = undefined
  let chartTimer = undefined
  let chartOptions = {
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
      name: '连接数量',
      axisLabel: {
        show: true,
      },
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        // smooth: true,
      },
    ],
  }

  function changeType(newType) {
    type.value = newType

    if (newType === 'gauge') {
      gaugeTimer = setInterval(() => {
        if (gauge) {
          gaugeOption.series[0].data[0].value = array.value.active

          gauge.setOption(gaugeOption)
        } else {
          initGauge()
        }
      }, 100)
    } else {
      if (gaugeTimer) {
        clearInterval(gaugeTimer)
      }
    }

    if (newType === 'chart') {
      chartTimer = setInterval(() => {
        if (chart) {
          chartOptions.series[0].data = requests
          chartOptions.xAxis.data = requests_at

          chart.setOption(chartOptions)
        } else {
          initChart()
        }
      }, 100)
    } else {
      if (chartTimer) {
        clearInterval(chartTimer)
      }
    }
  }

  function initGauge() {
    var gaugeDom = document.getElementById('gauge')
    gauge = echarts.init(gaugeDom, {
      backgroundColor: 'transparent',
      renderer: 'svg',
    })

    gaugeOption && gauge.setOption(gaugeOption)
  }

  function initChart() {
    var chartDom = document.getElementById('chart')
    chart = echarts.init(chartDom, {
      backgroundColor: 'transparent',
      renderer: 'svg',
      //   关闭 tooltip
      tooltip: {
        show: false,
      },
    })

    chartOptions && chart.setOption(gaugeOption)
  }

  //   resize
  onMounted(() => {
    window.addEventListener('resize', () => {
      gauge && gauge.resize()
      chart && chart.resize()
    })
  })

  //   unmount
  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      gauge && gauge.resize()
      chart && chart.resize()
    })
  })
</script>
