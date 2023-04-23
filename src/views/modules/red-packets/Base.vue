<template>
    <router-view></router-view>

    <div class="mt-3 text-center">
        <n-p depth="3">
            此页面可能并不符合我们的设计观念。因为我们在匆忙中完成了这个页面，所以我们可能会在未来的版本中对其进行重构。
        </n-p>
    </div>
</template>

<script setup>
import {
    addMenuDivider,
    addMenuOptions,
    removeAllMenuOptions,
    removeAllMenuOptionsThen
} from "../../../plugins/menuOptions.js";
import {AddOutline} from "@vicons/ionicons5";
import redPacketsStore from "../../../plugins/stores/red-packets.js";
import {ref} from "vue";
import TextMenuIcon from "../../../components/icons/TextMenuIcon.vue";
import {NP} from 'naive-ui'

const redPackets = ref([])
removeAllMenuOptions()

redPacketsStore.dispatch('fetch')

function registerMenu() {
    removeAllMenuOptionsThen('left', () => {
        // addMenuOptions('left', 'modules.red-packets.index', '您发的红包', ListOutline)
        addMenuOptions('left', 'modules.red-packets.index', '发红包', AddOutline)

        if (redPackets.value.length > 0) {
            addMenuDivider('left')

            for (let i = 0; i < redPackets.value.length; i++) {
                const redPacket = redPackets.value[i]

                addMenuOptions('left', {
                    name: 'modules.red-packets.show', params: {id: redPacket.uuid}
                }, redPacket['greeting'] ?? '无', TextMenuIcon, {
                    text: (i + 1).toString()
                })
            }
        }

    })
}

// subscribe
redPacketsStore.subscribe((mutation, state) => {
    if (mutation.type === 'set') {
        redPackets.value = state.redPackets
    }

    registerMenu()
})

</script>