<template>
  <IndexLayout>
    <div class="text-center mt-10">
      <n-h1>{{ time }}</n-h1>
      <n-input-group @keyup.enter="search()">
        <n-select v-model:value="search_engine" :options="options" style="width: 10rem !important"/>
        <n-input v-model:value="search_content" class="text-left" clearable placeholder="搜索" type="text"/>
        <n-button secondary strong type="info" @click="search()">
          <n-icon>
            <Search/>
          </n-icon>
          &nbsp;搜索
        </n-button>
      </n-input-group>
      <n-divider class="mt-5 mb-3" dashed>
        「一言」
      </n-divider>
      <n-spin :show="show">
        <n-h4>{{ hitokoto.hitokoto }}</n-h4>
        <n-h5 class="!mt-3">{{ hitokoto.from_who }}的《{{ hitokoto.from }}》</n-h5>
        <n-button secondary strong type="info" @click="get_hitokoto()">
          <n-icon>
            <Refresh/>
          </n-icon>
          &nbsp;换一换
        </n-button>
      </n-spin>
    </div>
  </IndexLayout>
</template>

<script setup>
import IndexLayout from "../components/menus/IndexLayout.vue";
import {NButton, NDivider, NH1, NH4, NH5, NIcon, NInput, NInputGroup, NSelect, NSpin} from "naive-ui";
import {Refresh, Search} from "@vicons/ionicons5";
import {computed, ref} from "vue";
import axios from "axios";

const hitokoto = ref({})
const date = new Date()
const search_engine = ref("baidu")
const search_content = ref("")
const show = ref(false)
const options = [
  {
    label: '百度',
    value: 'baidu'
  },
  {
    label: 'Google',
    value: 'google'
  },
  {
    label: '必应',
    value: 'bing'
  },
  {
    label: 'Magi',
    value: 'magi'
  },
  {
    label: 'F搜',
    value: 'fsearch'
  },
  {
    label: 'DuckDuckGo',
    value: 'duckduckgo'
  }
]

const time = computed(() => {
  let returnValue = ""
  if (date.getHours() < 10) {
    returnValue += "0" + date.getHours()
  } else {
    returnValue += date.getHours()
  }
  returnValue += ":"
  if (date.getMinutes() < 10) {
    returnValue += "0" + date.getMinutes()
  } else {
    returnValue += date.getMinutes()
  }
  return returnValue
})


function search() {
  switch (search_engine.value) {
    case "baidu":
      window.open("https://www.baidu.com/s?wd=" + search_content.value)
      break
    case "google":
      window.open("https://www.google.com/search?q=" + search_content.value)
      break
    case "bing":
      window.open("https://cn.bing.com/search?q=" + search_content.value)
      break
    case "magi":
      window.open("https://magi.com/search?q=" + search_content.value)
      break
    case "fsearch":
      window.open("https://fsoufsou.com/search?q=" + search_content.value)
      break
    case "duckduckgo":
      window.open("https://duckduckgo.com/?q=" + search_content.value)
      break
  }
  search_content.value = ""
}

function get_hitokoto() {
  show.value = true
  setTimeout(() => {
    show.value = false
    axios.get("https://v1.hitokoto.cn/?encode=json&c=i").then(res => {
      hitokoto.value = res.data
    })
  }, 1000)
}

get_hitokoto()
</script>

<style scoped>
</style>