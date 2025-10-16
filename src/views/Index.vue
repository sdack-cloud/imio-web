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
import {useAppStore} from "@/stores/app.ts";
import {getCurrentInstance} from "vue";
let router = useRouter();
let appStore  = useAppStore();
let instance = getCurrentInstance();

appStore.windowMedia.innerHeight = window.innerWidth+""
appStore.windowMedia.innerHeight = window.innerHeight+""

window.addEventListener('resize', (e: any) => {
  appStore.windowMedia.innerHeight = e.target.innerHeight+"";
  appStore.windowMedia.innerWidth = e.target.innerWidth+"";

  instance?.proxy?.$Message.info("Height:"+e.target.innerHeight)
  console.log(appStore.windowMedia.innerHeight)
  console.log(appStore.windowMedia.innerWidth)


})
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