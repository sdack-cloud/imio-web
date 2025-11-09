<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOMessage,
  IMIOMessageLabel,
  IMIOUserInfoManager,
  IMIOGroupManager
} from 'imio-sdk-lite'
import {onMounted, onActivated, reactive, getCurrentInstance, ref} from "vue";
import {useRouter} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {Scroll} from "view-ui-plus";
import ContactItem from "@/components/contact/ContactItem.vue";
import {useUserStore} from "@/stores/user.ts";
let instance = getCurrentInstance();
let router = useRouter();
let imioClient = IMIOClient.getInstance();
let imioContactManager = IMIOContactManager.getInstance().setClient(imioClient);
let groupManager = IMIOGroupManager.getInstance().setClient(imioClient);
const contactList = reactive<Array<IMIOContact>>([])
let appStore = useAppStore();
let userStore = useUserStore();
const text = ref('');

onMounted(() => {
  getContact()
})

function getContact() {
  imioContactManager.getContactList(1,500).then((res:Array<IMIOContact>) => {
    if (res.length) {
      for (let item of res) {
        if (!item.isGroup) {
          let indexOf = contactList.findIndex(it => it.contactId == item.contactId);
          if (indexOf == -1) {
            item.isMuted = 0
            contactList.push(item)
          }
        }
      }
    } else {
      instance?.proxy?.$Message.success('没有联系人')
    }
  }).catch(err => {
    instance?.proxy?.$Message.error('联系人获取失败')
  })
}

function handleCheck(i:number) {
  let listElement = contactList[i];
  listElement.isMuted = listElement.isMuted?0:1;
}
function handleSearch() {
  if (!userStore.user || !userStore.user!!.id.length) {
    instance?.proxy?.$Message.error('账户ID不存在')
    return
  }
  if (!contactList.length) {
    instance?.proxy?.$Message.error('联系人不存在')
    return
  }
  let filter = contactList.filter(it => it.isMuted != 0 && it.userId != userStore.user!!.id);
  if (!filter.length) {
    instance?.proxy?.$Message.error('请选择联系人');
    return
  }
  if (!text.value.length) {
    instance?.proxy?.$Message.error('群名称必须');
    return
  }
  let map = filter.map(it => it.userId);
  groupManager.createGroup(text.value,map).then(res => {
    instance?.proxy?.$Message.success({
      content:"操作成功",
      onClose:() => {
        router.back()
      }
    })
  }).catch(err => {
    instance?.proxy?.$Message.error('创建失败');
  })
}

</script>

<template>
 <ActionBar title="创建群聊"/>
  <div class="ivu-m-8 ivu-ml-16 ivu-mr-16 search" >
    <Input v-model="text" search placeholder="群名称" enter-button="创建" @on-search="handleSearch"/>
  </div>
  <Scroll :height="(Number(appStore.windowMedia.innerHeight) - 150)">
    <div class="flex align-center" v-for="(item,i) in contactList" >
      <div class="ivu-m-8" @click.stop="handleCheck(i)">
        <Icon type="ios-checkmark-circle" size="25" color="#5cadff" v-show="item.isMuted"/>
        <Icon type="ios-radio-button-off" size="25" color="#5cadff" v-show="!item.isMuted"/>
      </div>
      <ContactItem  class="ivu-ml-8 flex-sub" :contact="item" />
    </div>
  </Scroll>
</template>

<style scoped>

</style>