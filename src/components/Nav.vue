<template>
  <div v-show="show">
    <nav class="navbar navbar-expand-md shadow-sm bg-body">
      <div class="container">
        <router-link
          class="navbar-brand text-auto lae-logo"
          active-class="active"
          to="/"
        >
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
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'modules.tunnels' }"
                >镜缘映射</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'modules.gct' }"
                >游戏容器</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'modules.user-mqtt' }"
                >消息队列</router-link
              >
            </li>
            <!-- <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'modules.cdn' }"
                >内容分发</router-link
              >
            </li> -->
          </ul>

          <!-- Right Side Of Navbar -->
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'about' }"
                >关于定价</router-link
              >
            </li>
            <li class="nav-item">
              <a
                class="nav-link text-auto"
                target="_blank"
                href="https://forum.laecloud.com"
                >社区</a
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'servers' }"
                >状态</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'tasks' }"
                >任务</router-link
              >
            </li>

            <li class="nav-item">
              <a
                class="nav-link text-auto cursor-pointer"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasUserRight"
                aria-controls="offcanvasUserRight"
                @click.prevent="refresh_user()"
              >
                {{ store.state.user.name }}
                <i
                  class="bi bi-layout-sidebar-inset-reverse position-relative"
                  style="top: 0.5px"
                ></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </div>

  <div
    class="offcanvas offcanvas-end"
    tabindex="-1"
    id="offcanvasUserRight"
    aria-labelledby="offcanvasUserRightLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasUserRightLabel">
        {{ store.state.user.name }} # {{ store.state.user.id }}
      </h5>
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body position-relative">
      <div class="mt-3">
        <h4>财务</h4>
        <div>余额: {{ store.state.user.balance }} 元</div>
        <div>
          交易记录:
          <a target="_blank" class="link" :href="api.auth + '/transactions'">查看</a>
        </div>

        <div>
          充值余额:
          <a target="_blank" class="link" :href="api.auth + '/balances'">充值</a>
        </div>
      </div>

      <div class="mt-5" v-if="store.state.user.user_group_id">
        <h4>{{ store.state.user.user_group.name }}</h4>

        <p>
          享受 {{ store.state.user.user_group.discount }}% 的折扣
          <br />
          <span v-if="store.state.user.user_group.exempt"> 并且豁免计费 </span>
        </p>
      </div>

      <div class="mt-5">
        <h4>计费项目列表</h4>
        <router-link class="link" :to="{ name: 'hosts' }"
          >计费项目列表</router-link
        >
      </div>

      <div class="mt-5">
        <h4>您的工单</h4>
        <router-link class="link" :to="{ name: 'work-orders' }"
          >工单列表</router-link
        >
      </div>

      <div
        class="btn-group position-absolute rounded-0"
        style="bottom: 0; left: 0; right: 0"
      >
        <router-link
          class="btn btn-danger rounded-0"
          active-class="active"
          :to="{ name: 'login' }"
          >更换账号</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  //   import app from '../config/app'
  import http from '../api/http'
  import store from '../plugins/store'

  import api from '../config/api'

  const show = ref(true)
  if (store.state.token == null) {
    show.value = false
  }

  function refresh_user() {
    http.get('/users').then((res) => {
      store.commit('updateUser', res.data)
    })
  }

  setInterval(() => {
    refresh_user()
  }, 10000)
</script>
