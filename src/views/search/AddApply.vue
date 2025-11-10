<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {Button, FooterToolbar} from "view-ui-plus";
import {useRoute,useRouter} from "vue-router";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {IMIOClient,IMIOContactManager,IMIOContact,IMIOGroupManager,IMIOGroup} from 'imio-sdk-lite'
import {useUserStore} from "@/stores/user.ts";
let imioClient = IMIOClient.getInstance();
let groupManager = IMIOGroupManager.getInstance().setClient(imioClient);
let contactManager = IMIOContactManager.getInstance().setClient(imioClient);
let router = useRouter();
let route = useRoute();
let instance = getCurrentInstance();
const loading = ref(false)
interface AddApplyObj {
  avatar: string;
  name: string;
  remark: string;
  depict: string;
}

let group = reactive<AddApplyObj>({avatar:'',name:'',remark:'',depict:""})
let groupObj: any = null;
const text = ref("");
let userStore = useUserStore();

onMounted(() => {
  // console.log('params',userStore.groupObj)

  if (!userStore.groupObj.length) {
    router.back();
  } else {
    groupObj = JSON.parse(userStore.groupObj) as IMIOGroup;
    group.avatar = groupObj.avatar
    group.name = groupObj.groupName
    group.remark = groupObj.ask;
    userStore.groupObj = "";
  }
});

function handleSubmit() {
    loading.value = true
    if (groupObj.isGroup) {
      groupManager.joinGroup(groupObj.groupId,text.value).then(res => {
        instance?.proxy?.$Message.success({
          content:"操作成功",
          onClose:() => {
            router.back()
          }
        })
        loading.value = false
      }).catch(err => {
        instance?.proxy?.$Message.error("操作失败 "+(err.message))
        loading.value = false
      })
    } else {
      contactManager.addContact(groupObj.groupId,text.value).then(res => {
        instance?.proxy?.$Message.success({
          content:"操作成功",
          onClose:() => {
            router.back()
          }
        })
        loading.value = false
      }).catch(err => {
        instance?.proxy?.$Message.error("操作失败"+(err.message))
        loading.value = false
      })
    }
}

</script>

<template>
  <ActionBar title="申请添加"/>

  <div class="page-body">
    <AvatarCard class="ivu-m-8" :title="group.name" :avatar="group.avatar" :subtitle="group.depict"/>
    <div class="ivu-p-4 ivu-pl-8">
      {{ group.remark && group.remark.length ? '回答问题：'+group.remark : group.remark}}
    </div>
    <div class="ivu-m-8">
      <Input type="textarea" v-model="text" :rows="4" placeholder="Enter something..."
             :autofocus="true" size="large" :maxlength="50" :show-word-limit="true"
      />
    </div>


    <FooterToolbar >
        <Button type="primary" long @click="handleSubmit" :loading="loading">提交</Button>
    </FooterToolbar>
  </div>

</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

</style>

<style>
.ivu-footer-toolbar-right {
  float: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>