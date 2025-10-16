<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {Button, FooterToolbar} from "view-ui-plus";
import {useRouter} from "vue-router";
let router = useRouter();
function callAdd(i: number | null) {
  router.push('AddApply')
}
</script>

<template>
  <ActionBar title="群资料"/>
  <div class="page-body">
    <AvatarCard class="ivu-m-8"/>
  </div>

  <FooterToolbar >
    <Button type="primary" long @click="callAdd">申请</Button>

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