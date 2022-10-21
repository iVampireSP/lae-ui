<template>
  <div>
    <div v-if="site">
      <span v-if="site.sync_state == 'done'">
        <span class="badge bg-success">已同步</span>
      </span>
      <span v-else-if="site.sync_state == 'syncing'">
        <span class="badge bg-warning">同步中</span>
      </span>

      <div v-if="host">
        <h3 v-text="host.name"></h3>
      </div>

      <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link active"
            id="pills-basic-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-basic"
            type="button"
            role="tab"
            aria-controls="pills-basic"
            aria-selected="true"
          >
            基本配置
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-cache-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-cache"
            type="button"
            role="tab"
            aria-controls="pills-feature"
            aria-selected="false"
          >
            缓存配置
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            id="pills-template-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-template"
            type="button"
            role="tab"
            aria-controls="pills-template"
            aria-selected="false"
          >
            重设模板
          </button>
        </li>
      </ul>
      <div class="tab-content" id="pills-tabContent">
        <div
          class="tab-pane fade show active"
          id="pills-basic"
          role="tabpanel"
          aria-labelledby="pills-basic-tab"
        >
          <div class="row row-cols-3 w-75">
            <div class="col">CNAME</div>
            <div class="col">
              <span
                v-text="
                  site.cname_hostname +
                  '.' +
                  site.cname_hostname2 +
                  '.' +
                  site.cname_domain
                "
              ></span>
            </div>
          </div>

          <div class="row row-cols-3 w-75">
            <div class="col">HTTP 端口</div>
            <div class="col">
              <input type="text" v-model="site.http_listen.port" />
            </div>
          </div>
        </div>
      </div>

      <div
        class="tab-pane fade"
        id="pills-cache"
        role="tabpanel"
        aria-labelledby="pills-cache-tab"
      >
        2
      </div>
    </div>

    <div class="mt-3">
      <button class="btn btn-primary" @click="update">保存</button>
    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import http from '../../../api/http'

  //   const site = ref({
  //     host: {
  //       name: '',
  //     },
  //     site: {
  //       sync_state: '',
  //     },
  //   })

  const host = ref({})
  const site = ref(false)

  const router = useRoute()

  http.get('/modules/cdn/hosts/' + router.params.id).then((res) => {
    site.value = res.data.site
    host.value = res.data.host
  })


  function update() {
    http
      .put('/modules/cdn/hosts/' + router.params.id, site.value)
      .then((res) => {
        console.log(res)
      })
  }
</script>
