<template>
  <n-h1 prefix="bar">
    <n-text type="primary">
      文章列表
    </n-text>
  </n-h1>

  <n-input v-model:value="params.search" @change="params.page=1;doSearch()" type="text" placeholder="搜索内容..."/>

  <div class="mt-3"></div>

  <n-list bordered clickable hoverable>
<!--    @click="viewPost(post.url)"-->
    <n-list-item v-for="post in posts" @click="goToPost(post.blog_id, post.blog_post_id)">


      <n-thing
          :title="post.title"
          content-style="margin-top: 10px;">

        <template #avatar>
          <n-avatar
              round
              size="medium"
              :src="api.avatar + '/' +md5(post.blog.user.email)" alt="avatar" />
        </template>

        <template #description>
          <n-space size="small" style="margin-top: 4px">
            <n-tag
                :bordered="false"
                size="small"
                type="success"
            >
              {{ post.blog.name }}
            </n-tag>
          </n-space>

          <n-text >
            <div class="mt-2">
              {{ post.excerpt }}
            </div>
          </n-text>
        </template>

      </n-thing>


      <!--        <Preview :text="reply.content"/>-->

      <!--        <n-text depth="3">-->
      <!--          {{ new Date(reply.created_at).toLocaleString() }}-->
      <!--        </n-text>-->

    </n-list-item>
  </n-list>


  <div class="text-center mt-3" v-show="posts_raw.current_page !== posts_raw.last_page">
    <n-button @click="params.page++;doSearch()">下一页</n-button>
  </div>

  <!--  <n-empty v-else description="暂时还没有内容"/>-->


  <!--  {{ posts }}-->
</template>


<script setup>
import {ref} from "vue";
import {NAvatar, NButton, NH1, NInput, NList, NListItem, NText, NThing, NSpace, NTag} from 'naive-ui'
import md5 from 'js-md5'
import api from "../../../config/api";

import gateway from "../../../plugins/gateway"
import router from "../../../plugins/router";

const params = ref({
  search: '',
  page: 1
})

const posts_raw = ref({
  data: [{
    title: '',
    excerpt: '',
    url: '',
    blog_id: '',
    post_id: '',
    blog_post_id: '',
    blog: {
      user: {
        email: ''
      }
    }
  }],
  current_page: 0,
  last_page: 0
})

const posts = ref([])

function doSearch() {
  gateway.get('/forbidden-forest/posts', {
    params: params.value
  }).then(res => {
    posts_raw.value = res.data

    if (params.value.page === 1) {
      posts.value = posts_raw.value.data
      console.log('refresh')
      return
    }

    // append to posts
    posts.value = posts.value.concat(res.data.data)

  })
}

doSearch()

const goToPost = (blog_id, post_id) => {
  router.push({
    name: 'modules.forbidden-forest.show',
    params: {
      blog_id: blog_id,
      post_id: post_id
    }
  })
}

const viewPost = (url) => {
  setTimeout(() => window.open(url, '_blank'))
}

</script>

