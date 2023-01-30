<template>
  <div v-if="task">

    <div>
      <div v-if="percentage">
        <n-progress :percentage="percentage" type="circle"/>
      </div>
      <div>
        <n-spin size="small"/>
      </div>
    </div>

    <div>
      <n-text type="secondary" v-text="task"/>
    </div>
  </div>
  <div v-else>
    无
  </div>
</template>

<script setup>

import {computed, ref} from 'vue'
import {NProgress, NSpin, NText} from 'naive-ui'

import taskStore from '../plugins/stores/tasks'

const percentage = ref(0)

const taskStatus = computed(() => {
  return taskStore.state.last_status
})

const task = computed(() => {
  let firstTask = taskStore.state.tasks[0] ?? null


  if (firstTask) {
    percentage.value = firstTask.percentage
  }

  return firstTask
})


</script>