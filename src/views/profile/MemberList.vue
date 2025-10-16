<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Scroll} from "view-ui-plus";
import {useAppStore} from "@/stores/app.ts";
import MemberItem from "@/components/chat/MemberItem.vue";
let appStore = useAppStore();
</script>

<template>
  <ActionBar title="群成员"/>
  <Scroll :height="Number(appStore.windowMedia.innerHeight) - 150">
    <MemberItem />
  </Scroll>
</template>

<style scoped>

</style>