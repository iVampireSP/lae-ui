<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        配置文件
      </n-text>
    </n-h1>

    <n-select v-model:value="selectedServer" :options="servers" placeholder="选择服务器" @update:value="genConfig"/>


    <div v-show="fake_config" class="mt-5 overflow-auto" style="position: relative">

      <div style="position: fixed;right:4%;top:26%">
        <n-button type="primary" @click="copy(real_config)">复制</n-button>
      </div>

      <n-code
          :code="fake_config"
          :show-line-numbers="show_line_numbers"
          class="select-none"
          language="ini"
          trim
          @click="copy(real_config)"

      />
    </div>


  </div>

  <n-watermark
      v-if="true"
      :font-size="16"
      :height="384"
      :line-height="16"
      :rotate="-15"
      :width="384"
      :x-offset="12"
      :y-offset="60"
      content="请不要泄露隧道名和 Token"
      cross
      fullscreen
  />

</template>

<script setup>
import {NButton, NCode, NH1, NSelect, NText, NWatermark} from 'naive-ui'
import {ref} from "vue";
import {message} from "../../../utils/layout.js";
import gateway from "../../../plugins/gateway.js";

const servers = ref([])
const selectedServer = ref()
const tunnels = ref([])

function copy(content) {
  navigator.clipboard.writeText(content);
  message.success("复制成功");
}

// http.get('/modules/frp/servers').then((res) => {
//   servers.value = res.data.map(server => {
//     return {
//       label: server.name,
//       value: server.id
//     }
//   })
// })

gateway.get('frp/servers').then(res => {
  servers.value = res.data.map(server => {
    return {
      label: server.name,
      value: server.id
    }
  })
})

const real_config = ref('')
const fake_config = ref('')
const show_line_numbers = ref(false)

function genConfig() {

  gateway.get('frp/hosts', {
    params: {
      with_config: 1,
      server_id: selectedServer.value
    }
  }).then(res => {
    if (res.data.length > 0) {
      show_line_numbers.value = true
      tunnels.value = res.data
      // console.log(res.data)
      real_config.value = res.data[0].config.server
      fake_config.value = res.data[0].config.server
      res.data.forEach(({config, name, server}) => {
        config.client.split('\n').forEach((line) => {
          real_config.value += '\n' + line
          if (line.startsWith('[') && line.endsWith(']')) {
            fake_config.value += `\n\n# 隧道 "${name}" 在 "${server.name}" 上\n` +
                line.substring(0, line.length - 10).concat('*'.repeat(10), ']')
          } else {
            fake_config.value += '\n' + line
          }
        })

        // console.log(config.client,config.client.split('\n'),config.client.split('\n')[0])
        // 迭代输出字符串每一行
        // for(const line in config.client.split('\n')){
        //   console.log(line)
        // }
        // real_config.value += `\n\n\n# 隧道 "${name}" 在 "${server.name}" 上\n# 请在截图时打码下一行信息。\n${config.client}`
      })
    } else {
      fake_config.value = '这个服务器下没有隧道。'
      show_line_numbers.value = false
    }
  })
}

//   http.get(
//       '/modules/frp/hosts?with_config=1&&server_id=' + selectedServer.value
//   )
//       .then((res) => {
//
//       })
// }

// 防止复制配置文件（

//  可以是css用
// onMounted(() => {
//
//   document.oncopy = function () {
//     return false;
//   };
// })
//
// onUnmounted(() => {
//   document.oncopy = null;
// })

</script>
