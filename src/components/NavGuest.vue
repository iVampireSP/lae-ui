<template>
  <nav class="navbar navbar-expand-md shadow-sm bg-body">
    <div class="container">
      <router-link class="navbar-brand text-auto lae-logo" to="/">
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="切换导航"
      >
        <span class="bi bi-list text-auto fs-1"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <!-- Left Side Of Navbar -->
        <MenuVue />

        <!-- Right Side Of Navbar -->
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a
              class="nav-link text-auto"
              target="_blank"
              href="https://forum.laecloud.com"
              >社区</a
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-auto" :to="{ name: 'servers' }"
              >状态</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-auto" :to="{ name: 'tasks' }"
              >任务</router-link
            >
          </li>
          <li class="nav-item">
            <router-link class="nav-link text-auto" :to="{ name: 'hosts' }"
              >主机</router-link
            >
          </li>

          <li class="nav-item" style="margin-left: 10px">
            <div
              class="btn btn-primary bg-reverse m-0 p-0"
              style="height: 41px"
            >
              <router-link class="nav-link text-reverse" :to="{ name: 'login' }"
                >加入莱云</router-link
              >
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
    import MenuVue from './Menu.vue';
</script>