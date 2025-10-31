<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Badge, Cell, Scroll} from "view-ui-plus";
import ContactItem from "@/components/contact/ContactItem.vue";
import {useAppStore} from "@/stores/app.ts";
import {useRouter} from "vue-router";

import {IMIOClient, IMIOContactManager, IMIOContact, IMIOMessage,IMIOMessageLabel,IMIOUserInfoManager} from 'imio-sdk-lite'
import {onMounted, onActivated, reactive, getCurrentInstance, ref} from "vue";
let instance = getCurrentInstance();
let appStore = useAppStore();
let router = useRouter();
let imioClient = IMIOClient.getInstance();

let imioContactManager = IMIOContactManager.getInstance().setIMIOClient(imioClient);
let userInfoManager = IMIOUserInfoManager.getInstance().setIMIOClient(imioClient);
const contactList = reactive<Array<IMIOContact>>([])
const noticeList = reactive<Array<IMIOMessage>>([])

const noticeCount = ref(0)
const actionCount = ref(0)


function callBarAction(i: number | null) {
  router.push('search')
}

onMounted(() => {
  console.warn("Contact onMounted")
  if (contactList.length == 0) {
    getContactList();
  }
})

const messageListener = {
  onMessage(message: IMIOMessage): void {
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
  }, onNotice(message: IMIOMessage): void {
  }
};

const contactListener = {
  onContactChange(isDelete: boolean, contact: IMIOContact): void {
    if (!isDelete) {
      let indexOf = contactList.findIndex(it => it.contactId == contact.contactId);
      if (indexOf == -1) {
        contactList.push(contact)
      }
    }
  }
};
imioClient.messageListener.push(messageListener)
imioClient.contactListener.push(contactListener);
function getContactList() {
  imioContactManager.getContactList().then((res:Array<IMIOContact>) => {
    for (let item of res) {
      let indexOf = contactList.findIndex(it => it.contactId == item.contactId);
      if (indexOf == -1) {
        contactList.push(item)
      }
    }
    getMyNotice()
  }).catch((e) => {
    instance?.proxy?.$Message.error("联系人获取失败")
  });
}

function getMyNotice() {
  userInfoManager.getNoticeMessage(IMIOMessageLabel.notice,1,300).then((res:Array<IMIOMessage>) => {
    if (res.length) {
      for (let item of res) {
        let index = noticeList.findIndex(it => it.messageId == item.messageId);
        if (index == -1) {
          noticeList.push(item)
        }
      }
    }
    let filter = noticeList.filter(it => it.label == IMIOMessageLabel.action);
    actionCount.value = filter.length;
    let filter1 = noticeList.filter(it => it.label == IMIOMessageLabel.notice);
    noticeCount.value = filter1.length;
  }).catch(err => {

  })
}

function handleReachTop() {
  getContactList();
}

function toChat(contact: Object) {
  router.push({
    name:"Chat",
    query:{
      join: contact.joinId,
      cid: contact.contactId,
      name: contact.username.length ? contact.username : contact.nickname
    },
    params:{
      cid: contact.id,
      name: contact.username.length ? contact.username : contact.nickname
    }

  })
}

</script>

<template>
  <ActionBar title="联系人" :isBack="false" :isMore="true" more="md-person-add" @action="callBarAction"/>
  <div class="page-body">
    <Cell title="新朋友"  to="newBuddyNotice" >
      <template #extra>
        <Badge :count="actionCount" v-show="actionCount" />
      </template>
    </Cell>
    <Cell title="群通知"  to="roomNotice" >
      <template #extra>
        <Badge :count="noticeCount" v-show="noticeCount" />
      </template>
    </Cell>
    <Scroll :height="Number(appStore.windowMedia.innerHeight) - 120" :on-reach-top="handleReachTop">
      <ContactItem :contact="item" v-for="item in contactList" @jump-item="toChat"/>
    </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>