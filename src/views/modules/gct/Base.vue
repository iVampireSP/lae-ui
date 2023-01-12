<template>
  <router-view></router-view>
</template>

<script setup>
import {
  addMenuDivider,
  addMenuOptions,
  removeAllMenuOptions,
  removeAllMenuOptionsThen
} from '../../../config/menuOptions.js'

import {AddOutline, ListOutline} from "@vicons/ionicons5";
import {ref} from 'vue'
import gctStore from '../../../plugins/stores/gct'
import MenuIcon from "../../../components/icons/HostMenuIcon.vue";

const containers = ref([])
const gct = ref([])

removeAllMenuOptions()

gctStore.dispatch('fetchGct')

function reRegisterMenu() {
  removeAllMenuOptionsThen('left', () => {
    addMenuOptions('left', 'modules.gct.index', '所有容器', ListOutline)
    addMenuOptions('left', 'modules.gct.create', '新建容器', AddOutline)

    if (containers.value.length > 0) {
      addMenuDivider('left')

      for (let i = 0; i < containers.value.length; i++) {
        const container = containers.value[i]

        addMenuOptions('left', {
          name: 'modules.gct.show', params: {id: container.host_id}
        }, container.name, MenuIcon, {
          host: container
        })
      }
    }
  })
}

// subscribe
gctStore.subscribe((mutation, state) => {
  if (mutation.type === 'setGct') {
    containers.value = state.containers
  }

  reRegisterMenu()
})
</script>
