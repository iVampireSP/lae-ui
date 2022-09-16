<template>
  <div class="mb-2">
    <h4>欢迎使用 莱云 Beta</h4>

    <!-- <span v-if="announcement.attributes">
      {{ announcement.attributes.title }}
    </span>

    <span v-if="announcement.attributes">
      {{ new Date(announcement.attributes.createdAt).toLocaleString() }}
    </span> -->
    <h4 class="mt-3">公告</h4>
    <div class="list-group mt-3" v-for="announcement in announcements">
      <span v-if="announcement.attributes">
        <a
          class="list-group-item list-group-item-action shadow-sm rounded"
          target="_blank"
          :href="base_url + '/d/' + announcement.attributes.slug"
        >
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 text-success">
              {{ announcement.attributes.title }}
            </h5>
            <small>
              {{
                new Date(announcement.attributes.lastPostedAt).toLocaleString()
              }}
            </small>
          </div>
          <!-- <p class="mb-1">
            <span></span>
          </p> -->
          <!-- <small class="text-muted">
        </small> -->
        </a>
      </span>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  const announcements = ref([
    {
      attributes: {
        title: '莱云 Beta',
        slug: 'beta',
      },
    },
  ])
  const base_url = ref('')

  http.get('forum/announcements').then((res) => {
    // foreach res
    announcements.value = res.data

    console.log(announcements.value)

    base_url.value = announcements.value.base_url
  })
</script>
