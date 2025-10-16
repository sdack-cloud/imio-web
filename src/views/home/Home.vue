<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Sider} from "view-ui-plus";
</script>

<template>
<ActionBar title="首页" :isBack="false"/>
  <div class="page-body">
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>