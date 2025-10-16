<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {Scroll} from "view-ui-plus";
import DialogItem from "@/components/dialog/DialogItem.vue";
import {useRouter} from "vue-router";
let appStore = useAppStore();
let router = useRouter();


function jump() {
  router.push('chat')
}

</script>

<template>
  <ActionBar title="对话" :isBack="false"/>
  <div class="page-body">
      <Scroll :height="Number(appStore.windowMedia.innerHeight) - 120">
        <DialogItem dialog="{}" @click="jump"/>
      </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>