<template>
  <main class="py-4">
    <div class="container mb-8">
      <!-- <slot /> -->
      <!-- <div v-show="tooManyRequests" class="alert alert-warning" role="alert">
        请求次数过多
      </div> -->
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