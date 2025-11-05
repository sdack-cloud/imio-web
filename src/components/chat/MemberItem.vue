<script setup lang="ts">

import {Avatar, Button, Tag, Text} from "view-ui-plus";

import {IMIOClient,IMIOContactManager,IMIOContact,IMIOGroupManager,IMIOMember} from 'imio-sdk-lite'

interface MemberObj {
  joinId: number;
  userId: string;
  nickname: string;
  username: string;
  avatar: string;
  role: string;
}

const props = withDefaults(defineProps<{
  data : MemberObj | null
}>(), {
  data:  null
})

</script>

<template>
  <div class="flex avatar-card align-center ivu-p-8">
    <div>
      <Avatar size="large" :src="data?.avatar" />
    </div>
    <div class="flex-sub ivu-ml-8">
      <div class="title">
        <Text strong>{{ data && data.username.length ? data.username : data.nickname}}</Text>
      </div>
      <div class="subtitle">
        <Text v-if="data?.isMuted">{{ data.isMuted == 1?'已禁言':'' }}</Text>
      </div>
    </div>
    <div class="flex align-center ivu-mr-8"  >
      <Tag color="primary" v-show="data?.role == 'MASTER'">群主</Tag>
      <Tag color="geekblue" v-show="data?.role == 'MANAGER'">主管</Tag>
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