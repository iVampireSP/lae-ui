<template>
    <div>
        <n-h1 align-text prefix="bar">
            <n-gradient-text>
                {{ gct.name }}
            </n-gradient-text>
        </n-h1>
        <n-grid cols="1 xl:7 " responsive="screen">
            <n-gi span="5 1">
                <n-h3 class="!mb-0">
                    <n-a
                            :href=" api.modules.gct.panel  + '/server/' + gct.server.identifier"
                            tag="a"
                            target="_blank"
                            type="primary"
                    >
                        控制面板
                        <n-icon>
                            <OpenOutline/>
                        </n-icon>
                    </n-a>
                </n-h3>

                <div class="mt-5 mb-5">
                    <n-h3 class="mb-1">电源控制</n-h3>

                    <n-button-group v-if="ct">
                        <n-button :disabled="ct.state.current === 'running' || ct.state.current === 'starting'"
                                  secondary strong
                                  type="info"
                                  @click="ct.setState('start')">
                            开机
                        </n-button>
                        <n-button v-if="ct.state.current === 'running' || ct.state.current === 'starting' " secondary
                                  strong
                                  type="error"
                                  @click="ct.setState('stop')">
                            停止
                        </n-button>
                        <n-button v-else-if="ct.state.current === 'stopping'" secondary strong type="error"
                                  @click="ct.setState('kill')">
                            强制停止
                        </n-button>
                        <n-button v-else disabled secondary strong type="error">
                            停止
                        </n-button>
                        <n-button v-if="ct.state.current === 'running' || ct.state.current === 'starting' " secondary
                                  strong
                                  type="warning"
                                  @click="ct.setState('restart')">
                            重启
                        </n-button>
                        <n-button v-else disabled secondary strong type="warning">
                            重启
                        </n-button>
                    </n-button-group>

                    <p v-else class="mr-2">
                        切换到“控制台”选项卡以查看电源控制。
                    </p>
                </div>

                <div v-if="ct && ct.stats">

                    <div>
                        <n-h3 class="!mb-0 !mt-2">CPU 使用率</n-h3>
                        <span>
              {{ ct.stats.cpu_absolute }}% / {{ gct.cpu_limit }}%
            </span>
                    </div>

                    <div>
                        <n-h3 class="!mb-0 !mt-2">内存 使用率</n-h3>
                        <span>
              {{ Humanize.fileSize(ct.stats.memory_bytes) }} / {{ Humanize.fileSize(ct.stats.memory_limit_bytes) }}
            </span>
                    </div>

                    <div>
                        <n-h3 class="!mb-0 !mt-2">存储 使用率</n-h3>
                        <span>
              {{ Humanize.fileSize(ct.stats.disk_bytes) }} / {{ gct.disk / 1024 }} GB
            </span>
                    </div>

                    <!--          <span v-text="ct.stats"></span>-->

                </div>

                <div class="mt-5">
                    <n-h3 class="!mb-0">
                        销毁
                    </n-h3>

                    <n-popconfirm
                            @positive-click="destroy"
                    >
                        <template #trigger>
                            <n-button size="small" type="error">
                                销毁
                            </n-button>
                        </template>
                        此服务器将会永久删除，你确定要这么做吗？
                    </n-popconfirm>

                </div>

            </n-gi>
            <n-gi span="6">
                <n-tabs animated type="line">
                    <n-tab-pane name="console" tab="控制台">
                        <Terminal v-if="gct.host_id" ref="ct" :gct_id="gct.host_id" :height="90" class="text-left"/>
                    </n-tab-pane>

                    <n-tab-pane name="advanced" tab="调整">

                        <n-spin :show="modifying">
                            <n-grid cols="1 s:2" responsive="screen" x-gap="12">
                                <n-gi>
                                    <n-form-item label="容器名称" path="name">
                                        <n-input v-model:value="gct.name"/>
                                    </n-form-item>

                                    <n-form-item label="要开的服务器" path="egg_id">
                                        <n-select v-model:value="gct.egg_id" :options="eggs"/>

                                    </n-form-item>

                                    <n-form-item label="端口数量">
                                        <n-slider v-model:value="gct.allocations" :default-value="1"
                                                  :format-tooltip="formatCommonTooltip"
                                                  :max="10" :min="1"
                                                  :show-tooltip="gct.allocations > 3" :step="1"/>
                                    </n-form-item>

                                    <n-form-item label="数据库数量">
                                        <n-slider v-model:value="gct.databases" :default-value="gct.databases"
                                                  :format-tooltip="formatCommonTooltip" :max="5" :min="0"
                                                  :show-tooltip="gct.databases > 1" :step="1"/>
                                    </n-form-item>

                                </n-gi>
                                <n-gi>
                                    <n-form-item label="内存">
                                        <n-slider v-model:value="gct.memory" :default-value="1024"
                                                  :format-tooltip="formatTooltip"
                                                  :max="32768" :min="512"
                                                  :show-tooltip="gct.memory > 8192" :step="512"/>
                                    </n-form-item>
                                    <n-form-item label="CPU 限制">
                                        <n-slider v-model:value="gct.cpu_limit" :default-value="100"
                                                  :format-tooltip="formatCpuLimitTooltip"
                                                  :max="800" :min="100"
                                                  :show-tooltip="gct.cpu_limit > 400" :step="50"/>
                                    </n-form-item>
                                    <n-form-item label="存储大小">
                                        <n-slider v-model:value="gct.disk" :default-value="512"
                                                  :format-tooltip="formatDiskTooltip"
                                                  :max="65536" :min="512"
                                                  :show-tooltip="gct.disk > 4096" :step="512"/>
                                    </n-form-item>
                                    <n-form-item label="备份数量">
                                        <n-slider v-model:value="gct.backups" :default-value="1"
                                                  :format-tooltip="formatCommonTooltip"
                                                  :max="20" :min="1"
                                                  :show-tooltip="gct.backups > 3" :step="1"/>
                                    </n-form-item>
                                </n-gi>
                            </n-grid>

                            <div class="text-right mt-3 mr-1 mb-1">
                                <n-button ghost type="primary" @click="update()">保存</n-button>
                            </div>
                        </n-spin>
                    </n-tab-pane>

                    <n-tab-pane class="mb-2" name="boot_template" tab="启动模板">
                        <n-select v-model:value="gct.egg_id" :options="eggs"/>

                        <div class="text-right mt-3">
                            <n-button ghost type="primary" @click="update({
                egg_id: gct.egg_id
              })">保存
                            </n-button>
                        </div>
                    </n-tab-pane>
                </n-tabs>

            </n-gi>
        </n-grid>
    </div>
