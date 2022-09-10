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
</template>
<!-- 
<script>
//   import { ref } from 'vue'

//   const tooManyRequests = ref(false)
</script> -->

<style scoped>
  .mb-8 {
    margin-bottom: 8rem;
  }
</style>