<template>
  <div>
    <h3>工单</h3>
    <div class="overflow-auto">
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">名称</th>
            <th scope="col">主机</th>
            <th scope="col">接收方</th>
            <th scope="col">状态</th>
            <th scope="col">上次更新</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="workOrder in workOrders">
            <tr class="cursor-pointer" @click="viewWorkOrder(workOrder.id)">
              <td>{{ workOrder.title }}</td>
              <td>
                <span v-if="workOrder.host">{{ workOrder.host.name }}</span>
                <span v-else>无</span>
              </td>
              <td>{{ workOrder.module.name }}</td>
              <td>
                <WorkOrderStatus :status="workOrder.status" />
              </td>
              <td>{{ new Date(workOrder.updated_at).toLocaleString() }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>

  <div>
    <div class="btn-group" role="group">
      <router-link
        type="button"
        class="btn btn-outline-primary"
        :to="{ name: 'work-orders.create' }"
        >提交工单</router-link
      >
    </div>
  </div>
</template>

<script setup>
  import { ref, onUnmounted } from 'vue'
  import http from '../../api/http'
  import router from '../../plugins/router'
  import WorkOrderStatus from '../../components/WorkOrderStatus.vue'

  const workOrders = ref([])

  function refresh() {
    http.get('/work-orders').then((res) => {
      workOrders.value = res.data.data
    })
  }

  refresh()

  //   auto reload
  let interval = setInterval(refresh, 10000)

  onUnmounted(() => {
    clearInterval(interval)
  })

  function viewWorkOrder(workOrder_id) {
    router.push({
      name: 'work-orders.show',
      params: {
        id: workOrder_id,
      },
    })
  }
</script>
