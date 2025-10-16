<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Button} from "view-ui-plus";

function login() {

}

</script>

<template>
  <ActionBar title="我" :isBack="false"/>
  <div class="page-body">

    <Button @click="login">登录</Button>
  </div>

</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>