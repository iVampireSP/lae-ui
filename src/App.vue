<template>
  <div>
    <Nav />
  </div>
  <div class="mt-5">
    <div class="background-container"></div>
    <!-- <Modals /> -->
    <Layout />
  </div>
</template>

<script setup>
  import Layout from './components/Layout.vue'
  import Nav from './components/Nav.vue'
import Modals from './components/Modals.vue';
  //   import app from './config/app'

  //   document.title = app.name

  //   get client height
  //   let clientHeight = document.documentElement.clientHeight

  //   //   when resize window
  //   window.onresize = () => {
  //     clientHeight = document.documentElement.clientHeight
  //   }
</script>

<style>
  .editable {
    border: 0;
    outline: 0;
    background: transparent;
    width: 100%;
  }
</style>