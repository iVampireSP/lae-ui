<template>
  <div></div>
</template>

<script setup>

import {useMessage, useNotification} from 'naive-ui'

import {listen} from '../plugins/echo'

import taskStore from '../plugins/stores/tasks'

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

//
// const token = computed(() => userStore.state.token)
// const user = computed(() => userStore.state.user)
//
// if (token.value) {
//   echo.private(`users.${user.value.id}`).listen('.messages', (e) => {
//     console.log(e)
//
//     let title = ''
//
//     if (e.data.name) {
//       title = e.data.name
//     } else if (e.data.title) {
//       title = e.data.title
//     }
//
//     let content = e.data.message ?? e.data.content ?? ''
//
//     if (e.module) {
//       let newTitle = e.module.name
//
//       if (title) {
//         title = newTitle + ' - ' + title
//       } else {
//         title = newTitle
//       }
//     }
//
//     let data = {
//       title: title,
//       content: content,
//       duration: 5000,
//       keepAliveOnHover: true,
//       meta: new Date(e['sent_at']).toLocaleString(),
//     }
//
//     switch (e.type) {
//       case 'success':
//         notification.success(data)
//         break
//       case 'info':
//         notification.info(data)
//         break
//       case 'warning':
//         notification.warning(data)
//         break
//       case 'error':
//         notification.error(data)
//         break
//       default:
//         notification.info(data)
//         break
//     }
//   })
// }
</script>
