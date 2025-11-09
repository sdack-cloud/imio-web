<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";

import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOMessage,
  IMIOUserInfoManager,
  IMIOMessageLabel,
  IMIOChatManager
} from 'imio-sdk-lite'
import {getCurrentInstance, onMounted, reactive} from "vue";
let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let userInfoManager = IMIOUserInfoManager.getInstance().setClient(imioClient);
let chatManager = IMIOChatManager.getInstance().setClient(imioClient);

const listData = reactive<Array<IMIOMessage>>([]);


onMounted(() => {
  getMyNotice()
})
function getMyNotice() {
  userInfoManager.getNoticeMessage(IMIOMessageLabel.notice,1,300).then((res:Array<IMIOMessage>) => {
    if (res.length) {
      for (let item of res) {
        if (item.label == IMIOMessageLabel.notice) {
          let index = listData.findIndex(it => it.messageId == item.messageId);
          if (index == -1) {
            listData.push(item)
          }
        }
      }
    } else {
      instance?.proxy?.$Message.success("没有通知")
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("查询失败")
  })
}
function handleConfirm3(i: number,title: string) {
  let element = listData[i];
  if (!element) {
    return
  }
  instance?.proxy?.$Modal.confirm({
    title: title,
    onOk: () => {
      handelDel(i)
    },
    onCancel: () => {
    },
  });
}
function handelDel(i: number) {
  let element = listData[i];
  if (!element) {
    return
  }
  chatManager.deleteMessage(element.messageId,element.joinId).then(res => {
    listData.splice(i,1)
  }).catch(err => {
    instance?.proxy?.$Message.error("删除失败")
  })
}

</script>

<template>
  <ActionBar title="群通知"/>
  <div>
    <AvatarCard class="ivu-m" v-for="(item,i) in listData" :avatar="item.thumb" :title="item.title" :subtitle="item.text" action-name="删除" @action="handleConfirm3(i,'确认删除吗？')" />
  </div>
</template>

<style scoped>

</style>