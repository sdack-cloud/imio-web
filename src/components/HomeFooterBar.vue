<script setup lang="ts">

import {Text} from "view-ui-plus";

const  emit = defineEmits(['jump'])

const props = withDefaults(defineProps<{
  index: number,
}>(), {
  index: 0,
})

</script>

<template>
  <div class="home-footer-bar flex justify-around">
    <div class="ivu-mt-4 ivu-mb-4 flex flex-direction align-center flex-sub" @click="emit('jump',0)">

      <img src="@/assets/home/home.svg" width="28" height="28" v-show="index == 0" />
      <img src="@/assets/home/home-outline.svg" width="28" height="28" v-show="index != 0"/>
      <Text class="text-black">首页</Text>
    </div>
    <div class="ivu-mt-4 ivu-mb-4 flex flex-direction  align-center flex-sub" @click="emit('jump',1)">
      <img src="@/assets/home/chatbubbles.svg" width="28" height="28" v-show="index == 1"/>
      <img src="@/assets/home/chatbubbles-outline.svg" width="28" height="28" v-show="index != 1"/>
      <text class="text-black">对话</text>
    </div>
    <div class="ivu-mt-4 ivu-mb-4 flex flex-direction  align-center flex-sub" @click="emit('jump',2)">
      <img src="@/assets/home/people.svg" width="28" height="28" v-show="index == 2"/>
      <img src="@/assets/home/people-outline.svg" width="28" height="28" v-show="index != 2"/>
      <text class="text-black">联系人</text>
    </div>
    <div class="ivu-mt-4 ivu-mb-4 flex flex-direction  align-center flex-sub" @click="emit('jump',3)">
      <img src="@/assets/home/person.svg" width="28" height="28" v-show="index == 3"/>
      <img src="@/assets/home/person-outline.svg" width="28" height="28" v-show="index != 3"/>
      <text class="text-black">我</text>
    </div>
  </div>
</template>

<style scoped>

.home-footer-bar {
  line-height: 20px;
  width: 100%;
  height: 100%;
}
</style>