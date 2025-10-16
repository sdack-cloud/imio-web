<script setup lang="ts">

import {Avatar, Card, Space, Text} from "view-ui-plus";
import {useRouter} from "vue-router";
import Contact from "@/views/home/Contact.vue";

let router = useRouter();

interface Contact {
  avatar: string,
  nickname: string,
  username: string,

}

const emits = defineEmits(['jumpItem']);

const props = withDefaults(defineProps<{
  contact: Contact,
}>(), {
})


function callItem(item: Contact) {

}
</script>

<template>
  <Card shadow class="contact-item" @click="emits('jumpItem',{})">
    <div class="flex align-center">
      <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" />
      <div class="item-content">
        <Text strong >订单</Text>
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
}
</style>