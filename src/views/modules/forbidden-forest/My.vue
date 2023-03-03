<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      您的博客
    </n-text>
  </n-h1>

  <n-form
      ref="formRef"
      :model="blog"
      :style="{
      maxWidth: '640px'
    }"
      label-placement="left"
      label-width="auto"

  >
    <n-form-item label="博客地址">
      <n-input v-model:value="blog.url" placeholder="您的博客地址"/>
    </n-form-item>
    <br/>
    <n-form-item label="登录用户名">
      <n-input v-model:value="blog.username" placeholder="您的博客用户名"/>
    </n-form-item>
    <n-form-item label="应用程序密码">
      <n-input v-model:value="blog.password" placeholder="应用程序密码。"/>
    </n-form-item>
    <n-form-item label="确认一下">

      <div>
        <n-button @click="save()" type="primary">
          保存
        </n-button>
        &nbsp;
        <n-button @click="remove()" class="ml-1" type="error" v-if="blog.id">
          删除
        </n-button>

        <br/>
        <p>我们目前只支持 WordPress 博客。</p>

        <p>加入后，禁林 将会存储您的 WordPress 里面的文章的摘要部分供索引使用。</p>
        <p>禁林 不会保存您的文章全文，并且 API 操作将透传到您的 WordPress。</p>

      </div>

    </n-form-item>
  </n-form>

</template>


<script setup>
import {NButton, NForm, NFormItem, NH1, NInput, NText} from 'naive-ui'
import {ref} from "vue";

import gateway from '../../../plugins/gateway'

const user = ref({
  blog: {}
})
const blog = ref({
  id: '',
  url: '',
})

gateway.get('/forbidden-forest/user').then(res => {
  user.value = res.data
  blog.value = res.data.blog ?? {
    id: '',
    url: '',
  }
})

const save = () => {
  if (!blog.value.id) {
    gateway.post('/forbidden-forest/blogs', blog.value).then(res => {
      blog.value = res.data
    })
  } else {
    gateway.patch('/forbidden-forest/blogs/' + blog.value.id, blog.value)
  }
}

const remove = () => {
  gateway.delete('/forbidden-forest/blogs/' + blog.value.id).then(res => {
    blog.value = {
      id: '',
      url: '',
    }
  })
}
</script>

