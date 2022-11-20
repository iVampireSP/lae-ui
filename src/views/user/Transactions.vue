<template>
  <div>
    <h3>交易记录</h3>

    <div>
      交易记录，已经迁移到了 <a target="_blank" :href="url"> {{ url }}</a>
      <br />
      以后查看交易记录请都在上面的网站进行。
    </div>
  </div>
</template>

<script setup>
  //   import http from '../../api/http'
  //   import router from '../../plugins/router'

  import { ref } from 'vue'

  import api from '../../config/api'

  const url = ref('')
  url.value = api.auth + '/transactions'
</script>
