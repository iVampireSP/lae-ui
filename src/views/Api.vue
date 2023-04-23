<template>
    <IndexLayout>
        <n-h1 prefix="bar">
            <n-text type="primary">
                API 文档
            </n-text>
        </n-h1>
        <n-grid :cols="2" x-gap="12">
            <n-gi>
                <n-list hoverable>
                    <n-list-item>
                        <n-h3 class="!mt-5">
                            <n-a href="https://documenter.getpostman.com/view/18451533/2s8YRiKDkc" target="_blank">LAE
                                v3 API 文档
                            </n-a>
                        </n-h3>
                    </n-list-item>
                </n-list>
            </n-gi>
            <n-gi>
                <n-list hoverable>
                    <n-list-item>
                        <n-h3 class="!mt-5">
                            <n-a href="https://documenter.getpostman.com/view/18451533/2s8YRiKDke" target="_blank">LAE
                                v3 Remote API
                                文档
                            </n-a>
                        </n-h3>
                    </n-list-item>
                </n-list>
            </n-gi>
        </n-grid>
    </IndexLayout>
</template>

<script setup>
import {NA, NGi, NGrid, NH1, NH3, NList, NListItem, NText} from 'naive-ui'
import IndexLayout from "../components/menus/IndexLayout.vue";</script>

<style scoped>

</style>