<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Button, FooterToolbar} from "view-ui-plus";
import Cookies from 'js-cookie';
import {User, useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";
import {getCurrentInstance, ref} from "vue";
import {logout} from "@/api/account.ts";
import {IMIOClient, IMIOClientConnectStatus,IMIOMessage} from 'imio-sdk-lite'
import {useAppStore} from "@/stores/app.ts";

let router = useRouter();
let instance = getCurrentInstance();
let appStore = useAppStore();
let userStore = useUserStore();
let imioClient = IMIOClient.getInstance();

function handleLogout() {
  let token = Cookies.get("token");
  let refresh = Cookies.get("refresh");
  if (!token) {
    instance?.proxy?.$Message.error("退出失败，token不存在")
    return
  }
  let split = token.split(" ");
  logout(split[1]).then(res => {
    userStore.clearProfile();
    Cookies.remove("token")
    Cookies.remove("refresh")
    appStore.linkStatus = ''
    imioClient.disconnect()
    // logout(refresh,2).then();
    window.localStorage.removeItem("dialog");
    router.replace('/')
  }).catch(err => {
    console.error(err)
    instance?.proxy?.$Message.error("退出失败")
  })
}

</script>

<template>
  <ActionBar title="设置"/>


  <FooterToolbar >
    <Button type="error" long @click="handleLogout">退出登录</Button>

  </FooterToolbar>
</template>

<style scoped>

</style>

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