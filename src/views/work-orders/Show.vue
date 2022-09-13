<template>
  <div>
    <h3 v-text="workOrder.title"></h3>

    <div class="markdown-preview">
      <v-md-editor v-model="workOrder.title" mode="preview"></v-md-editor>
    </div>
  </div>

  <WorkOrderStatus :status="workOrder.status" />

  <div class="mt-3">
    <!-- replies -->
    <h4>对话记录</h4>
    <template v-for="reply in replies">
      <div class="card border-light mb-3 markdown-preview shadow">
        <div class="card-header">
          <span v-if="reply.user_id == null" class="text-primary">
            提供方
          </span>
          <span v-else> 您 </span>
          <span class="text-end">
            {{ new Date(reply.created_at).toLocaleString() }}
          </span>
        </div>
        <div class="card-body">
          <v-md-editor v-model="reply.content" mode="preview"></v-md-editor>
        </div>
      </div>
    </template>
  </div>

  <div class="mt-5">
    <h4>回复</h4>
    <v-md-editor
      v-model="reply.content"
      height="500px"
      placeholder="继续跟进问题。如果问题已解决，请关闭工单。"
    ></v-md-editor>

    <!-- btn -->
    <div class="btn-group mt-4" role="group" aria-label="Basic example">
      <button class="btn btn-primary" @click="replyWorkOrder">回复</button>
      <button class="btn btn-danger" @click="closeWorkOrder">关闭</button>
    </div>
  </div>

  <div class="mt-2">
    <WorkOrderStatus :status="workOrder.status" />
  </div>
</template>

<script setup>
  import { useRoute } from 'vue-router'
  import { ref, onUnmounted } from 'vue'

  import hljs from 'highlight.js'
  import VMdEditor from '@kangc/v-md-editor'
  import '@kangc/v-md-editor/lib/style/base-editor.css'
  import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
  import '@kangc/v-md-editor/lib/theme/style/github.css'
  import http from '../../api/http'
  import WorkOrderStatus from '../../components/WorkOrderStatus.vue'

  const router = useRoute()
  const loaded = ref(false)

  VMdEditor.use(githubTheme, {
    Hljs: hljs,
  })

  const workOrder = ref({
    title: '工单',
    content: '### Content',
  })

  const replies = ref([])

  const reply = ref({
    content: '',
  })

  function refresh() {
    http.get('/work-orders/' + router.params.id).then((res) => {
      workOrder.value = res.data
      loaded.value = true
    })

    http.get('/work-orders/' + router.params.id + '/replies').then((res) => {
      replies.value = res.data
    })
  }

  refresh()

  // auto refresh
  const interval = setInterval(refresh, 10000)

  onUnmounted(() => {
    clearInterval(interval)
  })

  function replyWorkOrder() {
    http
      .post('/work-orders/' + router.params.id + '/replies', reply.value)
      .then(() => {
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