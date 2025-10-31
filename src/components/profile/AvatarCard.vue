<script setup lang="ts">

import {Avatar, Button, Text} from "view-ui-plus";

const emits = defineEmits(['action']);

const props = withDefaults(defineProps<{
  actionName?: string,
  avatar: string,
  title: string,
  subtitle: string
}>(), {
  title: '',
  subtitle: '',
  avatar: ''
})

</script>

<template>
  <div class="flex avatar-card align-center ivu-p-8">
    <div>
      <Avatar size="large" :src="avatar" />
    </div>
    <div class="flex-sub ivu-ml-8">
      <div class="title">
        <Text strong> {{ title }}</Text>
      </div>
      <div class="subtitle">
        <Text> {{subtitle}}</Text>
      </div>
    </div>
    <div class="flex align-center ivu-mr-8" v-if="actionName" >
      <Button shape="circle" @click.stop="emits('action')">  {{ actionName }} </Button>
    </div>
  </div>
</template>

<style scoped>
.avatar-card {
  margin-top: 5px;
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
}
.subtitle {
  font-size: 14px;
}
</style>