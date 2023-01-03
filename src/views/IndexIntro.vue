<template>
  <div>
    <div class="animate__animated animate__fadeIn">
      <h2>镜缘映射</h2>
      现在支持了 “停止隧道”
      功能，您可以使用此功能直接踢下线客户端并阻止新的连接。<br />
      此功能现在可以在 隧道 页面中找到。
      <h4 class="mt-4">在找引导创建服务器吗？</h4>
      <p>
        <router-link
          :to="{ name: 'modules.gct.intro' }"
          >快速开始
        </router-link>
      </p>
    </div>
  </div>
</template>

<!-- <script setup>
import {onUnmounted, ref} from 'vue'
import http from '../api/http'

</script> -->
