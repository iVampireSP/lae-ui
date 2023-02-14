<template>
  <router-view></router-view>


</template>

<script setup>
import {addMenuOptions, removeAllMenuOptions, removeAllMenuOptionsThen} from "../../../plugins/menuOptions.js";
import {AddOutline, ListOutline} from "@vicons/ionicons5";
import IpStore from "../../../plugins/stores/ips.js";
import {ref} from "vue";

const ips = ref([])
removeAllMenuOptions()

IpStore.dispatch('fetch')

removeAllMenuOptionsThen('left', () => {
  addMenuOptions('left', 'modules.ip-manager.index', '列表', ListOutline)
  addMenuOptions('left', 'modules.ip-manager.create', '申请', AddOutline)
  addMenuOptions('left', 'modules.ip-manager.forward', '转发', AddOutline)
})

</script>