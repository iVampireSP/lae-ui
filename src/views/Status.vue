<template>
  <div class="text-center">
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
</template>

<script setup>
  import { ref, onUnmounted } from 'vue'

  import Number from '../components/Number.vue'

  import axios from 'axios'

  import api from '../config/api'

  const array = ref({
    active: 0,
    accepts: 0,
    handled: 0,
    requests: 0,
    reading: 0,
    writing: 0,
    waiting: 0,
  })

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
</script>
