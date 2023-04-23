<template>
    <div v-if="is_ready">
        <TerminalComponent ref="terminal" :socket="socket" cursor-style="underline" height="90px"/>

        <div>
            <input
                    v-model="command"
                    class="command w-full"
                    placeholder="在这里输入命令..."
                    style="height: 20px"
                    type="text"
                    @keyup.enter="sendCommand"
            />
        </div>

    </div>


</template>

<script setup>
import {onBeforeUnmount, ref} from 'vue'

import TerminalComponent from '../../../../components/Terminal.vue'
import gateway from "../../../../plugins/gateway.js";

const props = defineProps({
    gct_id: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    }
})

const gct_ws = ref({
    data: {
        socket: '',
        token: '',
    },
})

const state = ref({
    current: 'offline'
})

let terminal = ref({
    writeln(...text) {
        console.log(...text)
    }
})

const is_ready = ref(false)

let socket

const command = ref('')

const TERMINAL_PRELUDE = '\u001b[1m\u001b[33m莱云 ~ \u001b[0m'
const handleConsoleOutput = (line, prelude = false) =>
    terminal.value.writeln(
        (prelude ? TERMINAL_PRELUDE : '') +
        line.replace(/(?:\r\n|\r|\n)$/im, '') +
        '\u001b[0m'
    )
const handleTransferStatus = (status) => {
    switch (status) {
        // Sent by either the source or target node if a failure occurs.
        case 'failure':
            terminal.value.writeln(TERMINAL_PRELUDE + '迁移服务器失败。 \u001b[0m')
            return
        // Sent by the source node whenever the server was archived successfully.
        case 'archive':
            terminal.value.writeln(
                TERMINAL_PRELUDE +
                '服务器已经打包完成，正在发往下一个节点。 \u001b[0m'
            )
    }
}
const handleDaemonErrorOutput = (line) =>
    terminal.value.writeln(
        TERMINAL_PRELUDE +
        '\u001b[1m\u001b[41m' +
        line.replace(/(?:\r\n|\r|\n)$/im, '') +
        '\u001b[0m'
    )
const handlePowerChangeEvent = ($state) => {
    state.value.current = $state

    terminal.value.writeln(
        TERMINAL_PRELUDE + '服务器标记为: ' + $state + '...\u001b[0m'
    )
}


// http
//     .get('/modules/gct/hosts/' + props.gct_id + '/server/websocket')
//     .then((res) => {
//       // pterodactyl wings login
//       gct_ws.value = res.data
//
//       socket = new WebSocket(gct_ws.value.data.socket)
//       socket.onopen = () => {
//
//         is_ready.value = true
//         init(socket)
//
//
//         // terminal.value.writeln(TERMINAL_PRELUDE + '连接成功。 \u001b[0m')
//       }
//
//     })


gateway.get('gct/hosts/' + props.gct_id + '/server/websocket').then(res => {
    gct_ws.value = res.data

    socket = new WebSocket(gct_ws.value.data.socket)
    socket.onopen = () => {

        is_ready.value = true
        init(socket)
    }
})

const stats = ref({
    cpu_absolute: 0,
    disk_bytes: 0,
    memory_bytes: 0,
    memory_limit_bytes: 0,
    network: {
        rx_bytes: 0,
        tx_bytes: 0
    },
    state: 'running',
    uptime: 2957575458
})

const init = (socket) => {

    socket.send(
        JSON.stringify({
            event: 'auth',
            args: [gct_ws.value.data.token],
        })
    )
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
            case 'stats':
                stats.value = JSON.parse(msg.args[0] || '{}')
                break
        }

    }
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
})

defineExpose({
    setState,
    sendCommand,
    state,
    stats
})

</script>

<style scoped>
.command {
    background-color: #000000;
    color: #ffffff;
    border-style: none;
    outline: none;
    position: relative;
    top: -2px
}
</style>
