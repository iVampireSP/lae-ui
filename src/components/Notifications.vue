<template>
  <div></div>
</template>

<script setup>

import {h} from "vue"
import Preview from "./Markdown/Preview.vue"


import {useMessage, useNotification} from 'naive-ui'

import {listen} from '../plugins/echo'

import taskStore from '../plugins/stores/tasks'

import play from '../plugins/audio'

const notification = useNotification()
const message = useMessage()


/* Task */
listen('tasks.created', (e) => {
  // notification.info({
  //   title: e.module.name ?? '任务',
  //   content: e.data.title,
  // })
  message.info((e.module.name ?? '任务') + ': ' + e.data.title)

  taskStore.commit('addTask', e.data)
})

listen('tasks.updated', (e) => {
  // 更新任务, 如果 e.data.status 为 failed,done,success,error, 则 10 秒后删除任务，否则就更新
  if (['failed', 'done', 'success', 'error'].includes(e.data.status)) {

    // if success or done
    if (['success', 'done'].includes(e.data.status)) {
      // notification.success({
      //   title: e.module.name ?? '任务',
      //   content: e.data.title,
      // })
      message.success((e.module.name ?? '任务') + ': ' + e.data.title)
    } else {
      // notification.error({
      //   title: e.module.name ?? '任务',
      //   content: e.data.title,
      // })
      message.error((e.module.name ?? '任务') + ': ' + e.data.title)
    }

    setTimeout(() => {
      // 从 taskStore 中删除任务
      taskStore.commit('deleteTask', e.data.id)
    }, 5000)
  } else {
    taskStore.commit('updateTask', e.data)
  }
})

/* End Task */


/* Begin Notification */
listen('notifications', (e) => {
  handleNotification(e)
})

listen('notification', (e) => {
  handleNotification(e)
})

function handleNotification(e) {
    let title = ''

  if (e.data.name) {
    title = e.data.name
  } else if (e.data.title) {
    title = e.data.title
  }

  let content = e.data.message ?? e.data.content ?? ''

  if (e.module) {
    let newTitle = e.module.name

    if (title) {
      title = newTitle + ' - ' + title
    } else {
      title = newTitle
    }
  }

  let data = {
    title: title,
    content: () => {
      return h(Preview, {
        text: content,
        mode: 'preview',
      })
    },
    meta: new Date(e['sent_at']).toLocaleString(),
  }

  if (notification[e.type]) {
    notification[e.type](data)
  } else {
    notification.info(data)
  }

  play('Popcorn.ogg')
}

/* End Notification */

/* Begin WorkOrder */


function sendWorkOrderNotification(e) {
  let status = {
    'pending': '待处理',
    'in_progress': '处理中',
    'closed': '结单',
    'error': '错误',
    'replied': '已回复',
    'read': '已读',
    'open': '已开启',
  }
  
  let title = status[e.data.status]
  let content = e.data.latest_reply['content'] ?? e.data.title
  let meta = new Date(e['sent_at']).toLocaleString()
  notification.info({
    title: title,
    content: () => {
      return h(Preview, {
        text: content,
        mode: 'preview',
      })
    },
    meta: meta,
  })
  play('success_1.wav')
}

listen('work-order.pending', (e) => sendWorkOrderNotification(e))
listen('work-order.in_progress', (e) => sendWorkOrderNotification(e))
listen('work-order.closed', (e) => sendWorkOrderNotification(e))
listen('work-order.error', (e) => sendWorkOrderNotification(e))
listen('work-order.replied', (e) => sendWorkOrderNotification(e))
listen('work-order.read', (e) => sendWorkOrderNotification(e))
listen('work-order.open', (e) => sendWorkOrderNotification(e))
/* End WorkOrder */


</script>
