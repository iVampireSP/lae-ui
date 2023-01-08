<template>
  <n-menu
      v-if="!menuHide.top"
      ref="menuInst"
      :collapsed-icon-size="22"
      :collapsed-width="64"
      :options="menuOptions.left"
      :value="selectedKey"
  />
</template>

<script setup>

import {NMenu} from 'naive-ui'

import {menuHide, menuInst, menuOptions, selectedKey} from "../config/menuOptions.js"

//
</script>