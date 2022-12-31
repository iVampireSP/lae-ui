<template>
  <div class="mb-3" role="group">
    <button
      v-show="step !== 1 && mc.platform == ''"
      class="btn btn-primary mt-3"
      @click="prev"
    >
      上一个
    </button>
    <button
      v-show="mc.platform !== ''"
      class="btn btn-primary mt-3"
      @click="reset_mc"
    >
      重选
    </button>
  </div>

  <div v-if="step === 1">
    <h3>我们可以引导您选择合适的服务端</h3>

    <p>在这之前，你需要告诉我们的你的服务器的名字。</p>
  </div>

  <div v-show="step === 1">
    <h3>
      我的服务器名字是:<input
        class="editable"
        v-model="gct.name"
        placeholder="大胆的点击这里，告诉我们你的服务器叫什么名字。"
      />
    </h3>
    <small class="text-muted">没关系，这个之后可以改。</small>

    <button class="btn btn-primary mt-3 d-block" @click="next">就这样了</button>
  </div>

  <div v-show="step === 2">
    <h4>
      <span>{{ gct.name }}</span
      >，真是个好名字！
    </h4>
    <h4 class="mt-5">接下来，你想把你的服务器放在哪里？</h4>
    <select
      class="form-select form-select-sm"
      v-model="gct.location_id"
      @change="updateLocation()"
    >
      <option v-for="location in locations" :value="location.id">
        {{ location.name }} - (服务器数量: {{ location.servers }})
      </option>
    </select>
    <small class="text-muted"
      >别着急，如果你不知道怎么选，保持默认就好啦。</small
    >

    <button class="btn btn-primary mt-3 d-block" @click="next">
      我觉得这个节点不错
    </button>
  </div>

  <div v-show="step === 3">
    <h5>眼光真好！你知道吗？你刚刚选择的节点</h5>

    <pre
      class="mt-3"
      v-if="selectedLocation.description"
      v-text="selectedLocation.description"
    ></pre>

    <button class="btn btn-secondary mt-3 d-block" @click="prev">
      让我再去选下其他节点
    </button>

    <button class="btn btn-primary mt-3 d-block" @click="next">我很满意</button>
  </div>

  <div v-show="step === 4">
    <h5>你想要玩什么类型的游戏？</h5>

    <select
      class="form-select form-select-sm mt-3"
      v-model="selected_nest_id"
      @change="updateEggs()"
    >
      <option v-for="nest in nests" :value="nest.id">
        {{ nest.name }}
      </option>
    </select>
    <pre class="mt-2" v-text="nest_info.description"></pre>

    <button class="btn btn-primary mt-3 d-block" @click="next">好</button>
  </div>

  <div v-show="step === 5">
    <div v-if="selected_nest_id === 1">
      <div v-if="!mc.platform">
        <h5>你可真是找对人了。这方面我们超级懂！</h5>

        <h5>你想要开什么类型的 我的世界 服务器？</h5>

        <a
          class="link mt-3 d-block cursor-pointer"
          @click="mc.platform = 'java'"
        >
          Java, 我更倾向于电脑。
        </a>

        <a
          class="link mt-3 d-block cursor-pointer"
          @click="mc.platform = 'bedrock'"
        >
          基岩版。
        </a>
      </div>
      <div v-else>
        <div v-if="mc.platform === 'java'">
          <h5 class="mb-5">Java 版，你的游戏生活肯定很精彩！</h5>

          <div v-if="mc.prefer_mod == null">
            <p>
              你想玩 Mod 吗？
              <br />
              <a @click="mc.prefer_mod = true" class="cursor-pointer">想</a>
              <br />
              <a @click="mc.prefer_mod = false" class="cursor-pointer">不想</a>
            </p>
          </div>

          <div v-if="mc.prefer_plugins == null" class="mt-3">
            <p>
              你还想要加插件吗？

              <br />
              <a @click="mc.prefer_plugins = true" class="cursor-pointer">想</a>
              <br />
              <a @click="mc.prefer_plugins = false" class="cursor-pointer"
                >不想</a
              >
            </p>
          </div>

          <div v-if="mc.prefer_plugins && mc.prefer_mod">
            <p>既然即想要 Mod 和 插件。这本是一个鱼和熊掌不可兼得的行为。</p>

            <p>但是，有两个版本可以办到！它们是 1.12.2 和 1.16.5。</p>

            <p>你想要什么版本？</p>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(23)"
              >1.12.2
            </a>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(35)"
              >1.16.5
            </a>

            <div v-if="mc.selected" class="mt-3">
              <p>
                Mod 和
                插件的组合，无疑丰富了多人联机时的趣味和可管理性。但是于此同时，它可能需要更高的配置。
              </p>
              <button class="btn btn-primary mt-3 d-block" @click="next">
                好，带我去选择配置
              </button>
            </div>
          </div>

          <div v-if="mc.prefer_plugins === false && mc.prefer_mod === true">
            <h5>大胆的决定！</h5>
            <p>你只想玩 Mod, 那么给你的选项很多。</p>

            <p>你想要什么版本？</p>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(23)"
              >1.12.2
            </a>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(24)"
              >1.16.5
            </a>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(5)"
              >Forge 更新到什么版本，我就要什么版本
            </a>

            <div v-if="mc.selected" class="mt-3">
              <p>
                Mod 带来的乐趣是无限的，但是与此同时，它对配置的要求也会增高。
              </p>
              <button class="btn btn-primary mt-3 d-block" @click="next">
                我知道了，让我们来选择配置吧。
              </button>
            </div>
          </div>

          <div v-if="!mc.prefer_mod && mc.prefer_plugins">
            <h5>理智的选择</h5>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(4)"
              >我觉得插件服更适合我。
            </a>

            <div v-if="mc.selected" class="mt-3">
              <p>嗯，我想也是。</p>
              <button class="btn btn-primary mt-3 d-block" @click="next">
                嗯，让我们去选择配置。
              </button>
            </div>
          </div>

          <div v-if="mc.prefer_mod === false && mc.prefer_plugins === false">
            <h5>嗯...看来你只想和小伙伴们一起联机。</h5>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(3)"
              >对，我只想和小伙伴们一起联机，并且体验最新版本。
            </a>

            <div v-if="mc.selected" class="mt-3">
              <p>看来你是一位追求高版本玩法的人，真的很棒！</p>
              <button class="btn btn-primary mt-3 d-block" @click="next">
                嗯，让我们去选择配置。
              </button>
            </div>
          </div>
        </div>
        <div v-if="mc.platform === 'bedrock'">
          <h5 class="mb-4">基岩版，很棒的决定！</h5>

          <div v-if="mc.prefer_plugins == null" class="mt-3">
            <p>
              你想要加插件吗？

              <br />
              <a @click="mc.prefer_plugins = true" class="cursor-pointer">想</a>
              <br />
              <a @click="mc.prefer_plugins = false" class="cursor-pointer"
                >不想</a
              >
            </p>
          </div>

          <div v-if="mc.prefer_plugins === true">
            <h5>嗯，插件可以提升服务器的可玩性以可管理性。</h5>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(31)"
              >对，这样我的服务器会变得更好玩。
            </a>
          </div>

          <div v-if="mc.prefer_plugins === false">
            <h5>看来你想要纯净的体验</h5>

            <a class="link mt-3 d-block cursor-pointer" @click="selectEgg(19)"
              >是的，我正是这么想。
            </a>
          </div>

          <div v-if="mc.selected" class="mt-3">
            <p>无论你的哪个选择，我们都会给你推荐最合适的。</p>
            <button class="btn btn-primary mt-3 d-block" @click="next">
              好，让我们来选择配置吧。
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h5>你想要什么样的服务器？</h5>

      <select
        class="form-select form-select-sm"
        v-model="gct.egg_id"
        @change="updateThisEgg()"
      >
        <option v-for="egg in eggs" :value="egg.egg_id">
          {{ egg.name }}
        </option>
      </select>
      <pre class="mt-2" v-text="egg_info.description"></pre>

      <button class="btn btn-primary mt-3 d-block" @click="next">好</button>
    </div>
  </div>

  <div v-show="step === 6">
    <div v-if="selected_nest_id !== 1">
      <h3>愉快的选取服务器配置</h3>

      <div class="mt-3">
        <h4 class="mt-5">您想要多少个 CPU 核心？</h4>
        <input
          type="range"
          class="form-range"
          min="100"
          max="800"
          step="100"
          v-model="gct.cpu_limit"
        />
        将使用 <span v-text="gct.cpu_limit / 100"></span> 个核心。价格为
        <span
          v-text="
            ((gct.cpu_limit / 100) * selectedLocation.cpu_price).toFixed(2)
          "
        ></span>
        元
      </div>

      <div class="mt-3">
        <h4 class="mt-5">您想要多大内存？</h4>
        <input
          type="range"
          class="form-range"
          min="1024"
          max="16384"
          step="1024"
          v-model="gct.memory"
        />
        将使用 <span v-text="gct.memory / 1024"></span> GB 内存。价格为
        <span
          v-text="
            ((gct.memory / 1024) * selectedLocation.memory_price).toFixed(2)
          "
        ></span>
        元
      </div>

      <div class="mt-3">
        <h4 class="mt-5">您需要多大的存储？</h4>
        <input
          type="range"
          class="form-range"
          min="512"
          max="40960"
          step="512"
          v-model="gct.disk"
        />
        将使用 <span v-text="gct.disk / 1024"></span> GB 存储。价格为
        <span
          v-text="((gct.disk / 1024) * selectedLocation.disk_price).toFixed(2)"
        ></span>
        元
      </div>

      <p class="mt-3">
        我们的默认配置适用于大部分情况，如果您的服务器需求实在是庞大，您可以根据需求拉高配置。或者联系我们寻求帮助。
      </p>

      <p>
        您在
        <router-link class="link" :to="{ name: 'work-orders.create' }"
          >发送工单</router-link
        >
        时，模块选择”游戏容器“，就可以和我们取得联系了。<router-link
          class="link"
          :to="{ name: 'work-orders.create' }"
          >发送工单</router-link
        >
      </p>

      <button class="btn btn-primary mt-3 d-block" @click="next">
        我看可以了
      </button>
      <p>不用担心，以后可以随时调整。</p>
    </div>

    <div v-else>
      <h3>这个服务器规模多大？</h3>

      <div v-if="mc.platform === 'bedrock'">
        <hr />
        <a class="cursor-pointer d-block" @click="setGct(200, 2048, 8192)"
          >小规模的，我只想和朋友们联机。</a
        >
        <a class="cursor-pointer d-block" @click="setGct(400, 4096, 8192)"
          >小规模的，我想开一个生存服务器，让大家一起玩。</a
        >

        <a class="cursor-pointer d-block" @click="setGct(400, 8192, 10240)"
          >不是很小，我想要带 10 人。</a
        >

        <a class="cursor-pointer d-block" @click="setGct(800, 8192, 10240)"
          >我感觉蛮大的，因为我的服务器人数可能要在 15 人左右。</a
        >
        <hr />
      </div>
      <div v-else>
        <a class="cursor-pointer d-block" @click="setGct(200, 4096, 10240)"
          >小规模的，我只想和朋友们联机。</a
        >

        <a class="cursor-pointer d-block" @click="setGct(400, 4096, 10240)"
          >小规模的，我想开一个生存服务器，让大家一起玩。</a
        >

        <a class="cursor-pointer d-block" @click="setGct(800, 8192, 10240)"
          >不是很小，我想要带 10 人。</a
        >

        <a class="cursor-pointer d-block" @click="setGct(800, 16384, 15360)"
          >我感觉蛮大的，因为我的服务器人数可能要在 15 人左右。</a
        >
      </div>

      <div v-if="mc.setted === true">
        <button class="btn btn-primary mt-3 d-block" @click="next">
          我看可以了
        </button>
        <p>不用担心，以后可以随时调整。</p>
      </div>
    </div>
  </div>

  <div v-show="step === 7">
    <h3>再检查一下</h3>

    <p>让我们看看，你的服务器名字是 {{ gct.name }}。这样对吗？</p>

    <p>如果不对，请在下面修改名称。</p>
    <hr />
    <h4>
      <input
        class="editable"
        v-model="gct.name"
        placeholder="大胆的点击这里，告诉我们你的服务器叫什么名字。"
      />
    </h4>
    <hr />

    <p>放轻松，以后想改就改。</p>

    <button class="btn btn-primary mt-3 d-block" @click="next">好</button>
  </div>

  <div v-if="step === 8">
    <h3>让我们给你算一下价格。</h3>

    <table>
      <tr>
        <th>项目</th>
        <th>价格</th>
      </tr>
      <tr>
        <td>节点&nbsp;</td>
        <td><span v-text="selectedLocation.price.toFixed(2)"></span> 元</td>
      </tr>
      <tr>
        <td>核心</td>
        <td>
          <span
            v-text="
              ((gct.cpu_limit / 100) * selectedLocation.cpu_price).toFixed(2)
            "
          ></span>
          元
        </td>
      </tr>
      <tr>
        <td>内存</td>
        <td>
          <span
            v-text="
              ((gct.memory / 1024) * selectedLocation.memory_price).toFixed(2)
            "
          ></span>
          元
        </td>
      </tr>
      <tr>
        <td>存储</td>
        <td>
          <span
            v-text="
              ((gct.disk / 1024) * selectedLocation.disk_price).toFixed(2)
            "
          ></span>
          元
        </td>
      </tr>

      <tr>
        <td>*合计</td>
        <td>
          大约 <span
            v-text="
              (
                (gct.disk / 1024) * selectedLocation.disk_price +
                (gct.memory / 1024) * selectedLocation.memory_price +
                (gct.cpu_limit / 100) * selectedLocation.cpu_price +
                selectedLocation.price
              ).toFixed(2)
            "
          ></span>
          元 / 月
        </td>
      </tr>
    </table>

    <h5 class="mt-4">觉得可以吗？</h5>
    <a class="link d-block cursor-pointer" @click="prev()">不太行，让我返回</a>
    <button class="btn btn-primary mt-3" @click="next">可以</button>
  </div>

  <div v-show="step === 9">
    <h5>最后一步，只要你一声令下，我们就开始创建！</h5>

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

    <p v-show="progress === 100">
      我们稍后带你去
      <router-link class="text-auto" :to="{ name: 'modules.gct' }"
        >游戏容器</router-link
      >
      列表看看。
    </p>

    <button v-if="progress === 0" class="btn btn-primary mt-3" @click="create">
      让我们开始吧
    </button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'
  import route from '../plugins/router'

  const step = ref(1)

  const locations = ref({})
  const nests = ref({})
  const eggs = ref({})

  const selected_nest_id = ref(0)
  const egg_info = ref({})
  const nest_info = ref({})

  const selectedLocation = ref({})

  const showProgress = ref(false)
  const progress = ref(0)

  function create() {
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

  const mc = ref({
    platform: '',
    prefer_mod: null,
    prefer_plugins: null,
    selected: false,
    setted: false,
  })

  function selectEgg(egg_id) {
    gct.value.egg_id = egg_id
    mc.value.selected = true
  }

  function setGct(cpu, memory) {
    gct.value.cpu_limit = cpu
    gct.value.memory = memory

    mc.value.setted = true
  }

  const gct = ref({
    name: '',
    cpu_limit: 400,
    memory: 4096,
    disk: 10240,
    databases: 0,
    allocations: 1,
    backups: 1,
    nest_id: 1,
    egg_id: null,
  })

  function prev() {
    if (step.value > 1) {
      step.value--
    }
  }

  function next() {
    if (step.value === 1) {
      if (gct.value.name === '') {
        gct.value.name = '这个服务器'
      }
    }

    if (step.value < 10) {
      step.value++
    }
  }

  function updateLocation() {
    locations.value.forEach((location) => {
      if (location.id == gct.value.location_id) {
        selectedLocation.value = location
      }
    })
  }

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

  http.get('/modules/gct/locations').then((res) => {
    locations.value = res.data
    gct.value.location_id = res.data[0].id
    selectedLocation.value = res.data[0]
  })

  http.get('/modules/gct/nests').then((res) => {
    nests.value = res.data
    selected_nest_id.value = res.data[0].id
    updateEggs()
  })

  function reset_mc() {
    mc.value = {
      platform: '',
      prefer_mod: null,
      prefer_plugins: null,
    }
  }
</script>

<style scoped>
  pre {
    font-family: unset;
  }
</style>
