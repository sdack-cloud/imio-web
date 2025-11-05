<script setup lang="ts">

import {Avatar} from "view-ui-plus";


const props = withDefaults(defineProps<{
  name: string, // 模式
  avatar : string
}>(), {
  avatar: '',
  name: ''
})
</script>

<template>
  <div class="flex flex-direction justify-center align-center ivu-ml-4 ivu-mr-4 ivu-mt-4">
    <Avatar size="large" shape="circle" :src="avatar" />
    <div class="nickname ivu-mt-4">
      {{ name }}
    </div>
  </div>
</template>

<style scoped>
.nickname {
  font-size: 12px;
}
</style>