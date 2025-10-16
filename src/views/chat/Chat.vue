<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {useAppStore} from "@/stores/app.ts";
import {Button, Drawer, FooterToolbar, Icon, Scroll, Upload} from "view-ui-plus";
import ChatItem from "@/components/chat/ChatItem.vue";
import {ref, onMounted, getCurrentInstance} from "vue";
import router from "@/router";
import MemberItem from "@/components/chat/MemberItem.vue";

let appStore = useAppStore();
let instance = getCurrentInstance();

appStore.windowMedia.innerHeight = window.innerWidth + ""
appStore.windowMedia.innerHeight = window.innerHeight + ""

const scrollRef = ref<HTMLElement | null>(null)

const isTool = ref(false)
const selectMember = ref(false)

function callBarAction(i:number | null) {
  // router.push('roomProfile')
  selectMember.value = true
}
function callFocus() {
  isTool.value = false
}
function callSend() {
  isTool.value = false
  const height = document.querySelector('.scroll-content .ivu-scroll-content')?.clientHeight;
  console.log(height);

  (scrollRef.value as any)?.$refs.scrollContainer.scrollTo(0, height)

}
</script>

<template>
  <ActionBar title="对话" :subtitle="appStore.windowMedia.innerHeight" :isMore="true" @action="callBarAction" />
  <Upload>

  <div class="page-body">
    <Scroll ref="scrollRef" class="scroll-content" :height="Number(appStore.windowMedia.innerHeight) - 120">
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
      <ChatItem/>
    </Scroll>
  </div>
  </Upload>

  <div class="footer-toolbar flex flex-direction">

    <div class="footer-toolbar-input flex justify-around">
      <div class="ivu-m-4 flex align-center">
        <Icon type="ios-add-circle-outline"  size="28" @click="isTool = !isTool"/>
      </div>
      <div class="flex-sub ivu-m-4">

        <Input type="textarea" :autofocus="true" size="large" suffix="md-add"  :autosize="{minRows: 1}"
        @on-enter="callSend" @on-focus="callFocus"
        />
      </div>
      <div class="flex align-center ivu-m-4">
        <Button @click="callSend" size="small">发送</Button>
      </div>
    </div>

    <transition name="move-down">
    <div class="footer-toolbar-tool" v-show="isTool">

    </div>
    </transition>
  </div>

  <Drawer title="选择成员" placement="bottom" height="350" :closable="false" v-model="selectMember">
    <MemberItem />
    <MemberItem />
    <MemberItem />
    <MemberItem />
    <MemberItem />
    <MemberItem />
    <MemberItem />
    <MemberItem />
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
}
</style>