<template>
  <div>
    <p>首先，请在这里给您的服务器起一个名字。</p>
    <h3>
      <input class="editable" v-model="gct.name" placeholder="请输入名称" />
    </h3>

    <h4 class="mt-5">之后，您想将服务器创建在哪里？</h4>
    <select
      class="form-select form-select-sm"
      v-model="gct.location_id"
      @change="updateLocation()"
    >
      <option v-for="location in locations" :value="location.id">
        {{ location.name }} - (服务器数量: {{ location.servers }})
      </option>
    </select>
    <p>此节点基础价格 <span v-text="selectedLocation.price * 100"></span> 元</p>

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
      <span v-text="(gct.cpu_limit / 100) * selectedLocation.cpu_price"></span>
      元
    </div>

    <div class="mt-3">
      <h4 class="mt-5">您想要多大内存？</h4>
      <input
        type="range"
        class="form-range"
        min="1024"
        max="10240"
        step="512"
        v-model="gct.memory"
      />
      将使用 <span v-text="gct.memory / 1024"></span> GB 内存。价格为
      <span v-text="(gct.memory / 1024) * selectedLocation.memory_price"></span>
      元
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
      将使用 <span v-text="gct.disk / 1024"></span> GB 磁盘。价格为
      <span v-text="(gct.disk / 1024) * selectedLocation.disk_price"></span> 元
    </div>

    <div class="mt-3">
      <h4 class="mt-5">需要备份吗？</h4>
      <input
        type="range"
        class="form-range"
        min="1"
        max="20"
        v-model="gct.backups"
      />
      将可以创建 <span v-text="gct.backups"></span> 个备份。价格为
      <span v-text="gct.backups * selectedLocation.backup_price"></span> 元
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
      将分配 <span v-text="gct.allocations"></span> 个端口。价格为
      <span v-text="gct.allocations * selectedLocation.allocation_price"></span>
      元
    </div>

    <div class="mt-3">
      <h4 class="mt-5">您需要数据库吗？</h4>

      <div class="form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value="1"
          id="c-databases"
          v-model="gct.databases"
        />
        <label class="form-check-label" for="c-databases">
          是的，我用的到数据库，我想要一个。<span
            >(需要
            <span v-text="selectedLocation.database_price"></span> 元)</span
          >
        </label>
      </div>
    </div>

    <div class="mt-4">
      <h4>您想要开什么服务器？</h4>

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

    <div class="mt-3">
      <button
        :disabled="creating"
        class="btn btn-outline-primary"
        @click="createServer()"
      >
        创建服务器
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  //   import { useRoute } from 'vue-router'

  import http from '../../../api/http'
  import route from '../../../plugins/router'

  //   const router = useRoute()

  const gct = ref({
    name: '',
    cpu_limit: 100,
    memory: 1024,
    disk: 1024,
    databases: false,
    allocations: 1,
    backups: 1,
  })

//   const totalPrice = ref({
//     cpu: 0,
//     memory: 0,
//     disk: 0,
//     backups: 0,
//     allocations: 0,
//     databases: 0,
//     total: 0,
//   })

  const locations = ref({})
  const nests = ref({})
  const eggs = ref({})

  const selected_nest_id = ref(0)
  const egg_info = ref({})
  const nest_info = ref({})

  const selectedLocation = ref({})

  //   when gcp updated
  //   watch(gct.value, (val) => {
  //     console.log(val)
  //   })

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

  const creating = ref(false)

  function createServer() {
    let create_data = gct.value

    if (create_data.name == '') {
      alert('请输入服务器名称')
      return
    }

    if (gct.value.databases) {
      create_data.databases = 1
    } else {
      create_data.databases = 0
    }

    creating.value = true

    http.post('/modules/gct/hosts', create_data).then((res) => {
      route.push({ name: 'tasks' })
    })
  }

  function updateLocation() {
    locations.value.forEach((location) => {
      if (location.id == gct.value.location_id) {
        selectedLocation.value = location
      }
    })
  }

  //   function change() {
  //     http.patch('/modules/gct/hosts/' + router.params.id, {
  //       name: gct.value.name,
  //     })
  //   }

  function randomString(len) {
    len = len || 32
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
    var maxPos = $chars.length
    var str = ''
    for (var i = 0; i < len; i++) {
      str += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
  }

  gct.value.name = randomString(8)
</script>
