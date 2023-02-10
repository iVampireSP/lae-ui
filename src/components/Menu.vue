<template>
  <n-menu
      ref="menuInst"
      :collapsed-icon-size="22"
      :collapsed-width="64"
      :options="menuOptions.left"
      :value="selectedKey"
  />
</template>

<script setup>

import {NMenu} from 'naive-ui'

import {menuInst, menuOptions, selectedKey} from "../plugins/menuOptions.js"

//
</script>