<script setup lang="ts">
export interface SearchObj {
  remark:string,
  groupId:number,
  groupName:string,
  userId:string,
  avatar:string,
}
import {Avatar, Button, Card, Text} from "view-ui-plus";

const emits = defineEmits(['add'])

const props = withDefaults(defineProps<{
  data: SearchObj,
}>(), {
})
</script>

<template>
  <Card class="ivu-m-8"  :shadow="true">
    <div class="flex align-center justify-between">
      <div>
        <Avatar size="large" :src="data.avatar"/>
      </div>


      <div class="flex flex-direction flex-sub ivu-ml-16">
        <div class="title">
          <Text strong>{{ data.groupName }}</Text>
        </div>
        <div class="subtitle">
          <Text> {{ data.remark.length ? data.remark : ''}} </Text>
        </div>

      </div>
      <div>
        <Button  shape="circle" @click.stop="emits('add',data)"> 添加</Button>
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