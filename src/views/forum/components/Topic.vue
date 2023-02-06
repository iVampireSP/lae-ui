<template>
  <div v-show="base_url">
    <n-list v-if="items[0]" clickable hoverable>
      <n-list-item v-for="item in items">
        <span v-if="item.attributes">
          <n-a
              :href="base_url + '/d/' + item.attributes['slug']"
              class="list-group-item list-group-item-action shadow-sm rounded"
              target="_blank"
          >
            <n-thing
                :title="item.attributes['title']"
                content-style="margin-top: 10px;"
            >
              <template #description>
                <n-space size="small" style="margin-top: 4px">
                <n-tag :bordered="false" size="small" type="success">发布于 {{
                    new Date(item.attributes['lastPostedAt']).toLocaleString()
                  }} </n-tag>
              </n-space>
              </template>

            </n-thing>
          </n-a>
        </span>
      </n-list-item>
    </n-list>
    <n-empty v-else description="暂时还没有内容"/>
  </div>
</template>

<script setup>
// import { defineProps } from 'vue'

import {NA, NEmpty, NList, NListItem, NSpace, NTag, NThing} from 'naive-ui'

const props = defineProps({
  items: {
    type: Object,
    required: true,
  },
  base_url: {
    type: String,
    required: true,
  },
})
</script>
