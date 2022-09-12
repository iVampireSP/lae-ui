<template>
  <div>
    <h3>任务</h3>

    <p>当前的任务队列</p>

    <div class="overflow-auto">
      <table class="table">
        <thead>
          <tr>
            <th scope="col">主机名</th>
            <!-- <th scope="col">详情</th> -->
            <!-- <th scope="col">进度</th> -->
            <th scope="col">状态</th>
            <th scope="col">开始于</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks">
            <td>{{ task.host.name }}</td>
            <td class="text-nowrap">
              <span v-if="task.status == 'pending'">
                <i class="bi bi-clock"></i>&nbsp;</span
              >
              <span v-else-if="task.status == 'error'">
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp;错误
                </span></span
              >
              <span v-else-if="task.status == 'cancelled'"> 已取消 </span>
              <span v-else-if="task.status == 'processing'">
                <div
                  class="spinner-border text-primary spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden"></span>
                </div>
              </span>
              <span v-else-if="task.status == 'need_operation'">
                需要操作
              </span>
              <span v-else-if="task.status == 'done'"> 已完成 </span>
              <span v-else-if="task.status == 'success'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i></span
                >
              </span>

              {{ task.title }}
            </td>
            <!-- <td width="30%">
              <div class="mt-1">
                <div class="progress" v-if="task.status == 'processing'">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    :style="'width:' + task.progress + '%'"
                    :aria-valuenow="task.progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {{ task.progress }}%
                  </div>
                </div>
                <div
                  class="progress"
                  v-else-if="task.status == 'success' || task.status == 'done'"
                >
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style="width: 100%"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div
                  class="progress"
                  v-else-if="task.status == 'error' || task.status == 'failed'"
                >
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    style="width: 100%"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div class="progress" v-else-if="task.status == 'pending'">
                  <div
                    class="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style="width: 100%"
                  ></div>
                </div>
              </div>
            </td> -->
            <!-- <td class="text-nowrap">
              <span v-if="task.status == 'pending'">
                <i class="bi bi-clock"></i>&nbsp;等待中</span
              >
              <span v-else-if="task.status == 'failed'"> 失败 </span>
              <span v-else-if="task.status == 'error'">
                <span class="text-danger">
                  <i class="bi bi-x-circle"></i>
                  &nbsp;错误
                </span></span
              >
              <span v-else-if="task.status == 'cancelled'"> 已取消 </span>
              <span v-else-if="task.status == 'processing'">
                <div
                  class="spinner-border text-primary spinner-border-sm"
                  role="status"
                >
                  <span class="visually-hidden">处理中</span>
                </div>
                &nbsp;处理中
              </span>
              <span v-else-if="task.status == 'need_operation'">
                需要操作
              </span>
              <span v-else-if="task.status == 'done'"> 已完成 </span>
              <span v-else-if="task.status == 'success'">
                <span class="text-success"
                  ><i class="bi bi-check-circle"></i> &nbsp;成功</span
                >
              </span>
            </td> -->
            <td>{{ new Date(task.updated_at).toLocaleTimeString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
  import http from '../api/http'
  import { ref, onMounted, onUnmounted } from 'vue'

  const tasks = ref([])

  function refresh() {
    http.get('/tasks').then((res) => {
      tasks.value = res.data
    })
  }

  onMounted(() => {
    refresh()
    const interval = setInterval(refresh, 1000)
    onUnmounted(() => {
      clearInterval(interval)
    })
  })
</script>
