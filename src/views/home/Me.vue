<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Avatar, Button, Icon, Image, Text} from "view-ui-plus";
import { onMounted } from 'vue'

import {IMIOClient,IMIOClientOption,IMIOClientConnectStatus} from 'imio-sdk-lite'
import router from "@/router";
import {useUserStore} from "@/stores/user.ts";
let userStore = useUserStore();

let imioClient = IMIOClient.getInstance();

onMounted(() => {
  if (!imioClient.isClose()) {
    let userInfo = imioClient.getUserInfo();
    if (userStore.user) {
      userStore.user!!.avatar = userInfo.avatar;
      userStore.user!!.name = userInfo.nickname;
    }
  }
})

function login() {
}

function closed() {
  imioClient.disconnect()
}

function callSetting() {
  router.push("setting")
}

function handleTest() {

}

</script>

<template>

  <div class="me-head flex flex-direction ivu-pt-4">
    <div class="flex flex-reverse-row">
      <Icon type="md-settings" size="25" class="ivu-mt-8" @click.stop="callSetting"/>
    </div>
    <div class="flex  align-start">
      <Image :src="userStore.userAvatar" @click="login"  class="head-avatar" :width="60" :height="60"/>
       <div class="flex flex-direction ivu-ml-8">
       <div>
         <span class="text-bold text-lg ivu-mr-4" @click="closed">{{ userStore.userName }}</span>
         <Icon type="ios-ribbon-outline" />
       </div>
       <div>
         <span>昵称</span>
       </div>
       </div>
    </div>
    <div class="flex align-center justify-around ivu-mt-16">
      <div class="flex flex-direction align-center" @click="handleTest">
        <Icon type="ios-heart" size="36"/>
        <div class="ivu-mt-2">ABC</div>
      </div>
      <div class="flex flex-direction align-center">
        <Icon type="ios-mail" size="36"/>
        <div class="ivu-mt-2">ABC</div>
      </div>
      <div class="flex flex-direction align-center">
        <Icon type="ios-radio" size="36"/>
        <div class="ivu-mt-2">ABC</div>
      </div>
      <div class="flex flex-direction align-center">
        <Icon type="ios-help-circle" size="36"/>
        <div class="ivu-mt-2">ABC</div>
      </div>
    </div>
  </div>

  <div >

  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
.card {

}
.me-head {
  margin-bottom: 10px;
  background-image: linear-gradient(45deg, #2d8cf0, #5cadff);
  color: #ffffff;
  width: 100%;
  min-height: 200px;
  /* 底部圆弧效果 - 只设置底部的圆角 */
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  /* 内容与底部圆角的距离控制 */
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 0 20px 20px 20px;
}
</style>
<style >
.head-avatar .ivu-image-img{
  border-radius:50%;
}
</style>