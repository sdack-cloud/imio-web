<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {getCurrentInstance, ref} from "vue";
import {IMIOClient,IMIOTeamManager} from "imio-sdk-lite";
import router from "@/router";
const text = ref("")
let client = IMIOClient.getInstance();
let teamManager = IMIOTeamManager.getInstance().setClient(client);
let instance = getCurrentInstance();

function handleSearch() {
  teamManager.create(text.value).then(res => {
    instance?.proxy?.$Message.success({
      content:"创建成功",
      onClose:() => {
        router.back()
      }
    });
  }).catch(err => {
    instance?.proxy?.$Message.error("创建失败");
  })
}
</script>

<template>
  <ActionBar title="创建小队"/>
  <div class="ivu-m-8 ivu-ml-16 ivu-mr-16 search" >
    <Input v-model="text" search placeholder="名称" enter-button="创建" @on-search="handleSearch"/>
  </div>
</template>

<style scoped>

</style>