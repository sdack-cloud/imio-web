<script setup lang="ts">

import {Avatar, AvatarList, Card, Icon, Poptip, Text,Time} from "view-ui-plus";
import {reactive} from "vue";
import {IMIOClient,IMIOContact,IMIOMessage,IMIOMessageSender} from 'imio-sdk-lite';
import {useUserStore} from "@/stores/user.ts";
const userStore = useUserStore();

interface Msg {
  messageId: string;
  joinId: number;
  fromId: string;
  fromName: string;
  destId: string;
  destName: string;
  cite: string;
  type: string;
  title: string;
  subtitle: string;
  text: string;
  secret: string;
  thumb: string;
  host: string;
  url: string;
  lng: string;
  lat: string;
  size: number;
  length: number;
  label: string;
  tag: string;
  sent: string;
  revoke: boolean;
  talk: number;
  citeData: Msg | null;
  sentDate: Date | null;
}



const emits = defineEmits(['callAvatar'])

const props = withDefaults(defineProps<{
  mode: boolean, // 模式
  msg : Msg | null
}>(), {
  mode:true,
  msg:  null
})

const excessStyle = reactive({
  color: '#f56a00',
  backgroundColor: '#fde3cf'
})

const avatarList = reactive([
  {
    src: 'https://dev-file.iviewui.com/BbnuuEiM0QXNPHVCvb3E2AFrawIjCkqW/avatar',
    tip: '史蒂夫·乔布斯'
  },
  {
    src: 'https://dev-file.iviewui.com/zhj85zgAfEjChCNIKT1LQENUIOyOYCaX/avatar',
    tip: '斯蒂夫·沃兹尼亚克'
  },
  {
    src: 'https://dev-file.iviewui.com/TkH54UozsINlex15TAMI00GElsfsKSiC/avatar',
    tip: '乔纳森·伊夫'
  },
  {
    src: 'https://dev-file.iviewui.com/xrzbBR99F6tYsDJPLNrvwhllowbuL7Gw/avatar',
    tip: '蒂姆·库克'
  },
  {
    src: 'https://dev-file.iviewui.com/bgrngoUb9A6UQ2kAwBFtnSNzhrh2qj1O/avatar',
    tip: '比尔·费尔南德斯'
  }
])


</script>

<template>
  <Card :bordered="false" :disHover="true" :padding="5" class="chat-card">

    <div class="flex" :class="props.mode?'':'flex-reverse-row'">

      <div class="chat-head">
        <Avatar size="large" :src="props.mode?msg?.thumb:userStore.userAvatar" @click="emits('callAvatar',msg)" width="15" height="15"/>
      </div>

      <div class="item-content flex-sub flex flex-direction " :class="props.mode?'align-start':'align-end'">
        <div class="flex align-center justify-start" :class="props.mode?'':'flex-reverse-row'">
          <Text class="chat-title">{{ props.mode ? msg?.fromName : msg?.destName }}</Text>
          <Time class="chat-time" :time="msg?.sentDate" v-if="msg?.sentDate && msg?.sentDate"/>
        </div>
        <div class="chat-content flex " :class="props.mode?'justify-start':'justify-end'">
          <Poptip word-wrap width="200">
            <Text class="chat-text">
              {{ msg?.text }}
            </Text>
            <template #content>
              <div class="flex flex-wrap align-center">
                <div class="ivu-p-8 flex flex-direction align-center">
                  <div>
                    <Icon type="md-document" size="20"/>
                  </div>
                  <div class="ivu-mt-4">复制</div>
                </div>
                <div class="ivu-p-8 flex flex-direction align-center">
                  <div>
                    <Icon type="md-quote" size="20"/>
                  </div>
                  <div class="ivu-mt-4">引用</div>
                </div>
                <div class="ivu-p-8 flex flex-direction align-center">
                  <div>
                    <Icon type="md-at" size="20"/>
                  </div>
                  <div class="ivu-mt-4">at</div>
                </div>
                <div class="ivu-p-8 flex flex-direction align-center">
                  <div>
                    <Icon type="md-undo" size="20"/>
                  </div>
                  <div class="ivu-mt-4">撤销</div>
                </div>

              </div>
            </template>
          </Poptip>
        </div>
        <div class="chat-sub" v-show="msg?.citeData">
          <Text class="chat-text-sub">
            {{msg?.citeData?msg?.citeData.text:''}}
          </Text>
        </div>
        <div class="chat-avatar">
          <AvatarList :list="avatarList" :max="10" :excess-style="excessStyle" size="small"/>
        </div>
      </div>

      <div class="flex flex-direction justify-center" v-show="false">
        <Icon type="md-refresh" size="23" color="#ed4014"/>
        <Icon type="md-radio-button-off" size="23" color="#2d8cf0"/>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.chat-card {
  margin: 0px 10px 0px 10px;
}

.item-content {
  width: 70%;
  margin-left: 10px;
  margin-right: 10px;
}

.ivu-card {
  background: transparent;
}

.chat-title {
  font-size: 12px;
  margin-right: 10px;
}

.chat-time {
  font-size: 12px;
  margin-right: 10px;
  color: #aaaaaa;
}

.chat-content {
  margin-top: 5px;
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
  font-size: 15px;
  font-family: "Hiragino Sans GB";
  transition: all 0.2s ease-in-out;
}

.chat-sub {
  margin: 10px;
  font-size: 12px;

}
</style>