<script setup lang="ts">

import {Avatar, Badge, Card, Space, Text} from "view-ui-plus";
import {useRouter} from "vue-router";
import Contact from "@/views/home/Contact.vue";

let router = useRouter();

interface Contact {
  avatar: string,
  nickname: string,
  username: string,
  status:string
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
  <Card shadow class="contact-item" @click="emits('jumpItem',contact)">
    <div class="flex align-center ">
      <Avatar size="large" :src="contact.avatar" />
      <div class="item-content flex-sub">
        <Text strong >{{ contact.username.length?contact.username:contact.nickname }}</Text>
      </div>
      <div>
        <Badge status="success" v-show="contact.status.indexOf('online') != -1"/>
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