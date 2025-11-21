<script setup lang="ts">
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
import ActionBar from "@/components/ActionBar.vue";
import {useRoute, useRouter} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {getCurrentInstance, nextTick, onBeforeUnmount, reactive, ref} from "vue";
import ChatItem from "@/components/chat/ChatItem.vue";
import ChatTipItem from "@/components/chat/ChatTipItem.vue";
import {IMIOClient, IMIOMessage, IMIOTeamManager, IMIOTeam, IMIOChatManager, IMIOMessageSender} from "imio-sdk-lite";
import iconImg from "@/assets/icon/image-outline.svg";

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
const name = ref('')
const isLink = ref(false)
const listData = reactive<Array<IMIOMessage>>([])
let client = IMIOClient.getInstance();

let deviceKey = client.getDeviceKey()
let teamManager = IMIOTeamManager.getInstance().setClient(client);
let chatManager = IMIOChatManager.getInstance().setClient(client);
let page = 0;
let team: IMIOTeam | null = null
let tid = 0;
const citeMessage = ref<IMIOMessage>({}) // 引用信息


if (!route.query.tid) {
  router.back();
}
console.log('deviceKey',deviceKey);
try {
  tid = Number(route.query.tid);
} catch (e) {
  router.back();
}
let teamListener = {
  onMessage(message: IMIOMessage) {
    if (message.joinId.toString() == tid) {
      console.log("message",message);
      listData.push(message);
      listData.sort((a,b) => a.sentDate.getTime() - b.sentDate.getTime())
      nextTick(()=> {
        const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
        (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
      })
    }
  }
}
client.addTeamListener(teamListener)
onBeforeUnmount(() => {
  client.removeTeamListener(teamListener)
});

getTeam();

function getTeam() {
  teamManager.join(tid).then(res => {
    team = res;
    name.value = res.teamName;
    getListData()
  }).catch(err => {

  });
}

function getListData() {
  if (!team) {
    return
  }
  chatManager.teamMessageList(team.teamId, page, 3000).then((res: Array<IMIOMessage>) => {
    if (!res.length) {
      instance?.proxy?.$Message.success('没有任何消息');
      return
    }
    for (let item of res) {
      let findIndex = listData.findIndex((it: IMIOMessage) => it.messageId == item.messageId);
      if (findIndex == -1) {
        if (item.deviceKey == deviceKey) {
          // item.thumb = avatar;
        }
        listData.push(item)
      }
    }

    listData.sort((a, b) => a.sentDate.getTime() - b.sentDate.getTime());
    // console.log('list',listData);
    nextTick(() => {
      const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
      (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height!! + 100);
    })
  }).catch(err => {
    instance?.proxy?.$Message.error("聊天记录获取失败")
  })
}

function handleActionMore(i: number) {
  switch (i) {
    case 0:
      disband()
      break;
    case 1:
      regain()
      break;
    case 2:
      muted()
      break;
  }
}
function handleCite(i:number) {
  let item = listData[i];
  if (!item) {
    return
  }
  Object.assign(citeMessage.value,item)
}

function handleCiteCancel() {
  citeMessage.value = {}
}
function handleReachTop() {

}

function callFocus() {
  isTool.value = false
}


function disband() {
  teamManager.disband(tid).then(res => {
    instance?.proxy?.$Message.success("成功")
  }).catch(err => {
    instance?.proxy?.$Message.error("失败")
  })
}

function regain() {
  teamManager.regain(tid).then(res => {
    instance?.proxy?.$Message.success("成功")
  }).catch(err => {
    instance?.proxy?.$Message.error("失败")
  })
}

function muted() {
  teamManager.teamMuted(tid, true).then(res => {
    instance?.proxy?.$Message.success("成功")
  }).catch(err => {
    instance?.proxy?.$Message.error("失败")
  })
}

function callSend() {
  let messageSender = IMIOMessageSender.buildSimpleText(Number(tid), text.value);
  if (isLink && text.value.indexOf("http") > -1) {
    messageSender = IMIOMessageSender.buildImage(Number(tid), '', text.value);
  }
  if (citeMessage.value && citeMessage.value.messageId) {
    messageSender.withCite(citeMessage.value.messageId)
  }
  chatManager.sendToTeam(messageSender).then(res => {
    text.value = ''
    console.log("发送成功")
    citeMessage.value = {}
  }).catch(err => {
    console.warn("发送失败", err)
    text.value = ''
    let message = err.message + "";
    if (message.length) {
      instance?.proxy?.$Message.error(message)
    }
  });

}

</script>

<template>
  <ActionBar :title="name" :subtitle="appStore.linkStatus" :more-list="['解散','恢复','禁言']"
             @action="handleActionMore"/>

  <div class="page-body">
    <Scroll ref="scrollRef" class="scroll-content" :on-reach-top="handleReachTop"
            :height="Number(appStore.windowMedia.innerHeight) - 120">
      <div v-for="(item,index) in listData">
        <ChatTipItem :msg="item" v-if="item.label == 'tip'"
                     :style="[{width:(Number(appStore.windowMedia.innerWidth)-20)+'px'}]"/>
        <ChatItem :msg="item" v-else :mode="deviceKey != item.deviceKey"
                  :style="[{width:(Number(appStore.windowMedia.innerWidth)-20)+'px'}]" @call-quote="handleCite(index)"/>
      </div>
    </Scroll>
  </div>


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
        <Icon type="ios-add-circle-outline" size="28" @click="isTool = !isTool"/>
        <Tooltip content="点击切换文字与连接" placement="top" class="ivu-mt-4">
          <Icon v-show="!isLink" type="ios-link" size="25" @click="isLink = !isLink"/>
          <Icon v-show="isLink" type="ios-text-outline" size="30" @click="isLink = !isLink"/>
        </Tooltip>
      </div>


      <div class="flex-sub ivu-m-4">
        <Input type="textarea" v-model="text" :autofocus="true" size="large" suffix="md-add" :autosize="{minRows: 1}"
               @on-enter="callSend" @on-focus="callFocus" :placeholder="isLink?'复制图片链接':''"
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