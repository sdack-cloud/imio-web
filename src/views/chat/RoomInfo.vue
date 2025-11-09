<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {
  Button,
  Card,
  Cell,
  CellGroup,
  Drawer,
  FooterToolbar,
  Grid,
  GridItem,
  Icon,
  Input,
  Scroll,
  Switch
} from "view-ui-plus";
import MemberGridItem from "@/components/chat/MemberGridItem.vue";
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
  IMIOGroup,
  IMIOContactNotice,
  IMIOGroupType
} from 'imio-sdk-lite'
import {useUserStore} from "@/stores/user.ts";
import MemberItem from "@/components/chat/MemberItem.vue";
let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let appStore = useAppStore();
let userStore = useUserStore();
let router = useRouter();
let route = useRoute();

let groupManager = IMIOGroupManager.getInstance().setClient(imioClient);
let contactManager = IMIOContactManager.getInstance().setClient(imioClient);

let imioContact : IMIOContact | null = null
let joinId: string = '';
let page = 1;
const listDate = reactive<Array<IMIOMember>>([])
let group = reactive<IMIOGroup>({isSelf:false})
let selfMember = reactive<IMIOMember>({})
const remarkName = ref('');
const confirmText = ref('');
const askText = ref('');
const isDrawer = ref(false);

onMounted(() => {
   joinId = route.query.join as string;
  if (!joinId || !joinId.length) {
    router.back()
    return
  }
  imioContact = imioClient.contactList.find(it => it.joinId == Number(joinId));
  if (!imioContact) {
    router.back()
    return
  }
  remarkName.value = imioContact.username;


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
            item.nickname = '我'
            Object.assign(selfMember, item);
          }
        }
      }
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("成员获取失败")
  })
}

function goToNav(i:number) {
  if (i == 1) {
    router.push({
      name:"GroupMember",
      query:{
        join:joinId
      }
    })
  }
}

