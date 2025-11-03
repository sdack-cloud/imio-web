<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {Button, Drawer, FooterToolbar, Icon, List, ListItem, ListItemMeta, Scroll, Tag, Upload} from "view-ui-plus";
import ChatItem from "@/components/chat/ChatItem.vue";
import {ref, onMounted, getCurrentInstance, watchEffect, watch, reactive, nextTick} from "vue";
import {useRouter,useRoute} from "vue-router";
import MemberItem from "@/components/chat/MemberItem.vue";
import {IMIOClient,IMIOContactManager,IMIOContact,IMIOChatManager,IMIOMessage,IMIOMessageSender} from 'imio-sdk-lite'

let router = useRouter();
let route = useRoute();
let appStore = useAppStore();
let instance = getCurrentInstance();

appStore.windowMedia.innerHeight = window.innerWidth + ""
appStore.windowMedia.innerHeight = window.innerHeight + ""

const scrollRef = ref<HTMLElement | null>(null)

const isTool = ref(false)
const selectMember = ref(false)
const text = ref('')
const name = ref("")
let joinId : string = '';
let page = 0;
const listData = reactive<Array<IMIOMessage>>([])
let imioClient = IMIOClient.getInstance();
let chatManager = IMIOChatManager.getInstance().setIMIOClient(imioClient);
let contactList = imioClient.contactList;
let imioContact: IMIOContact|null = null;
let userId = ''


const messageListener = {
  onMessage(message: IMIOMessage): void {
    if (message.joinId.toString() == joinId) {
      listData.push(message);
      listData.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime())
      nextTick(()=> {
        const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
        (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
      })
    }
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
    let index = listData.findIndex(it => it.messageId == messageId);
    if (index > -1) {
      listData.splice(index,1);
    }
    listData.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime())
    nextTick(()=> {
      const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
      (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
    })
  }, onNotice(message: IMIOMessage): void {
  }
};
imioClient.messageListener.push(messageListener);
onMounted(() => {
  page = 0;
  console.warn("Chat onMounted", route.query)
  name.value  = route.query.name as string;
  joinId = route.query.join as string;
  if (!joinId) {
    router.back();
    return;
  }
  if (imioClient.isClose()) {
    router.back();
    return;
  }
  let userInfo = imioClient.getUserInfo();
  if (userInfo) {
    userId = userInfo.accountId;
  }
  imioContact = contactList.find(it => it.joinId == joinId);
  console.log('Contact =>',imioContact)
  getMessageList();
})

function callBarAction(i:number | null) {
  if (imioContact) {
    if (imioContact.isGroup) {
      router.push({
        name:'roomInfo',
        query:{
          join:joinId
        }
      })
    } else {
      router.push('buddyInfo')
    }
  }
}


function getMessageList() {
  if (!joinId.length) {
    return
  }
  page++;
  chatManager.getMessageList(Number(joinId),page).then((res:Array<IMIOMessage>) => {
    if (!res.length) {
      instance?.proxy?.$Message.success('没有任何消息');
      return
    }
    for (let item of res) {
      let findIndex = listData.findIndex((it:IMIOMessage) => it.messageId == item.messageId);
      if (findIndex == -1) {
        listData.push(item)
      }
    }
    listData.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime());

    nextTick(()=> {
      const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
      (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
    })

  }).catch((e) => {
    instance?.proxy?.$Message.error('消息获取失败');
    console.error(e)
  })
}

function onInput(e: any) {
  // console.log('input',e.inputType)
  // console.log('input',e.target.value)

  if (e.data === '@') {
    let inputType = e.inputType;
    if (inputType != 'deleteContentBackward') { // 退格时不管@
      selectMember.value = true
      let value = e.target.value;
      let newStr = value.slice(0, -1);
      text.value = newStr+'  @ABCS  '
    }
  }
}
function callFocus() {
  isTool.value = false
}
function callSend() {
  isTool.value = false
  if (!imioContact) {
    return;
  }
  if (!joinId.length) {
    return
  }
  let messageSender = IMIOMessageSender.buildSimpleText(Number(joinId), text.value);
  if (!imioContact.isGroup) {
    chatManager.oneToOne(messageSender).then(res => {
      console.log("发送成功")
    }).catch(err => {
      console.warn("发送失败", err)
    });
  } else {
    chatManager.oneToMany(messageSender).then(res => {
      console.log("发送成功")
    }).catch(err => {
      console.warn("发送失败", err)
    });
  }


}
</script>

<template>
  <ActionBar :title="name" :subtitle="appStore.windowMedia.innerHeight" :isMore="true" @action="callBarAction" />
<!--  <Upload>-->

  <div class="page-body">
    <Scroll ref="scrollRef" class="scroll-content" :height="Number(appStore.windowMedia.innerHeight) - 120">
      <ChatItem  v-for="(item,index) in listData" :msg="item" :mode="userId != item.fromId" :style="[{width:(Number(appStore.windowMedia.innerWidth)-20)+'px'}]" />
    </Scroll>
  </div>
<!--  </Upload>-->

  <div class="footer-toolbar flex flex-direction">

    <div class="footer-toolbar-input flex justify-around">
      <div class="ivu-m-4 flex align-center">
        <Icon type="ios-add-circle-outline"  size="28" @click="isTool = !isTool"/>
      </div>
      <div class="flex-sub ivu-m-4">

        <Input type="textarea"  v-model="text" :autofocus="true" size="large" suffix="md-add"  :autosize="{minRows: 1}"
        @input="onInput" @on-enter="callSend" @on-focus="callFocus"
        />
      </div>
      <div class="flex align-center ivu-m-4">
        <Button @click="callSend" size="small">发送</Button>
      </div>
    </div>

    <transition name="move-down">
    <div class="footer-toolbar-tool" v-show="isTool">

    </div>
    </transition>
  </div>

  <Drawer title="选择成员" placement="bottom" height="350" :closable="false" v-model="selectMember">
    <List item-layout="vertical">

      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha" >
        <template #description>
          <Tag color="red">d</Tag>
          <Tag color="volcano">d</Tag>
          <Tag color="orange">d</Tag>
        </template>
      </ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
      <ListItemMeta avatar="https://i.loli.net/2017/08/21/599a521472424.jpg" title="hjkfha"></ListItemMeta>
    </List>
  </Drawer>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

.footer-toolbar-input {
  padding: 5px;
}

.footer-toolbar {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 9;
  width: 100%;
  min-height: 60px;
  padding: 0px;
  line-height: 56px;
  background: #fff;
  border-top: 1px solid #e8eaec;
  box-shadow: 0 -1px 2px rgba(0, 0, 0, 0.03);
}
.footer-toolbar-tool {
  width: 100%;
  height: 20vh;
}
</style>