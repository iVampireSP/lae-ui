<template>
  <n-menu
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menuOptions"
  />
</template>

<script setup>

import {NMenu} from 'naive-ui'

import menuOptions  from "../config/menuOptions.js";

</script>