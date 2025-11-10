<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {getCurrentInstance, onMounted, reactive, ref} from "vue";
import {Input} from "view-ui-plus";
import {
  IMIOClient,
  IMIOContactManager,
  IMIOContact,
  IMIOMessage,
  IMIOUserInfoManager,
  IMIOMessageLabel
} from 'imio-sdk-lite'

let instance = getCurrentInstance();
let imioClient = IMIOClient.getInstance();
let imioContactManager = IMIOContactManager.getInstance().setClient(imioClient);
let userInfoManager = IMIOUserInfoManager.getInstance().setClient(imioClient);

const descMessage = ref("") // 操作回复信息
const listData = reactive<Array<IMIOMessage>>([]);

onMounted(() => {
  getMyNotice()
})



function getMyNotice() {
  userInfoManager.getNoticeMessage(IMIOMessageLabel.notice,1,300).then((res:Array<IMIOMessage>) => {
    if (res.length) {
      for (let item of res) {
        if (item.label == IMIOMessageLabel.action) {
          let index = listData.findIndex(it => it.messageId == item.messageId);
          if (index == -1) {
            listData.push(item)
          }
        }
      }
    } else {
      instance?.proxy?.$Message.success("没有通知")
    }
  }).catch(err => {
    instance?.proxy?.$Message.error("查询失败")
  })
}

function handelApply(index: number,isOK: boolean) {
  let listItem = listData[index];
  if (!listItem) {
    return;
  }
  imioContactManager.handleApply(listItem.messageId,isOK,descMessage.value).then(res => {
    instance?.proxy?.$Message.success("操作成功");
    listData.splice(index,1);
  }).catch(err => {
    instance?.proxy?.$Message.error("操作失败")
  })
}

function callAction(index: number) {
  let listItem = listData[index];
  if (!listItem) {
    return;
  }
  instance?.proxy?.$Modal.confirm({
    draggable:true,
    title:'回复',
    cancelText:"拒绝",
    okText:"同意",
    onOk: () => {
      handelApply(index,true)
    },
    onCancel: () => {
      handelApply(index,false)
    },
    render: (h:any) => {
      return h( Input, {
        size: "large",
        type:'textarea',
        modelValue: descMessage.value,
        autofocus: true,
        placeholder: '回复消息...',
        'onInput': (event:any) => {
          descMessage.value = event.target.value;
        }
      })
    }
  })
}
</script>

<template>
  <ActionBar title="新朋友"/>
  <div>
    <AvatarCard class="ivu-m" @action="callAction(index)" action-name="操作" v-for="(item,index) in listData" :avatar="item.thumb" :title="item.title" :subtitle="item.text" />
  </div>
</template>

<style scoped>

</style>