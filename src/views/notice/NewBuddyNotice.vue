<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {getCurrentInstance, ref} from "vue";
import {Input} from "view-ui-plus";
let instance = getCurrentInstance();

const descMessage = ref("") // 操作回复信息

function callAction() {

  instance?.proxy?.$Modal.confirm({
    draggable:true,
    title:'回复',
    onOk: () => {
      console.log('OK')
    },
    onCancel: () => {
      console.log('Cancel')
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
    <AvatarCard class="ivu-m" @action="callAction" action-name="操作"/>
  </div>
</template>

<style scoped>

</style>