<template>
  <div
    v-show="!show"
    style="width: 100%; height: 500px"
    id="chart-container"
  ></div>

  <div class="mb-2" v-show="show">
    <h4>欢迎使用 莱云</h4>

    <!-- <span v-if="item.attributes">
      {{ item.attributes.title }}
    </span>

    <span v-if="item.attributes">
      {{ new Date(item.attributes.createdAt).toLocaleString() }}
    </span> -->

    <div v-show="base_url">
      <h4 class="mt-3">公告</h4>
      <div class="list-group mt-3" v-for="item in pinned">
        <span v-if="item.attributes">
          <a
            class="list-group-item list-group-item-action shadow-sm rounded"
            target="_blank"
            :href="base_url + '/d/' + item.attributes.slug"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 text-success">
                {{ item.attributes.title }}
              </h5>
              <small>
                {{ new Date(item.attributes.lastPostedAt).toLocaleString() }}
              </small>
            </div>
            <!-- <p class="mb-1">
            <span></span>
          </p> -->
            <!-- <small class="text-muted">
        </small> -->
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import http from '../api/http'

  import * as echarts from 'echarts/core'
  import { GraphicComponent } from 'echarts/components'
  import { SVGRenderer } from 'echarts/renderers'

  echarts.use([GraphicComponent, SVGRenderer])

  const pinned = ref([])
  const base_url = ref('')
  const show = ref(false)

  http.get('forum/pinned').then((res) => {
    pinned.value = res.data

    base_url.value = pinned.value.base_url

    show.value = true
  })

  onMounted(() => {
    var chartDom = document.getElementById('chart-container')
    var myChart = echarts.init(chartDom, null, {
      renderer: 'svg',
    })
    var option

    option = {
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: '莱云',
              fontSize: 80,
              fontWeight: 'bold',
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: 'transparent',
              stroke: '#000',
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 1500,
              loop: false,
              keyframes: [
                {
                  percent: 0.7,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: 200,
                    lineDash: [200, 0],
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: 'black',
                  },
                },
              ],
            },
          },
        ],
      },
    }

    option && myChart.setOption(option)
  })
</script>
