<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Captcha, Card, Password, Submit, UserName} from "view-ui-plus";







function handleSubmit() {

}

function handleGetCaptcha() {

}

function handleChangePassword() {

}

</script>

<template>
  <div>
  <ActionBar title="注册" />
    <div class="demo-login flex justify-center" >
      <Card class="card">
    <Login @on-submit="handleSubmit">
      <UserName name="username" />
      <Captcha name="captcha"  @on-get-captcha="handleGetCaptcha" />

      <Password name="password" />
      <Password name="passwordConfirm"  placeholder="确认密码" />
      <Submit >注册</Submit>
    </Login>

  </Card>
    </div>
  </div>
</template>

<style scoped>
.demo-login {
  margin-top: 100px;
}
.card {
  width: 380px;
}

</style>