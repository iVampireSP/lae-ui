<template>
  <n-h1 class="all-zero">
    <div class="!text-center">
      <n-avatar :size="256" :src="avatar" round/>
      <br/>
      <span v-if="!editable">{{ user.name }} # {{ user.id }}&nbsp;</span>
      <n-icon :size="20" class="cursor-pointer" @click="editable = true" v-if="!editable">
        <CreateOutline/>
      </n-icon>

      <n-input-group v-else class="mb-3">
        <n-input v-model:value="username" placeholder="用户名"/>
        <n-button strong secondary type="success" @click="change_username()">
          <template #icon>
            <n-icon><Checkmark/></n-icon>
          </template>
        </n-button>
        <n-button strong secondary type="error" @click="editable = false">
          <template #icon>
            <n-icon><Close/></n-icon>
          </template>
        </n-button>
      </n-input-group>
    </div>

  </n-h1>
</template>

<script setup>
import {NH1, NIcon, NInput, NInputGroup, NAvatar, NButton, useMessage} from "naive-ui";
import {computed, ref} from "vue";
import userStore from "../../plugins/stores/user.js";
import {CreateOutline, Checkmark, Close} from "@vicons/ionicons5";
import api from "../../config/api.js";
import http from "../../plugins/http.js";

const message = useMessage()

const user = computed(() => {
  return userStore.state.user
})

const username = ref(user.value.name)

const avatar = computed(() => {
  return api.avatar + user.value.email_md5 + '?s=256?cache=0';
})

const editable = ref(false)

const change_username = () => {
  if (username.value === user.value.name) {
    message.success('用户名修改成功')
    editable.value = false
  } else {
    http.patch('/user?name=' + username.value).then(() => {
      http.get('/user').then(res => {
        userStore.commit('updateUser', res.data)
      }).catch(() => {
        message.error('用户名修改失败')
      })
      message.success('用户名修改成功')
      editable.value = false
    }).catch(() => {
      message.error('用户名修改失败')
      editable.value = false
    })
  }

}

</script>

<style scoped>
.all-zero {
  margin: 0 !important;
  padding: 0 !important;
}
</style>