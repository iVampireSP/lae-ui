<template>
  <IndexLayout>
    <n-h1 prefix="bar">
      <n-text type="primary">
        关于
      </n-text>
    </n-h1>
    <n-card class="mb-3" title="开发人员">
      <n-list hoverable>
        <n-list-item v-for="developer in developers">
          <template #prefix>
            <n-avatar :src="developer.avatar" round size="large"/>
          </template>
          <n-thing :title="developer.name" content-style="margin-top: 10px;"></n-thing>
        </n-list-item>
      </n-list>
    </n-card>
    <n-card class="mb-3" title="特别感谢">
      <n-list hoverable>
        <n-list-item v-for="people in special_thanks">
          <template #prefix>
            <n-avatar :src="people.avatar" round size="large"/>
          </template>
          <n-thing :title="people.name" content-style="margin-top: 10px;"></n-thing>
        </n-list-item>
      </n-list>
    </n-card>
    <n-card title="项目技术">
      <n-list hoverable>
        <n-list-item v-for="tech in techs">
          <n-h4 class="!mb-3 !mt-3">
            <n-a :href="tech.link" target="_blank">{{ tech.name }}</n-a>
          </n-h4>
        </n-list-item>
      </n-list>
    </n-card>
  </IndexLayout>
</template>

<script setup>
import IndexLayout from '../components/menus/IndexLayout.vue'
import api from '../config/api.js'
import {NA, NAvatar, NCard, NH1, NH4, NList, NListItem, NText, NThing} from 'naive-ui'

const developers = [
  {
    name: 'kingc',
    avatar: api.avatar + '713386fbb7217bdec42c0774cb59b3cf?s=256?cache=0'
  },
  {
    name: 'iVampireSP',
    avatar: api.avatar + '9116fc3de8f9a46668beb1a6b7dbcbcd?s=256?cache=0'
  },
  {
    name: 'Aehxy',
    avatar: api.avatar + '6982c9af25b384d1640eebade61b3c03?s=256?cache=0'
  },
  {
    name: 'SakuraPuare',
    avatar: api.avatar + 'e1d8d57a0cfea1b05d412eb48e29188d?s=256?cache=0'
  },
  {
    name: '罗澜',
    avatar: api.avatar + '11c49db21a3ccbff70b33629525388a8?s=256?cache=0'
  },
  {
    name: 'iruanp',
    avatar: api.avatar + 'd57ed036f1f47b897f477aa4a1028f2c?s=256?cache=0'
  }
]

const special_thanks = [
  {
    name: 'Fofray',
    avatar: api.avatar + 'b492de7a78383a5d338699361392a588?s=256?cache=0'
  }
]

const techs = [
  {
    name: 'Vue 3',
    link: 'https://cn.vuejs.org/'
  },
  {
    name: 'Naive UI',
    link: 'https://www.naiveui.com/'
  },
  {
    name: 'Vue Router',
    link: 'https://next.router.vuejs.org/'
  },
  {
    name: 'Axios',
    link: 'https://axios-http.com/'
  },
  {
    name: 'Xterm',
    link: 'https://xtermjs.org/'
  },
  {
    name: 'Vue Axios',
    link: 'https://www.npmjs.com/package/vue-axios'
  },
  {
    name: 'ECharts',
    link: 'https://echarts.apache.org/zh/index.html'
  },
  {
    name: 'Highlight.js',
    link: 'https://highlightjs.org/'
  },
  {
    name: '@kangc/v-md-editor',
    link: 'https://www.npmjs.com/package/@kangc/v-md-editor'
  },
  {
    name: '@vicons/ionicons5',
    link: 'https://www.npmjs.com/package/@vicons/ionicons5'
  },
  {
    name: '@vicons/material',
    link: 'https://www.npmjs.com/package/@vicons/material'
  },
  {
    name: 'humanize-plus',
    link: 'https://www.npmjs.com/package/humanize-plus'
  },
  {
    name: 'js-md5',
    link: 'https://www.npmjs.com/package/js-md5'
  },
  {
    name: 'lottie-web',
    link: 'https://www.npmjs.com/package/lottie-web'
  },
  {
    name: 'Tailwind CSS',
    link: 'https://tailwindcss.com/'
  },
  {
    name: 'Vuex',
    link: 'https://vuex.vuejs.org/'
  },
  {
    name: 'laravel-echo',
    link: 'https://www.npmjs.com/package/laravel-echo'
  },
  {
    name: 'pusher-js',
    link: 'https://www.npmjs.com/package/pusher-js'
  }
]

// developers.sort(() => Math.random() - 0.5);
// special_thanks.sort(() => Math.random() - 0.5);
// techs.sort(() => Math.random() - 0.5);
developers.sort((a, b) => a.name.localeCompare(b.name));
special_thanks.sort((a, b) => a.name.localeCompare(b.name));
techs.sort((a, b) => a.name.localeCompare(b.name));
</script>

<style scoped>

</style>