<template>
<router-link class="btn btn-outline-primary" :to="{ name: 'modules.tunnels' }">
  返回到 隧道列表
</router-link>

<h3 class="mt-3">客户端下载</h3>

<table class="table table-responsive table-hover table-align">
      <thead>
        <tr>
          <th>类型</th>
          <th>架构</th>
          <th>下载地址</th>
          <th>下载</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Windows 图形启动器</td>
          <td>amd64</td>
          <td><code>http://cdn.114514.space/Download/Files/2.0.0/MEFrp_GUI_V1.0.1_Released.zip</code></td>
          <td><a href="http://cdn.114514.space/Download/Files/2.0.0/MEFrp_GUI_V1.0.1_Released.zip">点击下载</a></td>
        </tr>
        <tr>
          <td>Windows 启动器核心</td>
          <td>amd64</td>
          <td><code>https://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_windows_amd64.zip</code></td>
          <td><a href="https://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_windows_amd64.zip">点击下载</a></td>
        </tr>
        <tr>
          <td>Linux 启动器核心</td>
          <td>amd64</td>
          <td><code>https://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_linux_amd64.tar.gz</code></td>
          <td><a href="https://cdn.114514.space/Download/Files/2.0.0/frp_0.44.0_linux_amd64.tar.gz">点击下载</a></td>
        </tr>
      </tbody>
    </table>

</template>