<template>
  <div v-if="!loaded">
    <!-- 加载中 -->
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
  <div v-if="loaded">
    <div>
      <h3 v-text="workOrder.title"></h3>

      <div class="markdown-preview">
        <v-md-editor v-model="workOrder.content" mode="preview"></v-md-editor>
      </div>
    </div>

    <WorkOrderStatus v-if="workOrder.status" :status="workOrder.status" />

    <div class="mt-3" v-if="replies.length">
      <!-- replies -->
      <h4>对话记录</h4>
      <template v-for="(item, index) in replies">
        <h4 :id="'page-' + index" v-if="index">第 {{ index }} 页</h4>

        <div v-for="reply in item">
          <div class="card border-light mb-3 markdown-preview shadow">
            <div class="card-header d-flex w-100 justify-content-between">
              <span v-if="reply.role === 'module'" class="text-primary">
                <span v-text="reply.module.name"></span>
                <span v-if="reply.name"> 的 {{ reply.name }} </span>
              </span>
              <span v-else-if="reply.role === 'admin'">
                <span class="text-primary">莱云</span>
              </span>
              <span v-else>
                <span>
                  {{ reply.name ?? reply.user.name }}
                </span>
              </span>
              <span class="text-end">
                <span>
                  <span v-if="reply.is_pending === 1" class="badge bg-primary"
                    >投递中</span
                  >
                </span>
                {{ new Date(reply.created_at).toLocaleString() }}
              </span>
            </div>
            <div class="card-body">
              <v-md-editor v-model="reply.content" mode="preview"></v-md-editor>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 中央按钮 -->
    <div class="d-flex justify-content-center mt-5" v-if="can_next">
      <div class="spinner-border text-primary" role="status" v-if="loading">
        <span class="visually-hidden">Loading...</span>
      </div>

      <button type="button" class="btn btn-primary" @click="load(1)" v-else>
        加载更多
      </button>
    </div>

    <div v-if="!store.state.token" class="mt-5">
      <h4>您的称呼</h4>
      <input
        type="text"
        class="form-control"
        v-model="reply.name"
        placeholder="在提交回复后可见。"
      />
    </div>

    <div class="mt-3">
      <h4>回复</h4>
      <v-md-editor
        v-model="reply.content"
        height="500px"
        placeholder="继续跟进问题。如果问题已解决，请关闭工单。"
      ></v-md-editor>
    </div>

    <div>
      <div class="btn-group mt-4" role="group" aria-label="Basic example">
        <button class="btn btn-primary" @click="replyWorkOrder">回复</button>
        <button class="btn btn-secondary" @click="closeWorkOrder">关闭</button>
      </div>
      <div class="mt-2">
        <WorkOrderStatus v-if="workOrder.status" :status="workOrder.status" />
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import { ref, onUnmounted } from 'vue'
  import store from '../../plugins/store'

  import hljs from 'highlight.js'
  import VMdEditor from '@kangc/v-md-editor'
  import '@kangc/v-md-editor/lib/style/base-editor.css'
  import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
  import '@kangc/v-md-editor/lib/theme/style/github.css'
  import http from '../../api/http'
  import WorkOrderStatus from '../../components/WorkOrderStatus.vue'

  const page = ref(0)

  const can_next = ref(false)

  const loading = ref(false)

  const router = useRoute()
  const loaded = ref(false)

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
        loaded.value = true
        loading.value = false
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

            if (res.data.next_page_url == null) {
              can_next.value = false
            } else {
              can_next.value = true
            }
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
      .then(() => {
        reply.value.content = ''
        refresh()
      })
  }

  function closeWorkOrder() {
    http
      .patch('/work-orders/' + router.params.id, { status: 'closed' })
      .then(() => {
        refresh()
      })
  }
</script>

<style>
  .markdown-preview .github-markdown-body {
    padding: 0;
    background-color: var(--bs-body-bg) !important;
  }
</style>
