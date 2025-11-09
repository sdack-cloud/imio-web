<script setup lang="ts">
import Cookies from 'js-cookie';
import {Sider, Text} from "view-ui-plus";
import {IMIOClient, IMIOClientConnectStatus,IMIOMessage,
  IMIOContactManager,
  IMIOGroupManager,
  IMIOChatManager,
  IMIOUserInfoManager
} from 'imio-sdk-lite'
import {User, useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {getCurrentInstance, onMounted} from "vue";
let imioClient = IMIOClient.getInstance();
IMIOGroupManager.getInstance().setClient(imioClient)
IMIOContactManager.getInstance().setClient(imioClient)
IMIOChatManager.getInstance().setClient(imioClient)
IMIOUserInfoManager.getInstance().setClient(imioClient)
let userStore = useUserStore();
let router = useRouter();
let appStore  = useAppStore();
let instance = getCurrentInstance();

console.log("App ======== setup")
appStore.windowMedia.innerHeight = window.innerWidth+""
appStore.windowMedia.innerHeight = window.innerHeight+""

window.addEventListener('resize', (e: any) => {
  appStore.windowMedia.innerHeight = e.target.innerHeight+"";
  appStore.windowMedia.innerWidth = e.target.innerWidth+"";

  // instance?.proxy?.$Message.info("Height:"+e.target.innerHeight)
  console.log('innerHeight',appStore.windowMedia.innerHeight)
  console.log('innerWidth',appStore.windowMedia.innerWidth)
})

const clientListener = {
  onConnectStatus(status: IMIOClientConnectStatus, retry: number): void {
    console.log('onConnectStatus',status,retry);
    if (status == IMIOClientConnectStatus.DONE) {
      appStore.linkStatus = ''
    }
    if (status == IMIOClientConnectStatus.ERROR) {
      appStore.linkStatus = '连接断开'
    }
    if (status == IMIOClientConnectStatus.CONNECTING) {
      appStore.linkStatus = '连接中...'
    }
    if (status == IMIOClientConnectStatus.SUCCESS) {
      appStore.linkStatus = '连接成功'
    }
    if (status == IMIOClientConnectStatus.SUCCESS_PULL) {
      appStore.linkStatus = '连接成功'
    }
    if (status == IMIOClientConnectStatus.RETRY_CONNECTING) {
      appStore.linkStatus = '连接重试中'
    }
    if (status == IMIOClientConnectStatus.TOKEN_EXPIRED) {
      appStore.linkStatus = '连接超时'
    }
  }, onConnected(): void {
    console.log('onConnected')
    let userInfo = imioClient.getUserInfo();
    if (userStore.user) {
      userStore.user!!.avatar = userInfo.avatar;
    }
  }, onDisconnected(): void {
    console.log('onDisconnected')
    appStore.linkStatus = '连接关闭'

  }, onTokenExpired(): void {
    appStore.linkStatus = '凭证过期'
    console.log('onTokenExpired')
  }
}

const messageListener = {
  onMessage(message: IMIOMessage): void {
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
  }, onNotice(message: IMIOMessage): void {
    console.log('App onNotice',message)
    if (message.title.length) {
      instance?.proxy?.$Notice.open({
        title: message.title,
        duration: 3
      })
    }
  }
};

imioClient.addMessageListener(messageListener);
imioClient.clientListener = clientListener
onMounted(() => {
  console.warn('App onMounted');
  let token = Cookies.get("token");
  // if (token) {
  //   let splitToken = token.split(' ');
  //   imioClient.setToken(splitToken[1]);
  //   let payload = getJwtPayload(splitToken[1]);
  //   let user :User = {id: payload.account,name:payload.nickname ,email:"",avatar:""}
  //   userStore.user = user;
  //
  //   if (imioClient.isClose()) {
  //     imioClient.connect(user.id,splitToken[1],user.name,clientListener)
  //   }
  // }
});

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

<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style scoped>
.ivu-layout-sider {
  min-width: 0;
  max-width: 30px;
}
</style>