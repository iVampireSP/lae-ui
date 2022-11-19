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

    <!-- 贡献代码 -->
    <h3>GitHub</h3>
    <p>如果您想要为莱云 控制面板 贡献代码，或者自定义它。</p>
    <a target="_blank" href="https://github.com/iVampireSP/lae-ui">https://github.com/iVampireSP/lae-ui</a>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import http from '../api/http'
  import store from '../plugins/store'

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

    setTimeout(() => {
      show.value = true
    }, 1000)
  })

  function randomInt() {
    return Math.floor(Math.random() * 100)
  }

  let fontSize = 100
  let color = 'black'

  // let sentences = [
  //   'Make LAE great again!',
  //   '莱云',
  //   'LAECLOUD',
  //   '正在点咖啡',
  //   '正在拉花',
  //   '正在制作卡布奇诺',
  //   '正在制作拿铁',
  //   'Mirror Edge 现在是莱云的一部分!',
  //   '齉龘齉齾爩麤龗灪龖厵纞虋',
  //   '锟斤拷烫烫烫屯屯屯'
  // ]
  // // pick
  // let sentence = sentences[Math.floor(Math.random() * sentences.length)]

  let sentence = store.state.user.name ?? '莱云'

  function resizeFont() {
    if (window.innerWidth < 768) {
      fontSize = 40

      if (sentence.length > 20) {
        fontSize = 20
      }

      //   如果渲染后字体太大，就缩小
      if (sentence.length * fontSize > window.innerWidth) {
        fontSize = window.innerWidth / sentence.length
      }
    } else {
      if (sentence.length > 20) {
        fontSize = 50
      }
    }
  }
  // if dark mode
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    color = 'white'
  }

  onMounted(() => {
    resizeFont()

    var chartDom = document.getElementById('chart-container')
    var myChart = echarts.init(chartDom, null, {
      renderer: 'svg',
    })
    var option

    let lineDash = randomInt() * 10
    option = {
      graphic: {
        elements: [
          {
            type: 'text',
            left: 'center',
            top: 'center',
            style: {
              text: sentence,
              fontSize: fontSize,
              fontWeight: 300,
              lineDash: [0, 200],
              lineDashOffset: 0,
              fill: 'transparent',
              stroke: color,
              lineWidth: 1,
            },
            keyframeAnimation: {
              duration: 1000,
              loop: false,
              keyframes: [
                {
                  percent: 0.5,
                  style: {
                    fill: 'transparent',
                    lineDashOffset: lineDash,
                    lineDash: [lineDash, 0],
                  },
                },
                {
                  percent: 1,
                  style: {
                    fill: color,
                  },
                }
              ],
            },
          },
        ],
      },
    }

    option && myChart.setOption(option)

    // when resize, resize chart
    window.addEventListener('resize', () => {
      myChart.resize()

      resizeFont()
    })
  })

  onUnmounted(() => {
    window.removeEventListener('resize', () => {
      myChart.resize()
      resizeFont()
    })
  })
</script>
