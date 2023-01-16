<template>
  <div :id="terminal_id"></div>
</template>

<script setup>

import {onBeforeUnmount, onMounted, ref} from 'vue'

import {FitAddon} from "xterm-addon-fit";
import {SearchAddon} from "xterm-addon-search";
import {SearchBarAddon} from "xterm-addon-search-bar";
import {Terminal} from "xterm";
import 'xterm/css/xterm.css'


const fitAddon = new FitAddon()
const searchAddon = new SearchAddon()
const searchBar = new SearchBarAddon({searchAddon})

const terminal_id = 'terminal-' + Math.random().toString(36).substring(2, 9)

const term = ref(null)

const props = defineProps({
  theme: {
    type: Object,
    required: false,
    default: {
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
  },
  stdin: {
    type: Boolean,
    default: false
  },
  cursorStyle: {
    type: String,
    default: 'block'
  },
  allowTransparency: {
    type: Boolean,
    default: true
  },
  fontSize: {
    type: Number,
    default: 12
  },
  rows: {
    type: Number,
    default: 30
  },
  socket: {
    type: WebSocket,
    required: true
  },
})


const terminalProps = {
  disableStdin: !props.stdin,
  cursorStyle: props.cursorStyle,
  allowTransparency: props.allowTransparency,
  fontSize: props.fontSize,
  rows: props.rows,
  theme: props.theme,
}


defineExpose({
  writeln: (data) => {
    term_func(() => {
      term.value.writeln(data)
    })
  },
})

const term_func = (then) => {
  if (!term.value) {
    return;
  }

  then()
}

onMounted(() => {
  term.value = new Terminal({...terminalProps})
  term.value.open(document.getElementById(terminal_id))
  term.value.loadAddon(fitAddon)
  term.value.loadAddon(searchAddon)
  term.value.loadAddon(searchBar)
  fitAddon.fit()

  window.addEventListener('resize', () => {
    fitAddon.fit()
  })
})

onBeforeUnmount(() => {
  // term.value.dispose()
  term.value.clear()
  // socket.close()

  window.removeEventListener('resize', () => {
    fitAddon.fit()
  })
})


</script>

<style scoped>

</style>