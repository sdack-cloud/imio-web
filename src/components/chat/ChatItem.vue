<script setup lang="ts">

import {Avatar, AvatarList, Card, Icon, Poptip, Text} from "view-ui-plus";
import {reactive} from "vue";

const emits = defineEmits(['callAvatar'])

const props = withDefaults(defineProps<{
  mode: boolean, // 模式
}>(), {
  mode:true,
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
        <Avatar size="large" src="https://i.loli.net/2017/08/21/599a521472424.jpg" @click="emits('callAvatar',0)" width="15" hidden="15"/>
      </div>

      <div class="item-content flex-sub flex flex-direction " :class="props.mode?'align-start':'align-end'">
        <div class="flex align-center justify-start" :class="props.mode?'':'flex-reverse-row'">
          <Text class="chat-title">昵称</Text>
          <Text class="chat-time">20:21</Text>
        </div>
        <div class="chat-content flex " :class="props.mode?'justify-start':'justify-end'">
          <Poptip width="200">
            <Text class="chat-text">

              昵称非典事件复读机啊十分健康撒防护服极客飒好放假看到回复就撒返回就开始放假康师傅哈萨克覅哦呜佛阖家快乐收到回复暗示法尽快回复见客户撒东风街道啊


            </Text>
          </Poptip>
        </div>
        <div class="chat-sub">
          <Text class="chat-text-sub">

            昵称非典
          </Text>
        </div>
        <div class="chat-avatar">
          <AvatarList :list="avatarList" :max="10" :excess-style="excessStyle" size="small"/>
        </div>
      </div>

      <div class="flex flex-direction justify-center">
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
  width: 100%;
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