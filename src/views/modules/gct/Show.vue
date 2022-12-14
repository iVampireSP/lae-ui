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

    <div class="mt-3" v-show="gct.server">
      <!-- btn group -->
      <div class="btn-group" role="group" aria-label="控制面板和电源管理">
        <a
          v-if="gct.server"
          type="button"
          class="btn btn-outline-primary"
          target="_blank"
          :href="'https://panel.muhanyun.cn/server/' + gct.server.identifier"
          >前往控制面板</a
        >

        <button
          type="button"
          class="btn btn-outline-primary"
          @click="setState('start')"
        >
          开机
        </button>
        <button
          type="button"
          class="btn btn-outline-primary"
          @click="setState('restart')"
        >
          重启
        </button>
        <button
          type="button"
          class="btn btn-outline-warning"
          @click="setState('stop')"
        >
          停止
        </button>
      </div>
    </div>

    <div style="height: 100%; background: #002833" class="mt-3">
      <div id="terminal" style="height: 90%"></div>
      <input
        class="command"
        type="text"
        v-model="command"
        placeholder="在这里输入命令..."
        style="height: 20px"
        @keyup.enter="sendCommand"
      />
    </div>

    <!-- <h4 class="mt-5">统计图表</h4> -->

    <div>
      <div id="chart-cpu"></div>
    </div>

    <div v-show="gct.server">
      <h4 class="mt-5">服务器参数</h4>

      <p>
        连接信息:&nbsp;
        <span
          class="cursor-pointer"
          data-bs-toggle="tooltip"
          data-bs-placement="right"
          title="点击来复制"
          @click="copy(gct.ip + ':' + gct.port)"
        >
          {{ gct.ip }}:{{ gct.port }}
        </span>
      </p>
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
                min="1024"
                max="16384"
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
  import { ref, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import { SearchAddon } from 'xterm-addon-search'
  import { SearchBarAddon } from 'xterm-addon-search-bar'
  import http from '../../../api/http'

  import 'xterm/css/xterm.css'

  const fitAddon = new FitAddon()
  const searchAddon = new SearchAddon()
  const searchBar = new SearchBarAddon({ searchAddon })

  let terminal = ''
  const router = useRoute()
  const loaded = ref(false)

  const gct = ref({
    name: '',
    cpu_limit: 0,
    memory: 0,
    disk: 0,
    backups: 0,
    allocations: 0,
    databases: 0,
    egg_id: 0,
  })

  const command = ref('')

  http.get('/modules/gct/hosts/' + router.params.id).then((res) => {
    gct.value = res.data
  })

  const gct_ws = ref({
    data: {
      socket: '',
      token: '',
    },
  })

  http
    .get('/modules/gct/hosts/' + router.params.id + '/server/websocket')
    .then((res) => {
      // pterodactyl wings login
      gct_ws.value = res.data

      initSocket()
    })

  let socket
  const initSocket = () => {
    socket = new WebSocket(gct_ws.value.data.socket)
    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          event: 'auth',
          args: [gct_ws.value.data.token],
        })
      )
      setTimeout(() => {
        initTerm(socket)
      })
    }
  }

  const theme = {
    background: '#000000',
    cursor: 'transparent',
    black: '#000000',
    red: '#E54B4B',
    green: '#9ECE58',
    yellow: '#FAED70',
    blue: '#396FE2',
    magenta: '#BB80B3',
    cyan: '#2DDAFD',
    white: '#d0d0d0',
    brightBlack: 'rgba(255, 255, 255, 0.2)',
    brightRed: '#FF5370',
    brightGreen: '#C3E88D',
    brightYellow: '#FFCB6B',
    brightBlue: '#82AAFF',
    brightMagenta: '#C792EA',
    brightCyan: '#89DDFF',
    brightWhite: '#ffffff',
    selection: '#FAF089',
  }

  const terminalProps = {
    disableStdin: true,
    cursorStyle: 'underline',
    allowTransparency: true,
    fontSize: 12,
    rows: 30,
    theme: theme,
  }

  const TERMINAL_PRELUDE = '\u001b[1m\u001b[33m莱云 ~ \u001b[0m'

  const handleConsoleOutput = (line, prelude = false) =>
    terminal.writeln(
      (prelude ? TERMINAL_PRELUDE : '') +
        line.replace(/(?:\r\n|\r|\n)$/im, '') +
        '\u001b[0m'
    )

  const handleTransferStatus = (status) => {
    switch (status) {
      // Sent by either the source or target node if a failure occurs.
      case 'failure':
        terminal.writeln(TERMINAL_PRELUDE + '迁移服务器失败。 \u001b[0m')
        return

      // Sent by the source node whenever the server was archived successfully.
      case 'archive':
        terminal.writeln(
          TERMINAL_PRELUDE +
            '服务器已经打包完成，正在发往下一个节点。 \u001b[0m'
        )
    }
  }

  const handleDaemonErrorOutput = (line) =>
    terminal.writeln(
      TERMINAL_PRELUDE +
        '\u001b[1m\u001b[41m' +
        line.replace(/(?:\r\n|\r|\n)$/im, '') +
        '\u001b[0m'
    )

  const handlePowerChangeEvent = (state) =>
    terminal.writeln(
      TERMINAL_PRELUDE + '服务器标记为: ' + state + '...\u001b[0m'
    )

  function copy(text) {
    navigator.clipboard.writeText(text);
  }

  function initTerm(socket) {
    terminal = new Terminal({ ...terminalProps })

    var i = 0
    while (!document.getElementById('terminal')) {
      i++
      if (i > 1000) {
        break
      }

      continue
    }

    terminal.open(document.getElementById('terminal'))

    terminal.loadAddon(fitAddon)
    terminal.loadAddon(searchAddon)
    terminal.loadAddon(searchBar)

    fitAddon.fit()

    // when window resize
    window.addEventListener('resize', () => {
      fitAddon.fit()
    })

    // send
    socket.send(
      JSON.stringify({
        event: 'send logs',
        args: [null],
      })
    )

    socket.send(
      JSON.stringify({
        event: 'send stats',
        args: [null],
      })
    )

    socket.onmessage = (ev) => {
      const data = ev.data
      const msg = JSON.parse(data)

      // convert to switch
      switch (msg.event) {
        case 'console output':
        case 'install output':
        case 'transfer logs':
        case 'daemon message':
          msg.args.forEach((line) => {
            handleConsoleOutput(line)
          })
          break
        case 'status':
          msg.args.forEach((line) => {
            handlePowerChangeEvent(line)
          })
          break

        case 'transfer status':
          msg.args.forEach((line) => {
            handleTransferStatus(line)
          })
          break
        case 'daemon error':
          msg.args.forEach((line) => {
            handleDaemonErrorOutput(line)
          })
          break
      }
    }
  }

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

  function sendCommand() {
    socket.send(
      JSON.stringify({
        event: 'send command',
        args: [command.value],
      })
    )
    command.value = ''
  }

  function setState(status) {
    socket.send(JSON.stringify({ event: 'set state', args: [status] }))
  }

  //   before unmount
  onBeforeUnmount(() => {
    socket.close()

    // remove event listener
    window.removeEventListener('resize', () => {
      fitAddon.fit()
    })

    // clear terminal
    terminal.clear()
  })

  //
</script>

<style>
  .command {
    background: transparent;
    width: 100%;
    border: none;
    outline: none;
    color: white;
    font-size: 12px;
    padding-left: 5px;
    height: 20px;
  }
</style>
