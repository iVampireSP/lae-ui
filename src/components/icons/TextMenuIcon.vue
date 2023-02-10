<template>
  <div :class="'not-italic text-base relative ' + extendClass">
    {{ text[0] }}
  </div>
</template>

<script setup>
import {ref, watchEffect} from 'vue'

import {menuCollapsed} from '../../plugins/menuOptions.js'

import {useIsMobile, useIsTablet} from "../../utils/composables.js";

defineProps({
  text: {
    required: true,
    type: String,
  }
})

const extendClass = ref('')

// const menuCollapsedRef = computed(() => menuCollapsed.value)
//
// if (menuCollapsedRef.value['left'] === false) {
//   extendClass.value = 'bottom-0.5'
// }

const isMobile = useIsMobile()
const isTablet = useIsTablet()

function change() {
  if (isMobile.value || isTablet.value) {
    extendClass.value = '-top-1'
  } else if (menuCollapsed.value['left'] === false) {
    extendClass.value = 'bottom-0.5'
  } else {
    extendClass.value = 'bottom-px2'
  }
}

watchEffect(() => change())

</script>

<style>
.bottom-px2 {
  bottom: 2px;
}
</style>