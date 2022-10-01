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
          </ul>

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
              <router-link
                class="nav-link text-auto"
                active-class="active"
                :to="{ name: 'servers' }"
                >服务器状态</router-link
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
              >
                {{ store.state.user.name }}
                <i
                  class="bi bi-layout-sidebar-inset-reverse position-relative"
                  style="top: 0.5px"
                ></i>
              </a>
            </li>

            <!-- <li class="nav-item dropdown">
              <a
                id="navbarDropdown"
                class="nav-link dropdown-toggle text-auto"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{ store.state.user.name }}
              </a>

              <div
                class="dropdown-menu dropdown-menu-right"
                aria-labelledby="navbarDropdown"
              >
                <span class="dropdown-item text-auto"
                  >余额: {{ store.state.user.balance }} 元</span
                >
                <span class="dropdown-item text-auto"
                  >Drops: {{ drops.drops ?? 0 }} Drops</span
                >
                <span class="dropdown-item text-auto"
                  >本月消耗: {{ drops.monthly_usages ?? 0 }} Drops</span
                >

                <router-link
                  class="dropdown-item text-auto"
                  active-class="active"
                  :to="{ name: 'hosts' }"
                  >计费项目列表</router-link
                >
                <router-link
                  class="dropdown-item text-auto"
                  active-class="active"
                  :to="{ name: 'login' }"
                  >更换账号</router-link
                >
              </div>
            </li> -->
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

        <div>Drops: {{ drops.drops ?? 0 }} Drops</div>

        <div>本月消耗: {{ drops.monthly_usages ?? 0 }} Drops</div>
        <div>
          交易记录:
          <router-link class="text-auto" :to="{ name: 'billing.transactions' }"
            >浏览列表</router-link
          >
        </div>

        <div>
          充值余额:
          <router-link class="text-auto" :to="{ name: 'billing.charge' }"
            >充值</router-link
          >
        </div>
      </div>

      <div class="mt-5">
        <h4>计费项目列表</h4>
        <router-link class="text-auto" :to="{ name: 'hosts' }"
          >计费项目列表</router-link
        >
      </div>

      <div class="mt-5">
        <h4>您的工单</h4>
        <router-link class="text-auto" :to="{ name: 'work-orders' }"
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

const drops = ref({})

http.get('/balances/drops').then((res) => {
    drops.value = res.data
})

const show = ref(true)
if (store.state.token == null) {
    show.value = false
}
</script>