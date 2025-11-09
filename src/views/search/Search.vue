<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import {ButtonGroup, Scroll} from "view-ui-plus";
import {useRouter} from "vue-router";
import {useAppStore} from "@/stores/app.ts";
import {getCurrentInstance, reactive, ref} from "vue";
import SearchItem from "@/components/search/SearchItem.vue";
import {IMIOClient,IMIOContactManager,IMIOContact,IMIOGroupManager,IMIOGroup} from 'imio-sdk-lite'
import { data } from "autoprefixer";
import {useUserStore} from "@/stores/user.ts";

let router = useRouter();
let appStore = useAppStore();
let instance = getCurrentInstance();
let userStore = useUserStore();
let imioClient = IMIOClient.getInstance();
let groupManager = IMIOGroupManager.getInstance().setClient(imioClient);

const mode = ref(true) // true 房间，false 人员
const text = ref("");
const listData = reactive<Array<IMIOGroup>>([]);
let page = 0
function callAdd(data:any) {
  if (data.isApproval || data.ask.length) {
    userStore.groupObj = JSON.stringify(data)
    router.push({
      name: 'AddApply',
      query: {
        gid: data.groupId
      },
    })
  }
}
function callJumpInfo(i:number) {
  router.push('RoomProfile')
}
function handleSearch() {
  page = 1;
  listData.splice(0);
  if (!text.value.length) {
    instance?.proxy?.$Message.error('请输入');
    return;
  }
  groupManager.search(mode.value?2:1,text.value,page).then((res:Array<IMIOGroup>) => {
    if (!res.length) {
      instance?.proxy?.$Message.success('没有结果');
      return
    }
    for (let item of res) {
      listData.push(item)
    }

  }).catch(err => {
    instance?.proxy?.$Message.error('请求失败');
  })
}
</script>

<template>
  <ActionBar title="添加朋友"/>
  <div class="page-body">
    <div class="flex flex-direction justify-center align-center">
      <ButtonGroup class="ivu-m-8 ">
        <Button :type="mode?'primary':''" @click="mode = true">找群</Button>
        <Button :type="mode?'':'primary'" @click="mode = false">找人</Button>
      </ButtonGroup>
      <div class="ivu-m-8 ivu-ml-16 ivu-mr-16 search" >
        <Input v-model="text" search enter-button placeholder="Enter something..." @on-search="handleSearch"/>
      </div>
    </div>
    <Scroll :height="(Number(appStore.windowMedia.innerHeight) - 150)">
      <SearchItem @add="callAdd" @click="callJumpInfo(index)" :data="item" v-for="(item,index) in listData" />
    </Scroll>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

.search {
  width: 90%;
}
</style>