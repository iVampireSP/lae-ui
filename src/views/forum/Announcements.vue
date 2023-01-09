<template>
  <IndexLayout>
    <div v-show="base_url">
      <h4 class="mt-3">公告</h4>
      <div class="list-group mt-3" v-for="item in announcements">
        <span v-if="item.attributes">
          <a
              class="list-group-item list-group-item-action shadow-sm rounded"
              target="_blank"
              :href="base_url + '/d/' + item.attributes['slug']"
          >
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1 text-success">
                {{ item.attributes.title }}
              </h5>
              <small>
                {{ new Date(item.attributes['lastPostedAt']).toLocaleString() }}
              </small>
            </div>
          </a>
        </span>
      </div>
    </div>
  </IndexLayout>
</template>

<script setup>
import {ref} from 'vue'

import http from '../../plugins/http'
import IndexLayout from "../../components/menus/IndexLayout.vue";

const announcements = ref({
  base_url: ''
})
const base_url = ref('')

const show = ref(false)


http.get('forum/announcements').then((res) => {
  announcements.value = res.data
  base_url.value = announcements.value.base_url
  setTimeout(() => {
    show.value = true
  }, 500)
})

</script>

<style scoped>

</style>