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
import {getCurrentInstance, onActivated, onDeactivated, onMounted} from "vue";

import Cookies from 'js-cookie';
import {User, useUserStore} from "@/stores/user.ts";

import {IMIOClient, IMIOClientConnectStatus,IMIOMessage} from 'imio-sdk-lite'


let userStore = useUserStore();
let router = useRouter();
let appStore  = useAppStore();
let instance = getCurrentInstance();

let imioClient = IMIOClient.getInstance();

appStore.windowMedia.innerHeight = window.innerWidth+""
appStore.windowMedia.innerHeight = window.innerHeight+""

window.addEventListener('resize', (e: any) => {
  appStore.windowMedia.innerHeight = e.target.innerHeight+"";
  appStore.windowMedia.innerWidth = e.target.innerWidth+"";

  instance?.proxy?.$Message.info("Height:"+e.target.innerHeight)
  console.log('innerHeight',appStore.windowMedia.innerHeight)
  console.log('innerWidth',appStore.windowMedia.innerWidth)
})


onMounted(() => {
  console.warn('Index onMounted');
  let token = Cookies.get("token");
  if (token) {
    let splitToken = token.split(' ');
    imioClient.setToken(splitToken[1]);
    let payload = getJwtPayload(splitToken[1]);
    let user :User = {id: payload.account,name:payload.nickname ,email:"",avatar:""}
    userStore.user = user;

    if (imioClient.isClose()) {
      imioClient.connect(user.id,splitToken[1],user.name,clientListener)
    }
  }
  imioClient.messageListener.push(messageListener);
});

const messageListener = {
  onMessage(message: IMIOMessage): void {
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
  }, onNotice(message: IMIOMessage): void {
  }
};
const clientListener = {
  onConnectStatus(status: IMIOClientConnectStatus, retry: number): void {
    console.log('onConnectStatus',status,retry);
  }, onConnected(): void {
    console.log('onConnected')
    let userInfo = imioClient.getUserInfo();
    if (userStore.user) {
      userStore.user!!.avatar = userInfo.avatar;
    }
  }, onDisconnected(): void {
    console.log('onDisconnected')
  }, onTokenExpired(): void {
    console.log('onTokenExpired')
  }
}

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