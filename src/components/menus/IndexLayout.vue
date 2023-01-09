<template>
  <div>
    <slot/>
  </div>
</template>

<script setup>

import {addMenuOptions, removeAllMenuOptionsThen} from "../../config/menuOptions.js";

removeAllMenuOptionsThen('left', () => {

// 注册菜单
  addMenuOptions('left', 'index', 'Index',)
  addMenuOptions('left', 'announcements', '公告')
  addMenuOptions('left', 'pinned', '固钉')
})


</script>

<style scoped>

</style>