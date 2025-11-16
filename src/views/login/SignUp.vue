<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Captcha, Card, FooterToolbar, Image, Password, Submit, UserName} from "view-ui-plus";
import {AccountRegister} from "@/api/account.ts";
import {getCurrentInstance, onMounted} from "vue";
import {useUserStore} from "@/stores/user.ts";
import router from "@/router";

import {useAppStore} from "@/stores/app.ts";
let userStore = useUserStore();
let appStore = useAppStore();
import logo from '@/assets/logo.png'


let instance = getCurrentInstance();

const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const phoneReg = /^1[3-9]\d{9}$/;

let widgetId :any = '';

let code = '';

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


function handleSubmit(valid:any, data: any) {

  if (data.password.length <= 5) {
    instance?.proxy?.$Message.warning("密码太短")
    return
  }
  if (emailReg.test(data.username)) {
    data.email = data.username;
  }
  if (phoneReg.test(data.username)) {
    data.mobile = data.username;
  }
  if (!data.email && !data.mobile) {
    instance?.proxy?.$Message.warning("手机号或邮箱选其一")
    return;
  }
  if (data.password != data.passwordConfirm) {
    instance?.proxy?.$Message.warning("两次密码不一致")
    return
  }
  if (code.length <= 3) {
    instance?.proxy?.$Message.info("请完成人机验证")
    turnstile.reset(widgetId);
    return
  }
  data.turnstile = code;
  AccountRegister(data).then((res:any) => {
    if (res) {


        // console.log("RegisterData", res);
        if (res.account) {
        }
      instance?.proxy?.$Message.success({
        content:"注册成功",
        onClose:() => {
          router.back()
        }
      })
    } else {
      instance?.proxy?.$Message.error(res.message)
    }
  }).catch(err => {
    console.error(err)
  })
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
        <div class="logo flex  justify-center">
          <Image  :src="logo" width="100px" height="100px" />
        </div>
    <Login @on-submit="handleSubmit" :enter-to-submit="true">
      <UserName name="username" placeholder="手机号或邮箱选其一" />
      <Captcha name="captcha" v-if="false"  @on-get-captcha="handleGetCaptcha" />

      <Password name="password" />
      <Password name="passwordConfirm"  placeholder="确认密码" />

      <div>
        <div id="turnstile-container"></div>

      </div>
      <Submit :loading="appStore.loading" >注册</Submit>
    </Login>

  </Card>
    </div>
  </div>

  <FooterToolbar>
    <Link to="/login"> 登录 </Link>
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