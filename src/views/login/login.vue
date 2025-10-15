<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Captcha, Card, FooterToolbar, Image, Password, UserName} from "view-ui-plus";
import {reactive, ref} from "vue";
import {useRouter} from "vue-router";
let router = useRouter();

const fromData = reactive({
  username: '',
  password:'',
  smscode: '',
})

const mode = ref(false) // 登录模式 true 密码，false 验证码

function handleSubmit(valid:any, data: any) {
  if (!mode) {
    if (data.captcha.length != 6) {
      // TODO 提示
      return
    }
  }

  console.log(data)
}

function handleGetCaptcha() {

}

function handleSignup() {
  router.push('/signup')
}
function handleForgot() {
  router.push('/forgot')
}
</script>

<template>
  <div>
    <ActionBar title="登录" :more-list="['A','b']"/>

    <div class="demo-login flex justify-center" >
      <Card  class="card ">
      <div class="logo flex  justify-center">
        <Image  src="./src/assets/logo.png" width="50px" height="50px" />
      </div>

      <Login @on-submit="handleSubmit">
        <UserName name="username" :value="fromData.username"/>

        <Captcha name="captcha" v-show="!mode" :value="fromData.smscode" @on-get-captcha="handleGetCaptcha" />

        <Password name="password" v-show="mode" :value="fromData.password"/>
        <div class="demo-auto-login flex justify-between">


          <a @click="mode = !mode">{{ mode ? '验证码登录' :"密码登录" }}</a>
        </div>
        <Submit />
      </Login>
    </Card>
    </div>
  <FooterToolbar>
    <span @click="handleSignup">注册</span>  |
    <span @click="handleForgot">忘记密码</span>
  </FooterToolbar>
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

.logo {
  margin-bottom: 20px;
  margin-top: 10px;
  width: 100%;
}
.demo-auto-login {
  margin-bottom: 10px;
}
</style>