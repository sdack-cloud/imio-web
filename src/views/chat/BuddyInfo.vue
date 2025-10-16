<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {Button, FooterToolbar, Scroll} from "view-ui-plus";
import {useAppStore} from "@/stores/app.ts";

let appStore = useAppStore();


function barAction() {

}
</script>

<template>
  <ActionBar title="朋友详情" :is-more="true" more="ios-cog-outline" @action="barAction"/>

  <Scroll :height="Number(appStore.windowMedia.innerHeight) - 150">
  <AvatarCard class="ivu-m"/>
  </Scroll>

  <FooterToolbar >
    <Button type="delete" long>删除</Button>

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