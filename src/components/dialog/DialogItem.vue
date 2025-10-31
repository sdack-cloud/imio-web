<script setup lang="ts">

import {Avatar, Badge, Card, Space, Text} from "view-ui-plus";
import {useRouter} from "vue-router";
import Contact from "@/views/home/Contact.vue";
import {data} from "autoprefixer";

let router = useRouter();

interface Dialog {
  joinId: number,
  avatar: string,
  name: string,
  username: string,
  remark: string,
  date:Date,
  tip:number,
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
  <Card shadow class="contact-item" @click="emits('jumpItem',data)">
    <div class="flex align-center justify-between">
      <Avatar size="large" :src="dialog.avatar" />
      <div class="item-content flex flex-direction align-start">
        <Text strong class="title" ellipsis >{{ dialog.name }}</Text>
        <Text class="subtitle" ellipsis>{{ dialog.remark }}</Text>
      </div>
      <div class="flex flex-direction justify-around">
        <div class="more-dot" v-show="dialog.tip">
          <Badge :count="dialog.tip" />
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