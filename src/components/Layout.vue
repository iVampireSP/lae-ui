<template>
  <main class="py-4">
    <div class="container mb-8">
      <!-- <slot /> -->
      <!-- <div v-show="tooManyRequests" class="alert alert-warning" role="alert">
        请求次数过多
      </div> -->

      <!-- Modal -->
      <div
        class="modal fade"
        id="error-modal"
        tabindex="-1"
        aria-labelledby="error-modal-title"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="error-modal-title">出了些问题。</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body" id="error-modal-content"></div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                好
              </button>
            </div>
          </div>
        </div>
      </div>

      <router-view />
    </div>
  </main>

  <!-- <div
    class="toast align-items-center text-white bg-primary border-0"
    role="alert"
    aria-live="assertive"
    aria-atomic="true"
    id="buttom-toast"
  >
    <div class="d-flex">
      <div class="toast-body">Hello, world! This is a toast message.</div>
      <button
        type="button"
        class="btn-close btn-close-white me-2 m-auto"
        data-bs-dismiss="toast"
        aria-label="Close"
      ></button>
    </div>
  </div> -->
</template>

<script>
  import http from '../api/http'
  import echo from '../plugins/echo'
  import store from '../plugins/store'

//   import { Toast } from 'bootstrap'

  import { ref, onMounted, onUnmounted } from 'vue'

  const tasks = ref([])

  function refresh() {
    http.get('/tasks').then((res) => {
      tasks.value = res.data
    })
  }

  refresh()

  const private_channel = `users.${store.state.user.id}`

  onMounted(() => {
    echo.private(private_channel).listen('.user', (e) => {
      console.log(e)
      refresh()
    })
  })

  onUnmounted(() => {
    echo.leave(private_channel)
  });
</script>

<style scoped>
  .mb-8 {
    margin-bottom: 8rem;
  }
</style>