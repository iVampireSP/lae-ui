<template>
  <div v-if="!hasError">
    <n-h1 prefix="bar">
      <n-text type="primary">
        {{ post.title.rendered }}
      </n-text>
    </n-h1>

    <div v-html="preview">
    </div>
  </div>

  <div v-if="hasError">
    <n-h1>无法加载此文章。</n-h1>
  </div>


  <div class="mt-5">
    <n-h3 prefix="bar">
      <n-text type="primary">
        快速评论
      </n-text>
    </n-h3>

    <n-input
        v-model:value="comment"
        type="textarea"
        placeholder="给原文快速留言..."
    />
    <div class="mt-1">
      <n-button type="primary" @click="sendComment">留言</n-button>
      &nbsp;
      <n-button tag="a" :href="post.link" target="_blank" type="primary">查看原文章</n-button>
    </div>
  </div>


  <!--  {{ post }}-->
</template>


<script setup>
import {ref} from "vue";
import {NButton, NH1, NH3, NInput, NText, useDialog} from 'naive-ui'
import {useRoute} from "vue-router";
import gateway from "../../../plugins/gateway"


const dialog = useDialog()
const route = useRoute()

const post = ref({
  title: {
    rendered: ''
  },
  content: {
    rendered: ''
  },
  link: '',
})

const comment = ref('')
const preview = ref('')

const params = ref({
  blog_id: route.params.blog_id,
  post_id: route.params.post_id
})

const hasError = ref(false)

gateway.get('/forbidden-forest/blogs/' + params.value.blog_id + '/posts/' + params.value.post_id).then(res => {
  if (res.data.status !== 'publish') {
    hasError.value = true
    console.log(res.data.status)
    return
  }

  post.value = res.data

  // html 标签反转义
  const div = document.createElement('div')
  div.innerHTML = post.value.content.rendered

  // XSS 过滤
  const script_tags = div.getElementsByTagName('script')
  for (let i = 0; i < script_tags.length; i++) {
    script_tags[i].remove()
  }

  // 检测 data-original，如果有则替换 src
  const img_tags = div.getElementsByTagName('img')
  for (let i = 0; i < img_tags.length; i++) {
    if (img_tags[i].getAttribute('data-original')) {
      img_tags[i].setAttribute('src', img_tags[i].getAttribute('data-original'))
    }

    if (img_tags[i].getAttribute('data-src')) {
      img_tags[i].setAttribute('src', img_tags[i].getAttribute('data-src'))
    }
  }

  // 获取纯文本
  preview.value = div.innerHTML

})

const sendComment = () => {
  gateway.post('/forbidden-forest/blogs/' + params.value.blog_id + '/posts/' + params.value.post_id + '/comments', {
    content: comment.value
  }).then(res => {

    if (res.data.code) {
      dialog.error({
        title: '评论失败',
        content: res.data.message,
        positiveText: '好',
      })
    } else {
      dialog.success({
        title: '评论成功',
        content: '感谢您的留言。',
        positiveText: '好',
      })
    }

    comment.value = ''

  })
}

</script>

