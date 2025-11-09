<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {Badge, Cell, Scroll} from "view-ui-plus";
import ContactItem from "@/components/contact/ContactItem.vue";
import {useAppStore} from "@/stores/app.ts";
import {useRouter} from "vue-router";

import {IMIOClient, IMIOContactManager, IMIOContact, IMIOMessage,IMIOMessageLabel,IMIOUserInfoManager} from 'imio-sdk-lite'
import {
  onMounted,
  onActivated,
  reactive,
  getCurrentInstance,
  ref,
  onUnmounted,
  nextTick,
  onBeforeMount,
  onBeforeUnmount
} from "vue";
let instance = getCurrentInstance();
let appStore = useAppStore();
let router = useRouter();
let imioClient = IMIOClient.getInstance();

let imioContactManager = IMIOContactManager.getInstance().setClient(imioClient);
let userInfoManager = IMIOUserInfoManager.getInstance().setClient(imioClient);
const contactList = reactive<Array<IMIOContact>>([])
const noticeList = reactive<Array<IMIOMessage>>([])
appStore.homeIdx = 2;
const noticeCount = ref(0)
const actionCount = ref(0)

console.log('setup')

const messageListener = {
  onMessage(message: IMIOMessage): void {
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
  }, onNotice(message: IMIOMessage): void {
    console.log('Contact onNotice',message)
    if (message.label == IMIOMessageLabel.notice) {
      nextTick(() => {
        noticeCount.value = noticeCount.value+1;
      })
    }
    if (message.label == IMIOMessageLabel.action) {
      nextTick(() => {
        actionCount.value = actionCount.value+1;
      })
    }
  }
};

const contactListener = {
  onContactChange(isDelete: boolean, contact: IMIOContact): void {
    if (!isDelete) {
      let indexOf = contactList.findIndex(it => it.contactId == contact.contactId);
      if (indexOf == -1) {
        contactList.push(contact)
      } else {
        contactList.splice(indexOf,1,contact)
      }
    }
  }
};
imioClient.addMessageListener(messageListener)
imioClient.addContactListener(contactListener);
function callBarAction(i: number | null) {
  router.push('search')
}

onMounted(() => {
  console.warn("Contact onMounted")
  if (contactList.length == 0) {
    getContactList();
  }
  let length = imioClient.messageListener.length;
  console.log('length',length)
})

onBeforeUnmount(() => {
  console.log("Contact onBeforeUnmount")
  imioClient.removeMessageListener(messageListener);
  imioClient.removeContactListener(contactListener);
  let length = imioClient.messageListener.length;
  console.log('length',length)
})


function getContactList() {
  imioContactManager.getContactList().then((res:Array<IMIOContact>) => {
    for (let item of res) {
      let find = contactList.find(it => it.contactId == item.contactId);
      if (!find) {
        contactList.push(item)
      } else {
        find.status = item.status
      }
      console.log(item)
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

function toChat(contact: any) {
  router.push({
    name:"Chat",
    query:{
      join: contact.joinId,
      name: contact.username.length ? contact.username : contact.nickname
    }

  })
}

</script>

<template>
  <ActionBar title="联系人" :subtitle="appStore.linkStatus" :isBack="false" :isMore="true" more="md-person-add" @action="callBarAction"/>
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