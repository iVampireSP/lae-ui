<template>
  <div>
    <h3>游戏容器促销</h3>

    <p>本次促销的地区: 湖北十堰</p>

    <p>
      我们的价格再次跌破底线，1 核心，1G 内存，1G 硬盘。
      <br />
      <span class="fs-3">最低仅需</span> <span class="fs-1">￥4.16/月！</span>
    </p>

    <h4 class="mt-3">为何会如此便宜？</h4>
    <p>
      此节点使用了双路 E5-2670 v2 @ 2.50GHz
      <br />
      硬盘为高性能的机械硬盘。
    </p>

    <h4>我用的到此服务器吗？</h4>
    <p>
      如果您想开一个长久的，小型的多人联机用的服务器，那么此节点会是一个不错的选择。
    </p>

    <p>您还可以拿它当作一个语音服务器，与好友们开黑。</p>

    <h4>开设此服务器</h4>
    <p>我们提供了一些预设，点击即可创建。</p>

    <div class="btn-group" role="group">
      <button
        class="btn btn-outline-primary"
        @click="setGct('MC Java 原版服务器', 100, 1024, 3)"
      >
        1核 1G <br />
        MC Java 原版服务器
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('MC Java 原版服务器', 200, 4096, 3)"
      >
        2核 4G <br />
        MC Java 原版服务器
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('MC Java 原版服务器', 400, 8192, 3)"
      >
        4核 8G <br />
        MC Java 原版服务器
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('CatServer Mod 端', 400, 8192, 23)"
      >
        4核 8G <br />
        CatServer Mod 端 1.12.2
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('LiteLoader 服务端', 200, 4096, 31)"
      >
        2核 4G <br />
        LiteLoader 服务端
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('LiteLoader 服务端', 200, 4096, 31)"
      >
        2核 4G <br />
        LiteLoader 服务端
      </button>
      <button
        class="btn btn-outline-primary"
        @click="setGct('BDS 服务端', 200, 4096, 19)"
      >
        2核 4G <br />
        BDS 服务端
      </button>
    </div>

    <div class="progress mt-3" v-if="showProgress">
      <div
        class="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        aria-label="Example with label"
        :style="'width: ' + progress + '%'"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        {{ progress + '%' }}
      </div>
    </div>

    <p class="mt-3">
      您点击后，即可完成创建。<br />价格可以在 计费项目列表
      中查看。如果您不满意，您可以在 5 分钟内销毁，这样不会产生任何费用。
    </p>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  import route from '../plugins/router'

  const gct = ref({
    name: 'MC 原版服务器',
    cpu_limit: 100,
    memory: 1024,
    disk: 10240,
    databases: 0,
    allocations: 1,
    backups: 1,
    egg_id: 3,
    location_id: 3,
  })

  const showProgress = ref(false)
  const progress = ref(0)

  function setGct(name, cpu_limit, memory, egg_id) {
    gct.value.cpu_limit = cpu_limit
    gct.value.memory = memory
    gct.value.egg_id = egg_id
    gct.value.name = name

    let inter = setInterval(() => {
      progress.value += 1

      if (progress.value >= 90) {
        clearInterval(inter)
      }
    }, 50)

    http
      .post('/modules/gct/hosts', gct.value)
      .then((res) => {
        clearInterval(inter)
        progress.value = 100

        setTimeout(() => {
          showProgress.value = false
          progress.value = 0

          route.push({
            name: 'modules.gct',
          })
        }, 5000)
      })
      .catch((err) => {
        console.log(err)
        alert('创建失败')
      })

    showProgress.value = true
  }
</script>
