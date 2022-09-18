<template>
  <div class="mb-2">
    <h4>欢迎使用 莱云 Beta</h4>

    <!-- <span v-if="item.attributes">
      {{ item.attributes.title }}
    </span>

    <span v-if="item.attributes">
      {{ new Date(item.attributes.createdAt).toLocaleString() }}
    </span> -->

    <div v-show="pinned">
      <h4 class="mt-3">公告</h4>
      <div class="list-group mt-3" v-for="item in pinned">
        <span v-if="item.attributes">
          <a
            class="list-group-item list-group-item-action shadow-sm rounded"
            target="_blank"
            :href="base_url + '/d/' + item.attributes.slug"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 text-success">
                {{ item.attributes.title }}
              </h5>
              <small>
                {{
                  new Date(
                    item.attributes.lastPostedAt
                  ).toLocaleString()
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
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  const pinned = ref([])
  const base_url = ref('')

  http.get('forum/pinned').then((res) => {
    // foreach res
    pinned.value = res.data

    base_url.value = pinned.value.base_url
  })
</script>
