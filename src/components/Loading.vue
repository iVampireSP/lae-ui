<template>
  <div :class="showRef ? 'mt-10' : ''">
    <n-spin :show="showRef">
      <slot/>
      <template #description>
        <n-p v-text="lyric()"></n-p>
      </template>
    </n-spin>
  </div>
</template>

<script setup>
import {toRef} from 'vue'
import {NP, NSpin} from 'naive-ui'
import lyric from '../plugins/lyric'

const props = defineProps({
  show: {
    type: Boolean,
  },
})

const showRef = toRef(props, 'show')

</script>