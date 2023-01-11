<template>
  <div></div>
</template>

<script setup>
import echo from '../plugins/echo'

import userStore from '../plugins/stores/user'

import {useNotification} from 'naive-ui'

import {computed} from 'vue'

const notification = useNotification()

const token = computed(() => userStore.state.token)
const user = computed(() => userStore.state.user)

if (token.value) {
  echo.private(`users.${user.value.id}`).listen('.common', (e) => {
    console.log(e)

    let title = ''

    if (e.data.name) {
      title = e.data.name
    } else if (e.data.title) {
      title = e.data.title
    }

    let content = e.data.message ?? e.data.content ?? ''

    if (e.module) {
      title = e.module.name + ' - ' + title
    }

    let data = {
      title: title,
      content: content,
      duration: 5000,
      keepAliveOnHover: true,
      meta: new Date(e.sent_at).toLocaleString()
    }

    switch (e.type) {
      case 'success':
        notification.success(data)
        break
      case 'info':
        notification.info(data)
        break
      case 'warning':
        notification.warning(data)
        break
      case 'error':
        notification.error(data)
        break
      default:
        notification.info(data)
        break
    }
  })
}
</script>
