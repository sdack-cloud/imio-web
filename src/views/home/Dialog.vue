<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {Scroll} from "view-ui-plus";
import DialogItem from "@/components/dialog/DialogItem.vue";
import {Dialog} from "@/components/dialog/DialogItem.vue";
import {useRouter} from "vue-router";
import {IMIOClient, IMIOContactManager, IMIOContact, IMIOMessage,IMIOMessageLabel} from 'imio-sdk-lite'
import {onMounted, onActivated, reactive, getCurrentInstance, ref, nextTick, onBeforeUnmount} from "vue";
let instance = getCurrentInstance();
let appStore = useAppStore();
let router = useRouter();
let imioClient = IMIOClient.getInstance();
appStore.homeIdx = 1;
// export interface DialogObj{
//   joinId:number;
//   nickname:string;
//   avatar:string;
//   text:string;
//   tip:number;
//   sentDate: Date|null;
// }



const listData = reactive<Array<Dialog>>([])

const messageListener = {
  onMessage(message: IMIOMessage): void {
    if (message.joinId) {
      let find = imioClient.contactList.find(it => it.joinId == message.joinId);
      if (find) {
        let find1 = listData.find(it => it.joinId == message.joinId);
        if (!find1) {
          let dialogObj:Dialog = {
            joinId: message.joinId,
            nickname: find.username.length?find.username:find.nickname,
            avatar:find.avatar,
            text:message.text,
            tip:1,
            sentDate: message.sentDate?message.sentDate:new Date()
          }
          listData.push(dialogObj);
        } else {
          find1.tip = find1.tip+1;
          find1.text = message.text;
          if (message.sentDate){
            find1.sentDate = message.sentDate;
          } else {
            find1.sentDate = new Date();
          }
        }
        listData.sort((a,b) => a.sentDate!!.getTime() - b.sentDate!!.getTime())

        window.localStorage.setItem("dialog", JSON.stringify(listData))
      }
    }
  }, onMessageRead(contactId: number, messageId: string): void {
  }, onMessageRevoke(contactId: number, messageId: string): void {
  }, onNotice(message: IMIOMessage): void {
  }
};
imioClient.addMessageListener(messageListener)

onBeforeUnmount(() => {
  imioClient.removeMessageListener(messageListener);
  // let length = imioClient.messageListener.length;
  // console.log("Dialog onBeforeUnmount",length)
})

let dialogStr = window.localStorage.getItem('dialog');
if (dialogStr) {
  try{
    let parse = JSON.parse(dialogStr, (key, value) => {
      // 如果键是 "time"，则将字符串转为 Date 对象
      if (key === "sentDate") {
        return new Date(value);
      }
      // 其他字段直接返回原值
      return value;
    }) as Array<Dialog>;
    for (let item of parse) {
      listData.push(item);
    }
  }catch (e) {
  }
}

function jump(i:number) {
  let item = listData[i];
  if (!item) {
    return
  }
  item.tip = 0
  listData.sort((a,b) => a.sentDate!!.getTime() - b.sentDate!!.getTime())
  window.localStorage.setItem("dialog", JSON.stringify(listData))
  // console.log('jump', item)
  router.push({
    name:'Chat',
    query:{
      join: item.joinId,
      name: item.nickname
    }
  })
}

function handleActionMore(i:number) {
    switch (i) {
      case 0:
        router.push('search')
        break;
      case 1:
        router.push('createGroup')
        break;
    }
}

</script>

<template>
  <ActionBar title="对话" :subtitle="appStore.linkStatus"  :isBack="false" :more-list="['加好友','创建群聊']" @action="handleActionMore"/>
  <div class="page-body">
      <Scroll :height="Number(appStore.windowMedia.innerHeight) - 120">
        <DialogItem :dialog="item" @click="jump(i)" v-for="(item,i) in listData" />
      </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}
</style>