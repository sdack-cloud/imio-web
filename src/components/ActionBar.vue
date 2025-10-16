<script setup lang="ts">
import {Dropdown, DropdownItem, DropdownMenu, Icon, Text} from "view-ui-plus";
import {useRouter} from "vue-router";

const router = useRouter()
const props = withDefaults(defineProps<{
  isBack: boolean,
  isMore: boolean,
  title: string,
  subtitle: string,
  back: string,
  backSize: string,
  more: string,
  moreSize: string,
  moreList ?:Array<string>
}>(), {
  isBack: true,
  isMore: false,
  back: 'ios-arrow-back',
  backSize: '28',
  more: 'ios-more',
  moreSize: '28',
  title: '',
  subtitle:''
})

const emits = defineEmits(['action']);


function callBack() {
  router.back()
}

</script>

<template>
  <div class="action-bar flex justify-between align-center">

    <div class="action-back flex flex-direction justify-center">
      <Icon :type="back" :size="backSize" v-show="isBack" @click="callBack"/>
    </div>
    <div class="flex flex-direction justify-center align-center">
      <Text class="title" strong :ellipsis="true" v-show="title">{{ title }}</Text>
      <Text class="subtitle" v-show="subtitle"> {{ subtitle }}</Text>
    </div>
    <div class="action-more flex flex-direction justify-center">
      <Icon :type="more" :size="moreSize" v-show="isMore && !moreList" @click="emits('action',0)"/>

      <Dropdown  class="flex justify-end" placement="bottom-end" v-show="moreList">
          <Icon :type="more" :size="moreSize"></Icon>
        <template #list>
          <DropdownMenu v-if="moreList" v-for="(item,i) in moreList">
            <DropdownItem @click="emits('action',i)">{{ item }}</DropdownItem>
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
  background: #e8eaec;
}

.action-more {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.action-back {
  width: 40px;
  height: 40px;
  margin-left: 0px;
}
.title {
  font-size: 18px;
}
.subtitle {
  font-size: 14px;
}

</style>
<style>
.ivu-dropdown-rel {
  display:flex;
  justify-content: end;
}
</style>