<template>
  tunnel index
</template>

<script setup>


import http from "../../../plugins/http.js";

http.get('/modules/frp/hosts').then((res) => {
  console.log(res)
})


</script>

<style scoped>

</style>