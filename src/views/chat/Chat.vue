<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {
  Button,
  Drawer,
  FooterToolbar,
  Icon, Image,
  List,
  ListItem,
  ListItemMeta, Modal,
  Scroll,
  Tag,
  Tooltip,
  Upload,
} from "view-ui-plus";
import ChatItem from "@/components/chat/ChatItem.vue";
import {ref, onMounted, getCurrentInstance, watchEffect, watch, reactive, nextTick, onBeforeUnmount} from "vue";
import {useRouter,useRoute} from "vue-router";
import MemberItem from "@/components/chat/MemberItem.vue";
import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOChatManager,
  IMIOMessage,
  IMIOMessageSender,
  IMIOMember, IMIOGroupManager, IMIOGroup,IMIOMessageSenderHint
} from 'imio-sdk-lite'
import ChatTipItem from "@/components/chat/ChatTipItem.vue";
import iconImg from '@/assets/icon/image-outline.svg';
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
const isLink = ref(false)
const citeMessage = ref<IMIOMessage>({}) // 引用信息

const name = ref("")
let joinId : string = '';
let page = 0;
const listData = reactive<Array<IMIOMessage>>([])
const listMember = reactive<Array<IMIOMember>>([])
const checkMember = reactive<Array<IMIOMember>>([]) // 群选择的成员

let group = reactive<IMIOGroup>({isSelf:false})

let imioClient = IMIOClient.getInstance();
let chatManager = IMIOChatManager.getInstance().setClient(imioClient);
let groupManager = IMIOGroupManager.getInstance().setClient(imioClient);

let contactList = imioClient.contactList;
let imioContact: IMIOContact|null = null;
let userId = ''
let avatar = ''