</template>

<script setup>
import {ref} from 'vue'
import {
    NA,
    NButton,
    NButtonGroup,
    NFormItem,
    NGi,
    NGradientText,
    NGrid,
    NH1,
    NH3,
    NIcon,
    NInput,
    NPopconfirm,
    NSelect,
    NSlider,
    NSpin,
    NTabPane,
    NTabs,
    useDialog,
    useMessage
} from 'naive-ui'

import {OpenOutline} from "@vicons/ionicons5";


import Terminal from './components/Terminal.vue'
import gateway from '../../../plugins/gateway'
import {useRoute} from "vue-router";
import api from '../../../config/api'
import Humanize from "humanize-plus";
import route from "../../../plugins/router";

const router = useRoute()

const modifying = ref(false)

const nests = ref([])
const eggs = ref([])

const message = useMessage()
const dialog = useDialog()

const gct = ref({
    name: '',
    server_id: '',
    price: '',
    egg_id: '',
    memory: 1024,
    disk: 1024,
    cpu_limit: 100,
    allocations: 1,
    backups: 1,
    databases: 0,
    server: {
        identifier: ''
    }
})

const ct = ref(null)

const formatTooltip = (value) => `${value / 1024} GB`
const formatCpuLimitTooltip = (value) => `相当于 ${value / 100} 核`
const formatDiskTooltip = (value) => {
    return Humanize.fileSize(value * 1024 * 1024)
}
const formatCommonTooltip = (value) => `${value} 个`


// http.get('/modules/gct/hosts/' + router.params.id).then((res) => {
//   gct.value = res.data
// })

gateway.get('gct/hosts/' + router.params.id).then(res => {
    gct.value = res.data
})

// http.get('/modules/gct/nests').then((res) => {
//
// }).then(() => {
//   // 先预先选择
// })

gateway.get('gct/nests').then(res => {
    nests.value = res.data

    for (let nest in nests.value) {
        nest = nests.value[nest]

        eggs.value.push({
            label: nest.name,
            disabled: true
        })

        // push eggs
        for (let egg in nest['eggs']) {
            egg = nest['eggs'][egg]

            eggs.value.push({
                label: egg.name,
                value: egg.egg_id,
                disabled: false
            })
        }
    }

    //gct.value.egg_id = eggs.value[1].value

})


function update() {
    modifying.value = true
    // http.patch('/modules/gct/hosts/' + router.params.id, gct.value).finally(() => {
    //   modifying.value = false
    // })

    gateway.patch('gct/hosts/' + router.params.id, gct.value).then(() => {
        modifying.value = false
    })
}

function destroy() {
    modifying.value = true
    gateway.delete('gct/hosts/' + router.params.id).then(() => {
        modifying.value = false

        route.push({
            name: 'modules.gct.index'
        })
    })
}


</script>
