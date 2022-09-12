<template>
  <div
    class="modal modal-dialog-centered fade"
    id="tokenExpiredModal"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    tabindex="-1"
    aria-labelledby="tokenExpiredLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="tokenExpiredLabel">密钥已失效</h5>
        </div>
        <div class="modal-body">
          您必须重新登录才能继续使用 莱云 Web 客户端。
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="toLogin()"
          >
            重新登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import store from '../plugins/store'
  import router from '../plugins/router'

  function toLogin() {
    store.commit('updateToken', {
      token: null,
    })
    router.push({ name: 'login' })
  }
</script>
