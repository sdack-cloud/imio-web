<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {useRouter,useRoute} from "vue-router";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {IMIOClient,IMIOContactManager,IMIOContact,IMIOChatManager,IMIOMessage,IMIOGroupManager,IMIOMember} from 'imio-sdk-lite'
let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let appStore = useAppStore();
let router = useRouter();
let route = useRoute();
let joinId: string = '';
let page = 1;
let imioContact : IMIOContact | null = null
const listDate = reactive<Array<IMIOMember>>([])

let groupManager = IMIOGroupManager.getInstance().setIMIOClient(imioClient);

onMounted(() => {
  joinId = route.query.join as string;
  if (!joinId && !joinId.length) {
    router.back()
    return
  }
  imioContact = imioClient.contactList.find(it => it.joinId == Number(joinId));
  if (!imioContact) {
    router.back()
    return
  }
})

function getMember() {
  groupManager.getMembers(Number(joinId),page).then((res:Array<IMIOMember>) => {
    if (res.length) {
      for (let item of res) {
        let index = listDate.findIndex(it => it.userId == item.userId);
        if (index == -1) {
          listDate.push(item)
        }
      }
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("成员获取失败")
  })
}

</script>

<template>
  <ActionBar title="成员列表"/>

</template>

<style scoped>

</style>