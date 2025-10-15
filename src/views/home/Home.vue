<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Sider} from "view-ui-plus";
</script>

<template>
<ActionBar title="首页" :isBack="false"/>

</template>

<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-header-bar{
  background: #fff;
  box-shadow: 0 1px 1px rgba(0,0,0,.1);
}
.dev-run-preview .dev-run-preview-edit{ display: none }
</style>