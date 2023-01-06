<template>
  <n-menu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions.left"
      :value="selectedKey"
      ref="menuInst"
  />
</template>

<script setup>

import {NMenu} from 'naive-ui'

import {menuInst, menuOptions, selectedKey} from "../config/menuOptions.js"

//
</script>