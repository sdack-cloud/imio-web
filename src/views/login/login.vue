<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Captcha, Card, FooterToolbar, Image, Password, Submit, UserName} from "view-ui-plus";
import {reactive, ref, getCurrentInstance, onMounted} from "vue";
import {useRouter} from "vue-router";
import {AccountLogin} from "@/api/account.ts";
import Cookies from 'js-cookie';
import {User, useUserStore} from "@/stores/user.ts";

import {useAppStore} from "@/stores/app.ts";
let router = useRouter();
let instance = getCurrentInstance();
let userStore = useUserStore();
let appStore = useAppStore();

import logo from '@/assets/logo.png'

const fromData = reactive({
  username: '',
  password:'',
  smscode: '',
})
let widgetId :any = '';

let code = '';

const mode = ref(true) // 登录模式 true 密码，false 验证码

onMounted(() => {
  widgetId = turnstile.render("#turnstile-container", {
    sitekey: "0x4AAAAAACBI62tip7-gOWQx",
    callback:  (token:any) => {
      code = token;
    },
    "error-callback":  (errorCode:any) => {
      instance?.proxy?.$Message.info("Turnstile error:", errorCode);
    },
  });
});

function handleTurnstile() {
  turnstile.reset(widgetId);

}

function handleSubmit(valid:any, data: any) {
  if (!mode.value) {
    if (data.captcha.length != 6) {
      instance?.proxy?.$Message.info("验证码不正确")
      return
    }
  } else {
    if (data.password.length <= 5) {
      instance?.proxy?.$Message.info("密码太短")
      return
    }
  }

  if (data.username.length <= 3) {
    instance?.proxy?.$Message.info("账号必须")
    return
  }
  if (code.length <= 3) {
    instance?.proxy?.$Message.info("请完成人机验证")
    turnstile.reset(widgetId);
    return
  }
  appStore.loading = true;
  data.turnstile = code;
  AccountLogin(data).then(res => {
    console.log(res);
    appStore.loading = false
    if (res && res.access_token) {
      instance?.proxy?.$Message.success("登录成功")
      Cookies.set("token",`${res.token_type} ${res.access_token}`);
      Cookies.set("refresh",res.refresh_token);
      let payload = getJwtPayload(res.access_token);
      if (payload) {
        let user :User = {id: payload.account,name:payload.nickname ,email:"",avatar:""}
        userStore.user = user
      }
      router.back()
    } else {
      instance?.proxy?.$Message.error("登录失败")
      turnstile.reset(widgetId);
    }
  }).catch(err => {
    console.error(err)
    appStore.loading = false
    instance?.proxy?.$Message.error("账号或密码不正确")
    turnstile.reset(widgetId);
  })

  // console.log(data)
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
    <ActionBar title="登录" />

    <div class="demo-login flex justify-center" >
      <Card  class="card ">
      <div class="logo flex  justify-center">
        <Image  :src="logo" width="100px" height="100px" @click="handleTurnstile"/>
      </div>

      <Login @on-submit="handleSubmit" :enter-to-submit="true">
        <UserName name="username" :value="fromData.username"/>

        <Captcha name="captcha" v-show="!mode" :value="fromData.smscode" @on-get-captcha="handleGetCaptcha" />

        <Password name="password" v-show="mode" :value="fromData.password"/>
        <div class="demo-auto-login flex justify-between">


          <a @click="mode = !mode">{{ mode ? '验证码登录' :"密码登录" }}</a>
        </div>
        <div class="demo-auto-login flex justify-between">
          <div id="turnstile-container"></div>
        </div>
        <Submit :loading="appStore.loading"/>
      </Login>
    </Card>
    </div>
  <FooterToolbar>
    <Link to="/signup"> 注册 </Link> &nbsp;&nbsp; | &nbsp;&nbsp;
    <Link to="/forgot"> 忘记密码 </Link>
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