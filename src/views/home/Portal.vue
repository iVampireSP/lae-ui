<template>
    <div class="flex items-center align-center justify-center h-full">
        <div class="text-center">
            <img v-if="osThemeRef === 'dark'" alt="laestack"
                 class="m-auto"
                 src="https://stack.laecloud.com/templates/lagom2/assets/img/logo/logo_big_inverse.1354344624.png"
                 width="128"/>
            <img v-else alt="laestack" class="m-auto" src="/assets/lae-dark.png"
                 width="128"/>
            <div class="mt-5 !ml-2">
                <n-h1>
                    PortIO / 镜缘映射，马上回来。
                </n-h1>
                <n-p>
                    VPN 执照已下发，我们将在手续完成后继续为您提供服务。
                </n-p>
            </div>
            <br/>
            <n-button v-if="!isLogin" type="primary" @click="login">
                登录
            </n-button>


            <n-button class="!ml-2" href="https://stack.laecloud.com" tag="a" target="_blank" type="primary">
                前往莱栈
            </n-button>

        </div>
    </div>


</template>

<script setup>
import {NButton, NH1, NInput, NModal, useOsTheme} from 'naive-ui'
import {computed, ref} from "vue";
import http from '../../plugins/http'
import appStore from '../../plugins/stores/app'
import userStore from '../../plugins/stores/user'
import router from "../../plugins/router.js";

const show = ref(false)

const isLogin = computed(() => {
    return userStore.state.token
})


const feedback = computed(() => {
    return appStore.state.display_feedback && userStore.state.token
})

const osThemeRef = useOsTheme();


const form = ref({
    title: '对你们说的话',
    content: ''
})


function login() {
    router.push({
        name: 'auth.login'
    })
}


</script>
