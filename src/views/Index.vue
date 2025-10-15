<template>
  <RouterView/>
  <FooterToolbar >
    <HomeFooterBar @jump="jump"/>
  </FooterToolbar>
</template>

<script setup lang="ts">
import {Footer, FooterToolbar} from "view-ui-plus";
import HomeFooterBar from "@/components/HomeFooterBar.vue";
import {useRouter} from "vue-router";
let router = useRouter();

function jump(pos: number) {
  switch (pos) {
    case 0:
      router.push('/')
      break;
    case 1:
      router.push('/dialog')
      break;
    case 2:
      router.push('/contact')
      break;
    case 3:
      router.push('/me')
      break;
    default:
      router.push('404')
  }
}
</script>


<style>
.ivu-footer-toolbar-right {
  float: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
<style scoped>

.ivu-footer-toolbar {
  z-index: 13;
  height: 65px;
  padding: 0 10px;
  background: #f5f7f9;
}

.footer-center {
  width: 100%;
}
</style>