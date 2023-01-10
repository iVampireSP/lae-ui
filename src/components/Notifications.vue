<template>
  <div></div>
</template>

<script setup>
  import echo from '../plugins/echo'

  import userStore from '../plugins/stores/user'

  import { useNotification } from 'naive-ui'

  import { computed } from 'vue'

  const notification = useNotification()

  const token = computed(() => userStore.state.token)
  const user = computed(() => userStore.state.user)

  if (token.value) {
    echo.private(`users.${user.value.id}`).listen('.common', (e) => {
      console.log(e)

      let title = '新消息'

      let content = e.data.message

      if (e.module) {
        title = e.module.name + ' - ' + title
        content = e.data.message
      }

      let data = {
        content: title,
        meta: content,
        duration: 2500,
        keepAliveOnHover: true,
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