const messageListener = {
  onMessage(message: IMIOMessage): void {
    if (message.joinId.toString() == joinId) {
      if (imioContact.isGroup) {
        try {
          if (message.hintList) {
            for (let it of message.hintList) {
              let find = listMember.find(i => i.userId == it.destId);
              if (find) {
                it.thumb = find.avatar;
                it.src = find.avatar;
                it.tip = find.nickname;
              }
            }

          }
          if (message.notifyList) {
            for (let it of message.notifyList) {
              let find = listMember.find(i => i.userId == it.destId);
              if (find) {
                it.thumb = find.avatar;
                it.src = find.avatar;
                it.tip = find.nickname;
              }
            }
          }
          if (message.quietlyList) {
            for (let it of message.quietlyList) {
              let find = listMember.find(i => i.userId == it.destId);
              if (find) {
                it.thumb = find.avatar;
                it.src = find.avatar;
                it.tip = find.nickname;
              }
            }
          }
        } catch (e) {
        }
      }
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
imioClient.addMessageListener(messageListener);

onMounted(() => {
  page = 0;
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
  console.log('userInfo',userInfo)
  if (userInfo) {
    userId = userInfo.accountId;
    avatar = userInfo.avatar;
  }

  imioContact = contactList.find(it => it.joinId == joinId);
  // console.log('Contact =>',imioContact)
  getMessageList();
  if (imioContact && imioContact.isGroup) {
    getGroup()
  }
})


onBeforeUnmount(() => {
  // console.log("Chat onBeforeUnmount")
  imioClient.removeMessageListener(messageListener);
  let length = imioClient.messageListener.length;
  // console.log('length',length)
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

function handleReachTop() {
  getMessageList()
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
        if (item.fromId == userId) {
          item.thumb = avatar;
        }
        if (item.hintList) {
          for (let it of item.hintList) {
            let find = listMember.find(i => i.userId == it.destId );
            if (find) {
              it.thumb = find.avatar;
              it.src = find.avatar;
              it.tip = find.nickname;
            }
          }

        }
        if (item.notifyList) {
          for (let it of item.notifyList) {
            let find = listMember.find(i => i.userId == it.destId );
            if (find) {
              it.thumb = find.avatar;
              it.src = find.avatar;
              it.tip = find.nickname;
            }
          }
        }
        if (item.quietlyList) {
          for (let it of item.quietlyList) {
            let find = listMember.find(i => i.userId == it.destId );
            if (find) {
              it.thumb = find.avatar;
              it.src = find.avatar;
              it.tip = find.nickname;
            }
          }
        }
        listData.push(item)
      }
    }
    listData.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime());
    // console.log('list',listData);
    nextTick(()=> {
      const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
      (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
    })

  }).catch((e) => {
    instance?.proxy?.$Message.error('消息获取失败');
    console.error(e)
  })
}

function getMember() {
  groupManager.getMembers(Number(joinId),page).then((res:Array<IMIOMember>) => {
    if (res.length) {
      for (let item of res) {
        let index = listMember.findIndex(it => it.userId == item.userId);
        if (index == -1) {
          listMember.push(item)
        }
      }
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("成员获取失败")
  })
}

function getGroup() {
  groupManager.getGroupById(Number(joinId)).then(res => {
    if (res.isGroup) {
      getMember()
    }
    if (res) {
      Object.assign(group,res);
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("群信息获取失败")
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
function handleCiteCancel() {
  citeMessage.value = {}
}

function handleCite(i:number) {
  let item = listData[i];
  if (!item) {
    return
  }
  Object.assign(citeMessage.value,item)
}
function handleCopy(i:number) {

}
function handleDelMessage(i:number) {

}
function handleAt(i:number) {
  let item = listData[i];
  if (!item) {
    return
  }
  let find = listMember.find(it => it.userId == item.fromId);
  if (find) {
    checkMember.push(find)
    text.value = text.value+"  @"+find.nickname+"  "
  }
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
      text.value = newStr+'  @'
    }
  }
}

function checkMembers(i:number) {
    selectMember.value = false
    let element = listMember[i];
    if (!element) {
      return
    }

    let find = checkMember.find(it => it.userId == element.userId);
    if (!find) {
      checkMember.push(element);
    }
    text.value = `${text.value}${element.nickname}  `
}

function callFocus() {
  isTool.value = false
}



// 发送信息
function callSend() {
  isTool.value = false
  if (!imioContact) {
    return;
  }
  if (!joinId.length) {
    return
  }
  if (!text.value.length) {
    return;
  }
  let messageSender = IMIOMessageSender.buildSimpleText(Number(joinId), text.value);
  if (isLink && text.value.indexOf("http") > -1) {
    messageSender = IMIOMessageSender.buildImage(Number(joinId),'', text.value);
  }

  if (citeMessage.value.length) {
    messageSender.withCite(citeMessage.value.messageId)
  }
  if (!imioContact.isGroup) {
    chatManager.oneToOne(messageSender).then(res => {
      citeMessage.value = {}
      text.value = ''
      console.log("发送成功")
    }).catch(err => {
      console.warn("发送失败", err)
      text.value = ''
      citeMessage.value = {}
      let message = err.message+"";
      if (message.length) {
        instance?.proxy?.$Message.error(message)
      }
    });
  } else {
    if (checkMember.length) {
      // 检查实际文字里的 @ 人数
      messageSender.hintList = [];
      for (let item of checkMember) {
        let indexOf = text.value.indexOf(item.nickname);
        if (indexOf != -1) {
          let s = text.value.substring(indexOf-1,indexOf);
          if (s == '@') {
            let hint = new IMIOMessageSenderHint();
            hint.targetId = item.userId
            hint.targetName = item.username ? item.username : item.nickname
            messageSender.hintList.push(hint);
          }
        }
      }
    }
    chatManager.oneToMany(messageSender).then(res => {
      console.log("发送成功")
      checkMember.splice(0,checkMember.length)
      citeMessage.value = {}
      text.value = ''
    }).catch(err => {
      console.warn("发送失败", err);
      checkMember.splice(0,checkMember.length)
      citeMessage.value = {}
      text.value = ''
      let message = err.message+"";
      if (message.length) {
        instance?.proxy?.$Message.error(message)
      }
    });
  }


}
</script>

<template>
  <ActionBar :title="name" :subtitle="appStore.linkStatus" :isMore="true" @action="callBarAction" />
<!--  <Upload>-->

  <div class="page-body">
    <Scroll ref="scrollRef" class="scroll-content"  :on-reach-top="handleReachTop" :height="Number(appStore.windowMedia.innerHeight) - 120" >
      <div v-for="(item,index) in listData">
        <ChatTipItem  :msg="item" v-if="item.label == 'tip'"  :style="[{width:(Number(appStore.windowMedia.innerWidth)-20)+'px'}]"/>
        <ChatItem   :msg="item" v-else :mode="userId != item.fromId" :style="[{width:(Number(appStore.windowMedia.innerWidth)-20)+'px'}]" :is-at="imioContact.isGroup" @call-quote="handleCite(index)" @call-at="handleAt(index)" @call-copy="handleCopy(index)" @callDel="handleDelMessage(index)"/>
      </div>
    </Scroll>
  </div>
<!--  </Upload>-->

  <div class="footer-toolbar flex flex-direction">
    <div class="cite"  @click="handleCiteCancel">
      <div v-show="citeMessage.type == 'txt'">
        {{ citeMessage.text }}
      </div>
      <div v-show="citeMessage.type == 'img'">图片</div>
      <div v-show="citeMessage.type == 'audio'">语音</div>
      <div v-show="citeMessage.type == 'video'">视频</div>
      <div v-show="citeMessage.type == 'file'">文件</div>
      <div v-show="citeMessage.type == 'loc'">位置</div>
    </div>
    <div class="footer-toolbar-input flex justify-around">
      <div class="ivu-m-4 flex align-center">
        <Icon type="ios-add-circle-outline"  size="28" @click="isTool = !isTool"/>
        <Tooltip content="点击切换文字与连接" placement="top" class="ivu-mt-4">
          <Icon v-show="!isLink" type="ios-link"  size="25" @click="isLink = !isLink"/>
          <Icon v-show="isLink" type="ios-text-outline"  size="30" @click="isLink = !isLink"/>
        </Tooltip>
      </div>
      <div class="flex-sub ivu-m-4">
        <Input type="textarea"  v-model="text" :autofocus="true" size="large" suffix="md-add"  :autosize="{minRows: 1}"
        @input="onInput" @on-enter="callSend" @on-focus="callFocus" :placeholder="isLink?'复制图片链接':''"
        />
      </div>
      <div class="flex align-center ivu-m-4">
        <Button @click="callSend" size="small">
          发送
        </Button>
      </div>
    </div>

    <transition name="move-down">
    <div class="footer-toolbar-tool" v-show="isTool">
      <div class="flex  align-start">
        <Link to="https://tinyjpg.com" target="_blank" class="flex flex-direction align-center">
            <Image :src="iconImg" width="30px" height="30px"/>
          <Text>图片</Text>
        </Link>
      </div>
    </div>
    </transition>
  </div>

  <Drawer title="选择成员" placement="bottom" height="350" :closable="false" v-model="selectMember">
    <List item-layout="vertical">
      <ListItemMeta v-for="(item,i) in listMember" @click="checkMembers(i)" :avatar="item.avatar" :title="item.username && item.username.length ? item.username : item.nickname"></ListItemMeta>
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
  background: #f8f8f8;
  padding: 20px 20px 20px 20px;
}

.cite {
  padding-left: 10px;
  padding-right: 10px;
  background: #f8f8f8;
}
</style>