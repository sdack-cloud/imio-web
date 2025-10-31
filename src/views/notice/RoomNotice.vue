<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";

import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOMessage,
  IMIOUserInfoManager,
  IMIOMessageLabel
} from 'imio-sdk-lite'
import {getCurrentInstance, onMounted, reactive} from "vue";
let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let userInfoManager = IMIOUserInfoManager.getInstance().setIMIOClient(imioClient);

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

</script>

<template>
  <ActionBar title="群通知"/>
  <div>
    <AvatarCard class="ivu-m" v-for="(item,index) in listData" :avatar="item.thumb" :title="item.title" :subtitle="item.text" />
  </div>
</template>

<style scoped>

</style>