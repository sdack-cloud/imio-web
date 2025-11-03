<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {useRouter,useRoute} from "vue-router";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOChatManager,
  IMIOMessage,
  IMIOGroupManager,
  IMIOMember,
  IMIOGroup
} from 'imio-sdk-lite'
import {Button, Drawer, Input, Scroll} from "view-ui-plus";
import MemberItem from "@/components/chat/MemberItem.vue";
import {useUserStore} from "@/stores/user.ts";
let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let appStore = useAppStore();
let router = useRouter();
let route = useRoute();
let joinId: string = '';
let page = 1;
let imioContact : IMIOContact | null = null
let userStore = useUserStore();

const listDate = reactive<Array<IMIOMember>>([])
const isDrawer = ref(false);
let selfMember = reactive<IMIOMember>({})
const confirmText = ref('');
let idx : number= -1;

let groupManager = IMIOGroupManager.getInstance().setIMIOClient(imioClient);
let group = reactive<IMIOGroup>({isSelf:false})

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

  getMember()
  getGroup()
})

function getGroup() {
  groupManager.getGroupById(Number(joinId)).then(res => {
    getMember()
    if (res) {
      Object.assign(group,res);
      if (userStore.user && userStore.user!!.id.length && userStore.user!!.id == res.userId ) {
        group.isSelf = true;
      }
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("群信息获取失败")
  })
}


function getMember() {
  groupManager.getMembers(Number(joinId),page).then((res:Array<IMIOMember>) => {
    if (res.length) {
      for (let item of res) {
        let index = listDate.findIndex(it => it.userId == item.userId);
        if (index == -1) {
          listDate.push(item)
        }
        if (userStore.user && userStore.user!!.id.length) {
          if (userStore.user!!.id == item.userId) {
            Object.assign(selfMember, item);
          }
        }
      }
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("成员获取失败")
  })
}

function handleDrawer(i:number) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  isDrawer.value = !isDrawer.value
  idx = i
}

function handleConfirm() {
  confirmText.value = ''
  instance?.proxy?.$Modal.confirm({
    draggable:true,
    title: '设置成员备注名称',
    cancelText:"取消",
    okText:"确定",
    onOk: () => {
        handleMyName()
    },
    onCancel: () => {
      console.log('Cancel')
      confirmText.value = '';
    },
    render: (h:any) => {
      return h( Input, {
        size: "large",
        type:'textarea',
        modelValue: confirmText.value,
        autofocus: true,
        placeholder: '',
        'onInput': (event:any) => {
          confirmText.value = event.target.value;
        }
      })
    }
  })
}


function handleMyName() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (!confirmText.value.length) {
    instance?.proxy?.$Message.warning("请输入...")
    return;
  }
  if (idx <= -1) {
    return;
  }
  let item = listDate[idx];
  if (!item) {
    return;
  }
  groupManager.setGroupMemberName(Number(joinId),item.userId,confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    item.username = confirmText.value
    confirmText.value = ''
    isDrawer.value = false
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
    isDrawer.value = false
  })
}

function handleMuted() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (idx <= -1) {
    return;
  }
  let item = listDate[idx];
  if (!item) {
    return;
  }
  groupManager.memberMuted(Number(joinId),item.userId, !item.isMuted).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    item.isMuted = !item.isMuted;
    isDrawer.value = false
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
    isDrawer.value = false
  })
}

function handleManager() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (idx <= -1) {
    return;
  }
  let item = listDate[idx];
  if (!item) {
    return;
  }
  groupManager.setManager(Number(joinId),item.userId).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    listDate[idx].role = listDate[idx].role == 'MANAGER'?'MEMBER':'MANAGER';
    isDrawer.value = false
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
    isDrawer.value = false
  })
}


function handleRemove() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (idx <= -1) {
    return;
  }
  let item = listDate[idx];
  if (!item) {
    return;
  }
  groupManager.removeMember(Number(joinId),item.userId).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    listDate.splice(idx,1)
    isDrawer.value = false
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
    isDrawer.value = false
  })
}

function handleDialog() {
  if (idx <= -1) {
    return;
  }
  let item = listDate[idx];
  if (!item) {
    return;
  }
  groupManager.createDialogue(item.userId,Number(joinId)).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    console.log("Dialogue",res)
    isDrawer.value = false;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败");
    isDrawer.value = false

  })
}

</script>

<template>
  <ActionBar title="成员列表"/>



  <Scroll :height="Number(appStore.windowMedia.innerHeight) - 100">
    <MemberItem  v-for="(item,i) in listDate" :data="item"  @click="handleDrawer(i)"/>
  </Scroll>


  <Drawer title="操作" placement="bottom" :closable="false"  v-model="isDrawer">

    <Button  class="ivu-mt-4 ivu-mb-4" long @click="handleDialog" v-show="group.isTalk">私聊</Button>
    <Button  class="ivu-mt-4 ivu-mb-4" long v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'" @click="handleMuted">禁言</Button>
    <Button  class="ivu-mt-4 ivu-mb-4" long v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'" @click="handleConfirm">备注名称</Button>
    <Button  class="ivu-mt-4 ivu-mb-4" long v-if="selfMember.role == 'MASTER'" @click="handleManager">设置或取消管理员</Button>
    <Button type="error" long class="ivu-mt-4 ivu-mb-4" v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'" @click="handleRemove">踢出群聊</Button>

  </Drawer>
</template>

<style scoped>
.s {
  background: transparent;
}
</style>