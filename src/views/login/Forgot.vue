<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Captcha, Card, FooterToolbar, Image, Password, Submit, UserName} from "view-ui-plus";
import logo from '@/assets/logo.png'
import {useAppStore} from "@/stores/app.ts";
let appStore = useAppStore();

function handleSubmit() {

}

function handleGetCaptcha() {

}

function handleChangePassword() {

}

</script>

<template>
  <div>
    <ActionBar title="忘记密码"/>
    <div class="demo-login flex justify-center">
      <Card class="card">
        <div class="logo flex  justify-center">
          <Image :src="logo" width="100px" height="100px"/>
        </div>
        <Login @on-submit="handleSubmit" :enter-to-submit="true">
          <UserName name="username"/>
          <Captcha name="captcha" @on-get-captcha="handleGetCaptcha"/>

          <Password name="password"/>
          <Password name="passwordConfirm" placeholder="确认密码"/>

          <Submit :loading="appStore.loading">提交</Submit>
        </Login>

      </Card>
    </div>
  </div>

  <FooterToolbar>
    <Link to="/signup"> 注册</Link> &nbsp;&nbsp; | &nbsp;&nbsp;
    <Link to="/login"> 登录</Link>
  </FooterToolbar>
</template>

<style scoped>
.demo-login {
  margin-top: 100px;
}

.card {
  width: 380px;
}

</style>