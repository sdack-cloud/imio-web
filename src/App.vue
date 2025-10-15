<script setup lang="ts">

import {Sider, Text} from "view-ui-plus";
</script>

<template>
  <div class="app">
    <Sider v-if="false"  breakpoint="sm" width="80" :hide-trigger="true" :style="{position: 'fixed', height: '100vh',  left: 0, overflow: 'auto'}">
      <div class="flex flex-direction justify-center align-center" >
        <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
        <text class="text-black">首页</text>
      </div>
      <div class="flex flex-direction justify-center align-center" >
        <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
        <text class="text-black">首页</text>
      </div>
    </Sider>
    <router-view />
  </div>
</template>

<style scoped>
.ivu-layout-sider {
  min-width: 0;
  max-width: 30px;
}
</style>