<script setup lang="ts">

import {Avatar, Badge, Card, Space, Text} from "view-ui-plus";
import {useRouter} from "vue-router";
import Contact from "@/views/home/Contact.vue";

let router = useRouter();

interface Dialog {
  roomId: number,
  avatar: string,
  nickname: string,
  username: string,
  remark: string,
}

const emits = defineEmits(['jumpItem']);

const props = withDefaults(defineProps<{
  dialog: Dialog,
}>(), {
})


function callItem(item: Dialog) {

}
</script>

<template>
  <Card shadow class="contact-item" @click="emits('jumpItem',{})">
    <div class="flex align-center justify-between">
      <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
      <div class="item-content flex flex-direction align-start">
        <Text strong class="title" ellipsis >订单</Text>
        <Text class="subtitle" ellipsis>订单分阶段来看京东方龙卷风考虑房间的付款了分开了叫开放接口睡觉啊困了</Text>
      </div>
      <div class="flex flex-direction justify-around">
        <div class="more-dot">
          <Badge :count="10" />
        </div>
        <div class="more-time">
          <Time :time="new Date()" />
        </div>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.contact-item {
  margin: 10px 0px 10px 0px;
}
.item-content {
  margin-left: 10px;
  margin-right: 10px;
  width: 80%;
}
.title {
  font-size: 18px;
}
.subtitle {
  font-size: 14px;
  color: #c5c8ce;
}
.more-dot {
  min-width: 20px;
  min-height: 20px;
}
.more-time {
  min-width: 30px;
  min-height: 20px;
  color: #c5c8ce;
}
</style>