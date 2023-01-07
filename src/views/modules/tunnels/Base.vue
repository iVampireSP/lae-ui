<template>
  <router-view></router-view>
</template>

<script setup>
import {addMenuOptions} from "../../../config/menuOptions.js";

import {ListOutline,AddOutline} from "@vicons/ionicons5";

addMenuOptions('left', 'modules.tunnels.index', '所有隧道', ListOutline)
addMenuOptions('left', 'modules.tunnels.create', '新建隧道',AddOutline)


</script>

<style scoped>

</style>