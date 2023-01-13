<template>
  <div style="background: rgb(16, 16, 20); height: 60vh">
    <div id="terminal" style="height: 90%"></div>
    <div style="text-align: center;">
      <input
          class="command"
          type="text"
          v-model="command"
          placeholder="在这里输入命令..."
          style="height: 20px"
          @keyup.enter="sendCommand"
      />
    </div>
  </div>
</template>

<script setup>
import {onBeforeUnmount, ref} from 'vue'

import http from '../../../plugins/http'
import {useRoute} from "vue-router";
import {Terminal} from "xterm";
import {FitAddon} from 'xterm-addon-fit'
import {SearchAddon} from 'xterm-addon-search'
import {SearchBarAddon} from 'xterm-addon-search-bar'
import 'xterm/css/xterm.css'

const router = useRoute()

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

const fitAddon = new FitAddon()
const searchAddon = new SearchAddon()
const searchBar = new SearchBarAddon({searchAddon})

let terminal

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

function initTerm(socket) {
  terminal = new Terminal({...terminalProps})
  let i = 0;
  while (!document.getElementById('terminal')) {
    i++
    if (i > 1000) {
      break
    }

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
    if (nest.id === selected_nest_id.value) {
      nest_info.value = nest
      eggs.value = nest.eggs
      gct.value.egg_id = nest.eggs[0].egg_id
      updateThisEgg()
    }
  })
}

function updateThisEgg() {
  eggs.value.forEach((egg) => {
    if (egg.egg_id === gct.value.egg_id) {
      // console.log(egg)
      egg_info.value = egg
    }
  })
}

http.get('/modules/gct/nests').then((res) => {
  nests.value = res.data
  selected_nest_id.value = res.data[0].id
  // loaded.value = true
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
  socket.send(JSON.stringify({event: 'set state', args: [status]}))
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

</script>

<style scoped>
.command {
  width: 99%;
  background-color: #000000;
  color: #ffffff;
  border-style: none;
  outline: none;
}
</style>
