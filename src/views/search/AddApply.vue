<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {Button, FooterToolbar} from "view-ui-plus";
</script>

<template>
  <ActionBar title="申请添加"/>

  <div class="page-body">
    <AvatarCard class="ivu-m-8"/>
    <div class="ivu-m-8">
      <Input type="textarea" :rows="4" placeholder="Enter something..."
             :autofocus="true" size="large" :maxlength="50" :show-word-limit="true"
      />
    </div>


    <FooterToolbar >
        <Button type="primary" long>提交</Button>

    </FooterToolbar>
  </div>

</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
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
</style>