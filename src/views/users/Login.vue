<template>
  <div>
    <n-grid cols="1 xl:2" responsive="screen">
      <n-gi>
        <div class="justify-center items-center flex" style="height: 92vh">
          <div>
            <n-h2>使用邮箱 / 密码</n-h2>

            <n-form :model="form">
              <n-form-item label="邮箱" prop="email">
                <n-input v-model:value="form.email" placeholder="您的邮箱"/>
              </n-form-item>
              <n-form-item label="密码" prop="password">
                <n-input v-model:value="form.password" placeholder="您的密码" type="password"/>
              </n-form-item>
              <n-form-item>
                <div>
                  <n-button type="primary" @click="login">登录</n-button>
                  <div class="mt-3">
                    如果您没有账号，我们将会帮您创建一个。
                    <span v-show="isMobile">
                      <br/>
                      向下滑动以使用扫码/一键登录(推荐)。
                    </span>
                  </div>
                </div>
              </n-form-item>
            </n-form>
          </div>
        </div>
      </n-gi>
      <n-gi>
        <QrCode/>
      </n-gi>
    </n-grid>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {NButton, NForm, NFormItem, NGi, NGrid, NH2, NInput, useDialog} from 'naive-ui'
import api from '../../config/api'
import user from '../../plugins/stores/user.js'
import userStore from '../../plugins/stores/user.js'
import router from '../../plugins/router'
import QrCode from './QrCode.vue'
import axios from "axios";
import {useIsMobile} from "../../utils/composables.js";

const dialog = useDialog()

const origin = api.auth

const form = ref({
  email: '',
  password: ''
})

const isMobile = useIsMobile()

function login() {

  axios.post(api.auth + '/api/auth', form.value).then(res => {
    if (res.status === 201) {
      dialog.success({
        title: '欢迎加入莱云。',
        content: '您的账号已经创建成功。请到您的邮箱中验证您的邮箱地址。'
      })
    } else if (res.status === 200) {
      user.commit('updateToken', res.data.token)
      userStore.dispatch('fetch')
      router.push({path: '/'})
    }
  }).catch(err => {
    if (err.response.status === 401) {
      dialog.error({
        title: '登录失败',
        content: '您的邮箱或密码错误。'
      })
    } else if (err.response.status === 429) {
      dialog.error({
        title: '登录失败',
        content: '请 5 分钟之后再尝试密码登录。'
      })
    } else {
      dialog.error({
        title: '登录失败',
        content: err.response.data.message
      })
    }
  })
}

onMounted(() => {
  user.commit('updateToken', '')
  user.commit('updateUser', {})
})

const logo = ref('Logo-dark')
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  logo.value = 'Logo-white'
}
</script>
