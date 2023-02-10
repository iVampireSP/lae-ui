<template>
  <div>
    <!--    <div v-if="!token" style="height: 64px" class="fixed top-0 left-0 right-0 flex justify-center">-->
    <!--      <div class="flex items-center">-->
    <!--        <div style="font-size: 18px">正在 <a class="underline" href="/">莱云</a> 上参与工单</div>-->
    <!--      </div>-->
    <!--    </div>-->


    <IndexLayout>
      <div class="flex justify-center">
        <div class="work-order-layout">
          <div v-if="!loaded">
            <!-- 加载中 -->
            <div class="flex justify-center h-screen text-center">
              <div class="flex items-center">
                <span class="work_order_show_loader"></span>
              </div>
            </div>
          </div>
          <div v-if="loaded">
            <div>
              <n-h2 prefix="bar">
                <n-text type="success">
                  {{ workOrder.title }}
                </n-text>
              </n-h2>

              <div class="markdown-preview">
                <Preview :text="workOrder.content"/>
              </div>
            </div>

            <WorkOrderStatus v-if="workOrder.status" :status="workOrder.status"/>

            <div v-if="replies.length" class="mt-3">
              <!-- replies -->
              <n-h3 prefix="bar">
                <n-text type="success">
                  对话记录
                </n-text>
              </n-h3>

              <template v-for="(item, index) in replies">
                <n-h4 v-if="index" :id="'page-' + index">第 {{ index }} 页</n-h4>

                <n-list v-if="index !== 0" bordered clickable hoverable>
                  <n-list-item v-for="reply in item">
                    <n-thing
                        :title="(reply.role === 'module' ? reply.module.name + (reply.name ? ' 的 ' + reply.name : '') : (reply.role === 'admin' ? '莱云 的 ' + reply.name : reply.name ?? '无')) "
                        content-style="margin-top: 10px;">
                    </n-thing>

                    <Preview :text="reply.content"/>

                    <n-text depth="3">
                      {{ new Date(reply.created_at).toLocaleString() }}
                    </n-text>

                  </n-list-item>
                </n-list>

              </template>
            </div>

            <div v-if="can_next" class="flex justify-center mt-5">
              <n-spin v-if="loading"/>

              <n-button v-if="!loading && can_next" type="primary" @click="load(true)">
                下一页
              </n-button>
            </div>

            <div v-if="!token" class="mt-5">
              <n-h3 prefix="bar">
                <n-text type="success">
                  您的称呼
                </n-text>
              </n-h3>

              <n-input v-model:value="reply.name" placeholder="在提交回复后可见。"></n-input>
            </div>

            <div class="mt-3">
              <n-h3 prefix="bar">
                <n-text type="success">
                  回复
                </n-text>
              </n-h3>

              <v-md-editor
                  v-model="reply.content"
                  height="500px"
                  placeholder="继续跟进问题。如果问题已解决，请关闭工单。"
              ></v-md-editor>
            </div>

            <div class="mt-3">
              <div class="mb-2">
                <WorkOrderStatus v-if="workOrder.status" :status="workOrder.status"/>
              </div>

              <n-button-group>
                <n-button type="primary" @click="replyWorkOrder">回复</n-button>
                <n-button type="default" @click="closeWorkOrder">关闭</n-button>
              </n-button-group>


            </div>
          </div>
        </div>
      </div>
    </IndexLayout>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {computed, onUnmounted, ref} from 'vue'
import {NButton, NButtonGroup, NH2, NH3, NH4, NInput, NList, NListItem, NSpin, NText, NThing} from 'naive-ui'
import userStore from '../../plugins/stores/user'
import IndexLayout from "../../components/menus/IndexLayout.vue";
import Preview from '../../components/Markdown/Preview.vue'
import hljs from 'highlight.js'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'
import http from '../../plugins/http'
import WorkOrderStatus from '../../components/WorkOrderStatus.vue'

const page = ref(0)

const can_next = ref(false)

const loading = ref(false)

const router = useRoute()
const loaded = ref(false)

const token = computed(() => userStore.state.token)

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})

const workOrder = ref({
  title: '工单',
  content: '### ...',
  name: null,
})

const replies = ref([])

const reply = ref({
  content: '',
})

function load(scroll = false) {
  page.value++

  refresh(scroll)
}

load(false)

function refresh(scroll = false) {
  loading.value = true

  http
      .get('/work-orders/' + router.params.id)
      .then((res) => {
        workOrder.value = res.data

        setTimeout(() => {
          loaded.value = true
          loading.value = false
        }, 1500)

        document.title = workOrder.value.title
      })
      .finally(() => {
        http
            .get('/work-orders/' + router.params.id + '/replies', {
              params: {
                page: page.value,
              },
            })
            .then((res) => {
              if (res.data.data.length) {
                // 附加页面和内容到 replies
                if (replies.value[page.value] == null) {
                  replies.value[page.value] = []
                }

                replies.value[page.value] = res.data.data
              }

              can_next.value = res.data.next_page_url != null;
            })
            .finally(() => {
              loading.value = false

              if (scroll) {
                setTimeout(() => {
                  let height = document.querySelector(
                      '#page-' + page.value
                  ).offsetTop

                  window.scrollTo(0, height)
                }, 100)
              }
            })
      })
}

// auto refresh
const interval = setInterval(refresh, 10000)

onUnmounted(() => {
  clearInterval(interval)
})

function replyWorkOrder() {
  http
      .post('/work-orders/' + router.params.id + '/replies', reply.value)
      .then((res) => {
        // if 200
        if (res.status === 200) {
          reply.value.content = ''
        }

        refresh()
      })
}

function closeWorkOrder() {
  http
      .patch('/work-orders/' + router.params.id, {status: 'closed'})
      .then(() => {
        refresh()
      })
}
</script>

<style>
.work_order_show_loader {
  position: relative;
  width: 100px;
  height: 130px;
  background: #f0f0f0;
  border-radius: 4px;
}

.work_order_show_loader:before {
  content: '';
  position: absolute;
  width: 54px;
  height: 25px;
  left: 50%;
  top: 0;
  background-image: radial-gradient(ellipse at center, #0000 24%, #de3500 25%, #de3500 64%, #0000 65%),
  linear-gradient(to bottom, #0000 34%, #de3500 35%);
  background-size: 12px 12px, 100% auto;
  background-repeat: no-repeat;
  background-position: center top;
  transform: translate(-50%, -65%);
  box-shadow: 0 -3px rgba(0, 0, 0, 0.25) inset;
}

.work_order_show_loader:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  width: 66%;
  height: 60%;
  background: linear-gradient(to bottom, #f79577 30%, #0000 31%);
  background-size: 100% 16px;
  animation: work_order_show_loader_write_down 2s ease-out infinite;
}

@keyframes work_order_show_loader_write_down {
  0% {
    height: 0;
    opacity: 0;
  }
  20% {
    height: 0;
    opacity: 1;
  }
  80% {
    height: 65%;
    opacity: 1;
  }
  100% {
    height: 65%;
    opacity: 0;
  }
}

.github-markdown-body {
  background-color: unset !important;
}

.work-order-layout {
  width: 75% !important;
}

@media screen and (max-width: 768px) {
  .work-order-layout {
    width: 100% !important;
  }
}

</style>