function handleConfirm(i: number,title:string) {
  confirmText.value = ''
  instance?.proxy?.$Modal.confirm({
    draggable:true,
    title:title,
    cancelText:"取消",
    okText:"确定",
    onOk: () => {
      console.log('OK',i);
      if (i == 1) {
        handleGroupName()
      }
      if (i == 2) {
        handleDepict()
      }
      if (i == 3) {
        handleMyName()
      }
      if (i == 4) {
        handleMyRemark()
      }
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
function handleConfirm2() {
  instance?.proxy?.$Modal.confirm({
    draggable:true,
    title:'入群问题',
    cancelText:"取消",
    okText:"确定",
    onOk: () => {
      console.log('OK');
      handleGroupAsk();
    },
    onCancel: () => {
      console.log('Cancel')
      confirmText.value = '';
      askText.value = '';
    },
    render: (h:any) => {
      return h( 'div',{class: 'flex flex-direction align-center '},[
        h( Input, {
          size: "large",
          modelValue: askText.value,
          autofocus: true,
          placeholder: '问题',
          'onInput': (event:any) => {
            askText.value = event.target.value;
          }
        }),
        h( Input, {
          size: "large",
          class:'ivu-mt-8',
          type:'textarea',
          modelValue: confirmText.value,
          autofocus: true,
          placeholder: '答案',
          'onInput': (event:any) => {
            confirmText.value = event.target.value;
          }
        })
      ] )
    }
  })
}

function handleConfirm3(i: number,title: string) {
  let element = listDate[i];
  if (!element) {
    return
  }
  instance?.proxy?.$Modal.info({
    title: title,
    onOk: () => {
      console.log('OK');
      handleGroupCede(element.userId);
    },
    onCancel: () => {
      console.log('Cancel')
    },
  });
}

function handleGroupName() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (!confirmText.value.length) {
    instance?.proxy?.$Message.warning("请输入...")
    return;
  }
  groupManager.setGroupName(Number(joinId),confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.groupName = confirmText.value;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

function handleDepict() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  if (!confirmText.value.length) {
    instance?.proxy?.$Message.warning("请输入...")
    return;
  }
  groupManager.setGroupDepict(Number(joinId),confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.depict = confirmText.value;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 更改我本群名称
function handleMyName() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER'
      && selfMember.userId != userStore.user?.id) {
    return
  }
  if (!confirmText.value.length) {
    instance?.proxy?.$Message.warning("请输入...")
    return;
  }
  groupManager.setGroupMemberName(Number(joinId),selfMember.userId,confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    selfMember.username = confirmText.value;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 更改我联系人备注
function handleMyRemark() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER'
      && selfMember.userId != userStore.user?.id) {
    return
  }
  if (!confirmText.value.length) {
    instance?.proxy?.$Message.warning("请输入...")
    return;
  }
  contactManager.setRemarkName(Number(joinId),confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    remarkName.value = confirmText.value;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 设置我的联系人 免打扰
function handleMyMuted(d : boolean) {

  contactManager.setNoticeRule(Number(joinId),d?IMIOContactNotice.reject:IMIOContactNotice.normal).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    selfMember.isMuted = d?IMIOContactNotice.reject:IMIOContactNotice.normal
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

function handleGroupMute(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.groupMuted(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isMute = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}
function handleGroupAsk() {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.setGroupQuestion(Number(joinId),askText.value,confirmText.value).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.ask = askText.value;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 设置私聊
function handleGroupChat(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.isPrivateChat(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isTalk = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 入群审核
function handleGroupApply(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.isApply(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isApproval = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

function handleGroupInviteApply(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.isInviteApply(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isInviteApply = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 入群审核
function handleGroupInvite(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }

  groupManager.isInvite(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isInvite = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 消息撤回
function handleRevoke(d : boolean) {
  if (selfMember.role != "MANAGER" && selfMember.role != 'MASTER') {
    return
  }
  groupManager.isRevokeMessage(Number(joinId),d).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.isRevoke = d;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 群转让
function handleGroupCede(userId : string) {

  groupManager.changeOwner(Number(joinId),userId).then(res => {
    instance?.proxy?.$Message.success("操作成功")
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

// 群类型
function handleGroupType() {
  let type : number = 0
  if (group.type == IMIOGroupType.private) {
    type = IMIOGroupType.protected
  } else {
    type = IMIOGroupType.private
  }
  groupManager.setGroupType(Number(joinId),type).then(res => {
    instance?.proxy?.$Message.success("操作成功")
    group.type = type;
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

function handleSignOut() {
  instance?.proxy?.$Modal.confirm({
    title: '退出群组',
    content: '确认退出群组吗',
    onOk: () => {
      signOut()
    },
    onCancel: () => {
    }
  });

}
function signOut() {
  groupManager.exit(Number(joinId)).then(res => {
    instance?.proxy?.$Message.info("退出成功");
    router.replace("/")

  }).catch(err => {
    instance?.proxy?.$Message.error("退出失败")
  })
}


</script>

<template>
  <ActionBar title="群详情"/>
  <div class="page-body">
    <AvatarCard class="ivu-m" :avatar="group.avatar" :title="group.groupName"/>

    <Scroll :height="Number(appStore.windowMedia.innerHeight) - 200">
    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        群聊成员
      </template>
      <template #extra>
        <div @click="goToNav(1)">
        查看更多成员
          <Icon type="ios-arrow-forward" />
      </div>
      </template>

      <div class="flex flex-wrap">
        <MemberGridItem v-for="(item,i) in listDate" :avatar="item.avatar" :name="item.nickname"/>
      </div>
    </Card>

    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        群聊信息
      </template>


      <CellGroup>
        <Cell title="群名称" :extra="group.groupName" @click="handleConfirm(1,'更改群名称')">
          <template #arrow>
            <Icon type="ios-arrow-forward" />
          </template>
        </Cell>
        <Cell title="群编号" :extra="group.groupNumber"/>
        <Cell title="群描述" @click="handleConfirm(2,'更改群描述')" :label="group?.depict"/>
        <Cell title="群公告" >
          <template #extra>
            <Icon type="ios-arrow-forward" />
          </template>

          <template #label>
            <div>
            <Text :ellipsis-config="{rows:3,tooltip:true}">

            </Text>
            </div>
          </template>
        </Cell>
        <Cell title="我本群昵称" @click="handleConfirm(3,'更改我本群昵称')" :extra="selfMember.username"/>
        <Cell title="群聊备注" :extra="remarkName" @click="handleConfirm(4,'修改群聊备注')"/>

      </CellGroup>

    </Card>

    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        聊天会话
      </template>


      <CellGroup>
        <Cell title="消息免打扰" extra="details" >
          <template #extra>
            <Switch  v-model="selfMember.isMuted" @on-change="handleMyMuted"/>
          </template>
        </Cell>

        <Cell title="群禁言" extra="details" v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch  v-model="group.isMute" @on-change="handleGroupMute"/>
          </template>
        </Cell>


      </CellGroup>

    </Card>



    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
      <template #title>
        群设置
      </template>


      <CellGroup>

        <Cell title="群转让"  v-if="group.isSelf" @click="isDrawer = true" >
          <template #extra>
            <Icon type="ios-arrow-forward" />
          </template>
        </Cell>

        <Cell title="入群问题"  v-if="group.isSelf" @click="handleConfirm2">
          <template #extra>
            <Icon type="ios-arrow-forward" />
          </template>
          <template #label>
            {{group?.ask}}
          </template>
        </Cell>
        <Cell title="群类型" extra="details" v-if="group.isSelf" @click="handleGroupType">
          <template #label>
            <div v-if="group.type == 1">公开</div>
            <div v-if="group.type == 2">默认</div>
            <div v-if="group.type == 3">不对外</div>
          </template>
          <template #extra>
            <Icon type="ios-arrow-forward" />
          </template>
        </Cell>
        <Cell title="私聊"  v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch v-model="group.isTalk" @on-change="handleGroupChat" />
          </template>
        </Cell>
        <Cell title="入群审核"  v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch  v-model="group.isApproval" @on-change="handleGroupApply"/>
          </template>
        </Cell>
        <Cell title="邀请审核"  v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch  v-model="group.isInviteApply" @on-change="handleGroupInviteApply"/>
          </template>
        </Cell>
        <Cell title="邀请入群"  v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch  v-model="group.isInvite" @on-change="handleGroupInvite"/>
          </template>
        </Cell>
        <Cell title="信息撤回"  v-if="selfMember.role == 'MANAGER' || selfMember.role == 'MASTER'">
          <template #extra>
            <Switch  v-model="group.isRevoke" @on-change="handleRevoke"/>
          </template>
        </Cell>

      </CellGroup>

    </Card>

    </Scroll>
    <FooterToolbar >
      <Button type="error" long @click="handleSignOut">退出群聊</Button>

    </FooterToolbar>


    <Drawer height="350" title="选择成员" placement="bottom" :closable="false"  v-model="isDrawer">
      <MemberItem v-for="(item,i) in listDate" :data="item" @click="handleConfirm3(i,'确定转让群吗')"/>
    </Drawer>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

.ivu-card {
  border-radius: 10px;

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
