<template>
  <div v-show="base_url">
    <n-list hoverable clickable>
      <n-list-item v-for="item in items">
        <span v-if="item.attributes">
          <n-a
            class="list-group-item list-group-item-action shadow-sm rounded"
            target="_blank"
            :href="base_url + '/d/' + item.attributes['slug']"
          >
            <n-thing
              :title="item.attributes['title']"
              content-style="margin-top: 10px;"
            >
              <template #description>
                <n-space size="small" style="margin-top: 4px">
                <n-tag :bordered="false" type="success" size="small">发布于 {{
                    new Date(item.attributes['lastPostedAt']).toLocaleString()
                  }} </n-tag>
                <!-- <n-tag :bordered="false" type="info" size="small"> 晚春 </n-tag> -->
                 
              </n-space>
              </template>

              <!-- 奋勇呀然后休息呀<br />
              完成你伟大的人生 -->
            </n-thing>
          </n-a>
        </span>
      </n-list-item>
    </n-list>
  </div>
</template>

<script setup>
  // import { defineProps } from 'vue'

  import {
    NA,
    NList,
    NListItem,
    NSpace,
    NTag,
    NThing,
  } from 'naive-ui'

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
