<template>
  <div>
    <GctIntroVue />
  </div>

  <a href="https://forum.laecloud.com/d/73-wo-men-ke-yi-yin-dao-chuang-jian-fu-wu-qi-liao" class="d-block mt-3" target="_blank">反馈此向导</a>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../api/http'

  import route from '../plugins/router'

  import GctIntroVue from '../components/GctIntro.vue'

  const gct = ref({
    name: 'MC 原版服务器',
    cpu_limit: 100,
    memory: 1024,
    disk: 10240,
    databases: 0,
    allocations: 1,
    backups: 1,
    egg_id: 3,
    location_id: 3,
  })

  const showProgress = ref(false)
  const progress = ref(0)

  function setGct(name, cpu_limit, memory, egg_id) {
    gct.value.cpu_limit = cpu_limit
    gct.value.memory = memory
    gct.value.egg_id = egg_id
    gct.value.name = name

    let inter = setInterval(() => {
      progress.value += 1

      if (progress.value >= 90) {
        clearInterval(inter)
      }
    }, 50)

    http
      .post('/modules/gct/hosts', gct.value)
      .then((res) => {
        clearInterval(inter)
        progress.value = 100

        setTimeout(() => {
          showProgress.value = false
          progress.value = 0

          route.push({
            name: 'modules.gct',
          })
        }, 5000)
      })
      .catch((err) => {
        console.log(err)
        alert('创建失败')
      })

    showProgress.value = true
  }
</script>
