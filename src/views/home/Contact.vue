<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Badge, Cell, Scroll} from "view-ui-plus";
import ContactItem from "@/components/contact/ContactItem.vue";
import {useAppStore} from "@/stores/app.ts";
import {useRouter} from "vue-router";
let appStore = useAppStore();
let router = useRouter();

function callBarAction(i: number | null) {
  router.push('search')
}

</script>

<template>
  <ActionBar title="联系人" :isBack="false" :isMore="true" more="md-add" @action="callBarAction"/>
  <div class="page-body">
    <Cell title="新朋友"  to="newBuddyNotice" >
      <template #extra>
        <Badge :count="10" />
      </template>
    </Cell>
    <Cell title="群通知"  to="roomNotice" >
      <template #extra>
        <Badge :count="10" />
      </template>
    </Cell>
    <Scroll :height="Number(appStore.windowMedia.innerHeight) - 120">
      <ContactItem contact=""/>
    </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>