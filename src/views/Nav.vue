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
        <n-h5 class="!mt-3">
          <span v-if="hitokoto.from_who">{{ hitokoto.from_who }}的</span>《{{ hitokoto.from }}》
        </n-h5>
        <n-button secondary strong type="info" @click="get_hitokoto()">
          <n-icon>
            <Refresh/>
          </n-icon>
          &nbsp;换一换
        </n-button>
      </n-spin>
      <n-grid :cols="6" class="mt-5" x-gap="12" y-gap="6">
        <n-gi>
          <a href="https://chat.openai.com" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <n-icon size="36">
                <ChatboxEllipsesOutline/>
              </n-icon>
              <n-h2>ChatGPT</n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi>
          <a href="https://www.bilibili.com" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <svg fill="none" height="42" style="margin-left: 3.5rem;" viewBox="0 0 18 18" width="42"
                   xmlns="http://www.w3.org/2000/svg">
                <path clip-rule="evenodd" d="M3.73252 2.67094C3.33229 2.28484 3.33229 1.64373 3.73252 1.25764C4.11291 0.890684 4.71552 0.890684 5.09591 1.25764L7.21723 3.30403C7.27749 3.36218 7.32869 3.4261 7.37081 3.49407H10.5789C10.6211 3.4261 10.6723 3.36218 10.7325 3.30403L12.8538 1.25764C13.2342 0.890684 13.8368 0.890684 14.2172 1.25764C14.6175 1.64373 14.6175 2.28484 14.2172 2.67094L13.364 3.49407H14C16.2091 3.49407 18 5.28493 18 7.49407V12.9996C18 15.2087 16.2091 16.9996 14 16.9996H4C1.79086 16.9996 0 15.2087 0 12.9996V7.49406C0 5.28492 1.79086 3.49407 4 3.49407H4.58579L3.73252 2.67094ZM4 5.42343C2.89543 5.42343 2 6.31886 2 7.42343V13.0702C2 14.1748 2.89543 15.0702 4 15.0702H14C15.1046 15.0702 16 14.1748 16 13.0702V7.42343C16 6.31886 15.1046 5.42343 14 5.42343H4ZM5 9.31747C5 8.76519 5.44772 8.31747 6 8.31747C6.55228 8.31747 7 8.76519 7 9.31747V10.2115C7 10.7638 6.55228 11.2115 6 11.2115C5.44772 11.2115 5 10.7638 5 10.2115V9.31747ZM12 8.31747C11.4477 8.31747 11 8.76519 11 9.31747V10.2115C11 10.7638 11.4477 11.2115 12 11.2115C12.5523 11.2115 13 10.7638 13 10.2115V9.31747C13 8.76519 12.5523 8.31747 12 8.31747Z"
                      fill="currentColor"
                      fill-rule="evenodd"></path>
              </svg>
              <n-h2>bilibili</n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi>
          <a href="https://translate.google.com" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <n-icon size="36">
                <LanguageOutline/>
              </n-icon>
              <n-h2>Google 翻译</n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi>
          <a href="https://fanyi.youdao.com" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <n-icon size="36">
                <LanguageOutline/>
              </n-icon>
              <n-h2>有道翻译</n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi>
          <a href="https://www.aliyundrive.com/" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <n-icon size="36">
                <CloudUploadOutline/>
              </n-icon>
              <n-h2>阿里云盘</n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi v-for="nav in navs.state.navs" v-if="navs.state.navs !== []">
          <a :href="nav.web_url" referrerpolicy="no-referrer" target="_blank">
            <n-card>
              <div class="mb-1"></div>
              <n-avatar size="large">
                {{ nav.web_name.substring(0, 1) }}
              </n-avatar>
              <n-h2>
                {{ nav.web_name }}
                <a href="#">
                  <n-icon class="hover:text-red-600" size="16" @click="remove_nav(nav.web_name)">
                    <TrashOutline/>
                  </n-icon>
                </a>
              </n-h2>
              <div class="mb-2"></div>
            </n-card>
          </a>
        </n-gi>
        <n-gi>
          <n-card class="cursor-pointer" @click="create_new = true">
            <div class="mb-1"></div>
            <n-icon size="36">
              <Add/>
            </n-icon>
            <n-h2>新建</n-h2>
            <div class="mb-2"></div>
          </n-card>
        </n-gi>
      </n-grid>
      <n-modal v-model:show="create_new" preset="dialog" title="新建导航" transform-origin="center">
        <template #header>
          <div>新建导航</div>
        </template>
        <n-input-group class="mb-3 mt-2">
          <n-input-group-label>网站标题</n-input-group-label>
          <n-input v-model:value="web_name" type="text"/>
        </n-input-group>
        <n-input-group class="mb-3">
          <n-input-group-label>网站链接</n-input-group-label>
          <n-input v-model:value="web_url" type="text" @keyup.enter="add_nav()"/>
        </n-input-group>
        <template #action>
          <n-button secondary strong type="tertiary" @click="create_new = false">取消</n-button>
          <n-button secondary strong type="success" @click="add_nav()">保存</n-button>
        </template>
      </n-modal>
    </div>
  </IndexLayout>
</template>

<script setup>
import IndexLayout from "../components/menus/IndexLayout.vue";
import {
  NAvatar,
  NButton,
  NCard,
  NDivider,
  NGi,
  NGrid,
  NH1,
  NH2,
  NH4,
  NH5,
  NIcon,
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NModal,
  NSelect,
  NSpin,
  useDialog,
  useMessage
} from "naive-ui";
import {
  Add,
  ChatboxEllipsesOutline,
  CloudUploadOutline,
  LanguageOutline,
  Refresh,
  Search,
  TrashOutline
} from "@vicons/ionicons5";
import {ref} from "vue";
import axios from "axios";
import navs from "../plugins/stores/navs";

const web_name = ref("")
const web_url = ref("")

const message = useMessage()
const dialog = useDialog()
const hitokoto = ref({})
const create_new = ref(false)
const search_engine = ref("baidu")
const search_content = ref("")
let date = new Date()
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

let time = ref("")

setInterval(() => {
  date = new Date()
  time.value = ""
  if (date.getHours() < 10) {
    time.value += "0" + date.getHours().toString()
  } else {
    time.value += date.getHours().toString()
  }
  time.value += ":"
  if (date.getMinutes() < 10) {
    time.value += "0" + date.getMinutes().toString()
  } else {
    time.value += date.getMinutes().toString()
  }
  console.log(time.value)
}, 1000)


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
  }, 500)
}

function add_nav() {
  if (!web_name.value) {
    message.error("网站标题不能为空")
    return
  }
  if (!web_url.value) {
    message.error("网站链接不能为空")
    return
  }
  const p = {
    "web_name": web_name.value,
    "web_url": web_url.value
  }
  navs.commit("addNav", p)
  message.success("保存成功")
  web_name.value = ""
  web_url.value = ""
  create_new.value = false
}

function remove_nav(web_name) {
  dialog.warning({
    title: "警告",
    content: "你确定要删除吗",
    transformOrigin: "center",
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      const p = {
        "web_name": web_name
      }
      navs.commit("removeNav", p)
      message.success("删除成功")
    }
  });
}

get_hitokoto()
</script>
