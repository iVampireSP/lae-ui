<template>
  <div>
    <n-h1 prefix="bar">
      <n-text type="primary">
        配置文件
      </n-text>
    </n-h1>

    <n-select v-model:value="selectedServer" :options="servers" @update:value="genConfig"/>


    <div v-show="all_config" class="mt-5 overflow-auto" style="position: relative">

      <div style="position: fixed;right:4%;top:26%">
        <n-button type="primary" @click="copy(all_config)">复制</n-button>
      </div>

      <n-code
          :code="all_config"
          :show-line-numbers="show_line_numbers"
          language="ini"
          trim
      />
    </div>


  </div>

</template>

<script setup>
import {NButton, NCode, NH1, NSelect, NText} from 'naive-ui'
import http from '../../../plugins/http'
import {ref} from "vue";
import {message} from "../../../utils/layout.js";

const servers = ref([])
const selectedServer = ref(null)
const tunnels = ref([])

function copy(content) {
  navigator.clipboard.writeText(content);
  message.success("复制成功");
}

http.get('/modules/frp/servers').then((res) => {
  servers.value = res.data.map(server => {
    return {
      label: server.name,
      value: server.id
    }
  })
})

const all_config = ref('')
const show_line_numbers = ref(false)

function genConfig() {
  http
      .get(
          '/modules/frp/hosts?with_config=1&&server_id=' + selectedServer.value
      )
      .then((res) => {
        if (res.data.length > 0) {
          show_line_numbers.value = true
          tunnels.value = res.data
          all_config.value = res.data[0].config.server + '\n\n'
          res.data.forEach((tunnel) => {
            all_config.value += `
# ${tunnel.name} 在 ${tunnel.server.name} 上
# 请在截图时打码下一行信息。
${tunnel.config.client}
`
          })
        } else {
          all_config.value = '这个服务器下没有隧道。'
          show_line_numbers.value = false
        }
      })
}


</script>
