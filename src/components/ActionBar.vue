<script setup lang="ts">
import {Dropdown, DropdownItem, DropdownMenu, Icon, Text} from "view-ui-plus";
import {useRouter} from "vue-router";

const router = useRouter()
interface MoreType  {
  name:string,// 名称
  action: string, // 动作：
  path:string //路由名称
}
const props = withDefaults(defineProps<{
  isBack: boolean,
  isMore: boolean,
  title: string,
  subtitle: string,
  moreList ?:Array<MoreType>
}>(), {
  isBack: true,
  isMore: false,
  title: '',
  subtitle:''
})

function callBack() {
  router.back()
}

function callMoreAction(more:MoreType) {
  if (more.action === '') {
    router.push(more.path)
  }
}
</script>

<template>
  <div class="action-bar flex justify-between align-center">

    <div class="action-back">
      <Icon type="ios-arrow-back" size="28" v-show="isBack" @click="callBack"/>
    </div>
    <div class="flex flex-direction justify-center align-center">
      <Text class="title" strong :ellipsis="true" v-show="title">{{ title }}</Text>
      <Text class="subtitle" v-show="subtitle"> {{ subtitle }}</Text>
    </div>
    <div class="action-more">
      <Icon type="ios-more" size="28" v-show="isMore && !moreList"/>

      <Dropdown placement="bottom-end" v-show="moreList">
          <Icon type="ios-more"></Icon>
        <template #list>
          <DropdownMenu v-if="moreList" v-for="item in moreList">
            <DropdownItem @click="callMoreAction(item)">{{ item.name }}</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
    </div>


  </div>
</template>

<style scoped>
.action-bar {
  width: 100%;
  height: 50px;
  background: #f5f7f9;
}

.action-more {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.action-back {
  width: 40px;
  height: 40px;
  margin-left: 15px;
}
.title {
  font-size: 18px;
}
.subtitle {
  font-size: 14px;
}
</style>