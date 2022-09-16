<template>
  <div v-if="loaded">
    <h3>
      <input
        class="editable"
        v-model="gct.name"
        @change="change()"
        placeholder="请输入名称..."
      />
    </h3>

    <div class="mt-3">
      <a
        type="button"
        class="btn btn-outline-primary"
        target="_blank"
        :href="'https://panel.muhanyun.cn/server/' + gct.server.identifier"
        >前往控制面板</a
      >
    </div>

    <h4 class="mt-5">服务器参数</h4>

    <p>连接信息: {{ gct.ip }}:{{ gct.port }}</p>
    <div class="mt-3">
      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="pills-basic-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-basic"
            type="button"
            role="tab"
            aria-controls="pills-basic"
            aria-selected="true"
          >
            性能调整
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-feature-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-feature"
            type="button"
            role="tab"
            aria-controls="pills-feature"
            aria-selected="false"
          >
            高级设置
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-template-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-template"
            type="button"
            role="tab"
            aria-controls="pills-template"
            aria-selected="false"
          >
            重设模板
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-basic"
          role="tabpanel"
          aria-labelledby="pills-basic-tab"
        >
          <div class="mt-3">
            <h4 class="mt-1">您想要多少个 CPU 核心？</h4>
            <input
              type="range"
              class="form-range"
              min="100"
              max="800"
              step="100"
              v-model="gct.cpu_limit"
            />
            将使用 <span v-text="gct.cpu_limit / 100"></span> 个核心
          </div>

          <div class="mt-3">
            <h4 class="mt-5">您想要多大内存？</h4>
            <input
              type="range"
              class="form-range"
              min="512"
              max="10240"
              step="512"
              v-model="gct.memory"
            />
            将使用 <span v-text="gct.memory / 1024"></span> GB 内存
          </div>

          <div class="mt-3">
            <h4 class="mt-5">您需要多大的磁盘？</h4>
            <input
              type="range"
              class="form-range"
              min="512"
              max="40960"
              step="512"
              v-model="gct.disk"
            />
            将使用 <span v-text="gct.disk / 1024"></span> GB 磁盘
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-feature"
          role="tabpanel"
          aria-labelledby="pills-feature-tab"
        >
          <div class="mt-3">
            <h4 class="mt-1">需要备份吗？</h4>
            <input
              type="range"
              class="form-range"
              min="1"
              max="20"
              v-model="gct.backups"
            />
            将可以创建 <span v-text="gct.backups"></span> 个备份
            <small
              >修改此项目时，您应该确保从控制面板中删除了多余的备份。</small
            >
          </div>

          <div class="mt-3">
            <h4 class="mt-5">您需要多少端口？</h4>
            <input
              type="range"
              class="form-range"
              min="1"
              max="5"
              v-model="gct.allocations"
            />
            将分配 <span v-text="gct.allocations"></span> 个端口
            <small
              >修改此项目时，您应该确保从控制面板中删除了多余的端口。</small
            >
          </div>

          <div class="mt-3">
            <h4 class="mt-5">要多少个数据库？</h4>
            <input
              type="range"
              class="form-range"
              min="0"
              max="5"
              v-model="gct.databases"
            />
            将分配 <span v-text="gct.databases"></span> 个数据库
            <small
              >修改此项目时，您应该确保从控制面板中删除了多余的数据库。</small
            >
          </div>
        </div>
        <div
          class="tab-pane fade"
          id="pills-template"
          role="tabpanel"
          aria-labelledby="pills-template-tab"
        >
          <p>你需要重新安装服务器才能应用模板。</p>
          <div class="row">
            <div class="col">
              <select
                class="form-select form-select-sm"
                v-model="selected_nest_id"
                @change="updateEggs()"
              >
                <option v-for="nest in nests" :value="nest.id">
                  {{ nest.name }}
                </option>
              </select>
            </div>

            <div class="col" v-show="selected_nest_id">
              <select
                class="form-select form-select-sm"
                v-model="gct.egg_id"
                @change="updateThisEgg()"
              >
                <option v-for="egg in eggs" :value="egg.egg_id">
                  {{ egg.name }}
                </option>
              </select>
            </div>
          </div>

          <p v-text="nest_info.description"></p>
          <p v-text="egg_info.description"></p>
        </div>
      </div>
    </div>

    <div class="mt-4"></div>
    <button class="btn btn-outline-primary" @click="apply()">应用更改</button>
  </div>
  <div v-else>
    <div class="placeholder-wave">
      <div class="placeholder w-50" style="height: 100px"></div>
    </div>

    <div class="placeholder-wave w-75 mt-4">
      <div class="placeholder w-100" style="height: 200px"></div>
    </div>

    <div class="placeholder-wave w-75 mt-4">
      <div class="placeholder w-100" style="height: 500px"></div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'

  import http from '../../../api/http'
  //   import route from '../../../plugins/router'

  const loaded = ref(false)

  const gct = ref({
    name: '正在加载...',
  })

  const router = useRoute()

  http.get('/modules/gct/hosts/' + router.params.id).then((res) => {
    gct.value = res.data
  })

  function change() {
    http.patch('/modules/gct/hosts/' + router.params.id, {
      name: gct.value.name,
    })
  }

  const nests = ref({})
  const eggs = ref({})
  const nest_info = ref({})
  const egg_info = ref({})

  const selected_nest_id = ref(0)

  function updateEggs() {
    // 找到 nest_id
    nests.value.forEach((nest) => {
      if (nest.id == selected_nest_id.value) {
        nest_info.value = nest
        eggs.value = nest.eggs
        gct.value.egg_id = nest.eggs[0].egg_id
        updateThisEgg()
      }
    })
  }

  function updateThisEgg() {
    eggs.value.forEach((egg) => {
      if (egg.egg_id == gct.value.egg_id) {
        // console.log(egg)
        egg_info.value = egg
      }
    })
  }

  http.get('/modules/gct/nests').then((res) => {
    nests.value = res.data
    selected_nest_id.value = res.data[0].id
    loaded.value = true
    updateEggs()
  })

  function apply() {
    http
      .patch('/modules/gct/hosts/' + router.params.id, gct.value)
      .catch((err) => {
        alert('无法更新服务器。')
        console.log(err)
      })
  }
</script>
