<template>
    <div>
        <n-alert title="游戏容器已迁移到 莱栈" type="info">
            莱云的游戏容器已迁移到莱栈，其中的一切都是互通的（包括账户，余额等）
            <br/>
            已经在 <n-a href="https://dash.laecloud.com" target="_blank">dash.laecloud.com</n-a> 订购的不受影响
            <br/>
            <n-button
                    href="https://stack.laecloud.com/order/gct/21"
                    tag="a"
                    target="_blank"
                    type="info"
                    class="!mt-2"
            >
                前往莱栈订购游戏容器
            </n-button>
        </n-alert>
    </div>
</template>

<script setup>
import {NButton, NAlert, NA} from 'naive-ui'
</script>

<style scoped>

</style>