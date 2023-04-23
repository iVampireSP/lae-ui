<template>
    <div>
        <n-h1 prefix="bar">
            <n-text type="primary">
                游戏容器
            </n-text>
        </n-h1>

        <ContainersList :containers="containers" :next="go"/>
    </div>
</template>

<script setup>
import {NH1, NText} from 'naive-ui'

import {computed} from 'vue'

import router from '../../../plugins/router'

import containerStore from "../../../plugins/stores/gct";
import ContainersList from "./components/Containers.vue";

// containerStore.dispatch('fetchGct')

const containers = computed(() => {
    return containerStore.state.containers
})

const go = (ct) => {
    router.push({
        name: 'modules.gct.show',
        params: {
            id: ct.host_id
        }
    })
}


</script>

