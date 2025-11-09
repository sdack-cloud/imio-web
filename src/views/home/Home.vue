<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Sider} from "view-ui-plus";
import {useAppStore} from "@/stores/app.ts";
let appStore = useAppStore();

appStore.homeIdx = 0;
</script>

<template>
<ActionBar title="首页" :subtitle="appStore.linkStatus" :isBack="false"/>
  <div class="page-body">
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>