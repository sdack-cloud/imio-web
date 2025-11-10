<template>
  <RouterView/>
  <FooterToolbar >
    <HomeFooterBar @jump="jump" :index="appStore.homeIdx"/>
  </FooterToolbar>
</template>

<script setup lang="ts">
import {Footer, FooterToolbar} from "view-ui-plus";
import HomeFooterBar from "@/components/HomeFooterBar.vue";
import {useRouter,useRoute} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {computed, getCurrentInstance, onActivated, onDeactivated, onMounted, ref} from "vue";


import {IMIOClient, IMIOClientConnectStatus,IMIOMessage} from 'imio-sdk-lite'
import {User, useUserStore} from "@/stores/user.ts";
import Cookies from 'js-cookie';


let router = useRouter();
let route = useRoute();
let appStore  = useAppStore();
let instance = getCurrentInstance();
let userStore = useUserStore();

let imioClient = IMIOClient.getInstance();



onMounted(() => {
  let token = Cookies.get("token");
  if (token) {
    let splitToken = token.split(' ');
    imioClient.setToken(splitToken[1]);
    let payload = getJwtPayload(splitToken[1]);
    let user :User = {id: payload.account,name:payload.nickname ,email:"",avatar:""}
    userStore.user = user;


    if (imioClient.isClose()) {
      if (imioClient.connectStatus <= IMIOClientConnectStatus.CONNECTING) {
        imioClient.connect(user.id,splitToken[1],user.name)
      }
    }
  }
});

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

function  getJwtPayload(token:string): Object {
  // 分割JWT的三个部分
  const parts = token.split('.');
  // 解码JWT的第二部分（负载部分）
  const payload = parts[1];
  // 将Base64编码的负载解码回正常字符串
  const decodedPayload = atob(payload);
  // 解析为JSON对象
  return JSON.parse(decodedPayload);
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