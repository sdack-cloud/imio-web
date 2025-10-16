<script setup lang="ts">

import {Avatar, Button, Card, Text} from "view-ui-plus";

const emits = defineEmits(['add'])

</script>

<template>
  <Card class="ivu-m-8"  :shadow="true">
    <div class="flex align-center justify-between">
      <div>
        <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg"/>
      </div>


      <div class="flex flex-direction flex-sub ivu-ml-16">
        <div class="title">
          <Text strong>昵称</Text>
        </div>
        <div class="subtitle">
          <Text>昵称</Text>
        </div>

      </div>
      <div>
        <Button  shape="circle" @click.stop="emits('add',0)"> 添加</Button>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.title {
  font-size: 16px;
}

.subtitle {
  font-size: 14px;
}
</style>