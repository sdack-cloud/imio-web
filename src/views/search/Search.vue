<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {ButtonGroup, Scroll} from "view-ui-plus";
import {useRouter} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {ref} from "vue";
import SearchItem from "@/components/search/SearchItem.vue";

let router = useRouter();
let appStore = useAppStore();

const mode = ref(true) // true 房间，false 人员


function callAdd(i: number | null) {
  router.push('AddApply')
}
function callJumpInfo() {
  router.push('RoomProfile')

}
</script>

<template>
  <ActionBar title="添加朋友"/>
  <div class="page-body">
    <div class="flex flex-direction justify-center align-center">
      <ButtonGroup class="ivu-m-8 ">
        <Button :type="mode?'primary':''" @click="mode = true">找群</Button>
        <Button :type="mode?'':'primary'" @click="mode = false">找人</Button>
      </ButtonGroup>
      <div class="ivu-m-8 ivu-ml-16 ivu-mr-16 search" >
        <Input search enter-button placeholder="Enter something..."/>
      </div>
    </div>
    <Scroll :height="(Number(appStore.windowMedia.innerHeight) - 150)">
      <SearchItem @add="callAdd" @click="callJumpInfo"/>
    </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

.search {
  width: 90%;
}
</style>