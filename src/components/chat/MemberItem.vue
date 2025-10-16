<script setup lang="ts">

import {Avatar, Button, Tag, Text} from "view-ui-plus";
</script>

<template>
  <div class="flex avatar-card align-center ivu-p-8">
    <div>
      <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
    </div>
    <div class="flex-sub ivu-ml-8">
      <div class="title">
        <Text strong>昵称</Text>
      </div>
      <div class="subtitle">
        <Text>昵称</Text>
      </div>
    </div>
    <div class="flex align-center ivu-mr-8"  >
      <Tag>dfsd</Tag>
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