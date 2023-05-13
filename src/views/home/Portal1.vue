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
                    莱栈, 现已可用
                </n-h1>
            </div>
            <br/>
            <n-button v-if="!isLogin" type="primary" @click="login">
                登录
            </n-button>


            <n-button class="!ml-2" href="https://stack.laecloud.com" tag="a" target="_blank" type="primary">
                前往莱栈
            </n-button>

            <n-button v-if="!feedback && isLogin" class="!ml-2" type="primary" @click="open">
                打开反馈
            </n-button>

        </div>
    </div>


    <n-modal v-model:show="feedback"
             :mask-closable="true"
             negative-text="关闭"
             positive-text="提交"
             preset="dialog"
             title="对我们说的话"
             @positive-click="submit"
             @negative-click="close"
    >

        <div>
            <n-input
                    v-model:value="form.content"
                    :autosize="{
            minRows: 6,
            maxRows: 9
          }"
                    placeholder="比如...您想要什么功能，或者您遇到了什么问题，或者您有什么建议。我们会通过工单与您取得联系。"
                    type="textarea"
            />
        </div>
    </n-modal>

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

function submit() {
    return http.post('work-orders', form.value).then(res => {
        console.log(res)
    }).finally(() => {
        close()
    })

}

function close() {
    appStore.commit('set_display_feedback', false)
}

function open() {
    appStore.commit('set_display_feedback', true)
}

function login() {
    router.push({
        name: 'auth.login'
    })
}


</script>
