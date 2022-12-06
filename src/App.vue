<template>
  <div>
    <Nav />
  </div>
  <div>
    <div class="background-container text-center d-none" id="bg-container">
      <div class="bg-center">
       
      </div>
    </div>
    <!-- <Modals /> -->
    <Layout />
  </div>
</template>

<script setup>
  import Layout from './components/Layout.vue'
  import Nav from './components/Nav.vue'

  // import Modals from './components/Modals.vue';
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
  .background-container {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 2;
    background: black;
  }

  .bg-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .editable {
    border: 0;
    outline: 0;
    background: transparent;
    width: 100%;
  }
</style>
