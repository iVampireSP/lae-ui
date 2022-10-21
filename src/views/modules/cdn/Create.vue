<template>
  <div>
    <h3>创建 CDN 服务</h3>

    <h3>选择地域</h3>

    <select class="form-control" v-model="cdn.package_id">
      <option value="0" selected>先选择一个地域</option>
      <option v-for="(value, key) in packages" :value="key">
        {{ value.name }}
      </option>
    </select>

    <!-- 当 数组中存在 package id 存在时显示 -->
    <div v-if="packages[cdn.package_id] !== null">
      <div v-if="packages[cdn.package_id]">
        <span>免费流量: {{ packages[cdn.package_id].free }} GB</span>
        <br />
        <span>流量: {{ packages[cdn.package_id].price }} 元 / GB</span>
      </div>
    </div>

    <div class="form-floating mb-3 mt-3">
      <input class="form-control" id="floatingDomain" v-model="cdn.domain" />
      <label for="floatingDomain">域名</label>
    </div>

    <div class="form-floating mb-3">
      <input class="form-control" id="floatingBackend" v-model="cdn.backend" />
      <label for="floatingName">后端地址</label>
    </div>

    <!-- submit btn -->
    <button class="btn btn-primary" @click="create">创建</button>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import http from '../../../api/http'
  import route from '../../../plugins/router'

  const cdn = ref({
    domain: '',
  })

  const packages = ref({})

  http.get('/modules/cdn/packages').then((res) => {
    packages.value = res.data

    // get first key
    cdn.value.package_id = Object.keys(res.data)[0]
  })

  function create() {
    http
      .post('/modules/cdn/hosts', cdn.value)
      .then((res) => {
        // if status is 200
        if (res.status === 200) {
          // redirect to cdn list
          route.push({ name: 'modules.cdn' })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
</script>
