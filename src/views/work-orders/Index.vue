<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="success">
        工单
      </n-text>
    </n-h1>
    <router-link :to="{name: 'work-orders.create'}">
      <n-button ghost>
        <template #icon>
          <n-icon>
            <PlusOutlined/>
          </n-icon>
        </template>
        新建工单
      </n-button>
    </router-link>

    <div class="mt-3"></div>
    <n-list v-if="work_orders.length" clickable hoverable>
      <n-list-item v-for="work_order in work_orders"
                   @click="router.push({name: 'work-orders.show', params: {id: work_order.uuid}})">
        <n-thing :title="work_order.title ?? ''"
                 :title-extra="new Date(work_order.updated_at).toLocaleString() + ' #' + (work_order.id ?? '')"
                 description="description">
          <template #description>
            <n-space size="small" style="margin-top: 4px">
              <n-tag :bordered="false" size="small" type="info">
               <span v-if="work_order.module">
                  {{ work_order.module.name }}
               </span>
                <span v-else>
                  莱云
                </span>
              </n-tag>
              <n-tag :bordered="false" size="small" type="info">
                <WorkOrderStatus :status="work_order.status"/>
              </n-tag>
              <n-tag v-if="work_order.host" :bordered="false" size="small" type="info">
                <span>
                  {{ work_order.host.name }}
                </span>
              </n-tag>
            </n-space>
          </template>

          <!--          <Preview :text="work_order.content"/>-->
        </n-thing>
      </n-list-item>
    </n-list>
    <n-empty v-else description="您还没有创建任何工单。"/>
  </IndexLayout>
</template>

<script setup>
import {ref} from "vue"
import {NButton, NEmpty, NH1, NIcon, NList, NListItem, NSpace, NTag, NText, NThing} from "naive-ui"
import {PlusOutlined} from "@vicons/material"
import IndexLayout from '../../components/menus/IndexLayout.vue'
import http from "../../plugins/http.js"
import WorkOrderStatus from "../../components/WorkOrderStatus.vue";
import {RouterLink} from "vue-router";
import router from "../../plugins/router.js";

const work_orders = ref([])

http.get("/work-orders").then(res => {
  work_orders.value = res.data.data
}).catch(err => {
  console.log(err)
})

</script>
