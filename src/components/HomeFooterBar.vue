<script setup lang="ts">

import {Text} from "view-ui-plus";

const  emit = defineEmits(['jump'])

</script>

<template>
  <div class="home-footer-bar flex justify-around">
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',0)">
      <Image src="../src/assets/home/home.svg" width="28px" height="28px"/>
      <text class="text-black">首页</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',1)">
      <Image src="./src/assets/home/chatbubbles.svg" width="28px" height="28px"/>
      <text class="text-black">对话</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',2)">
      <Image src="./src/assets/home/people.svg" width="28px" height="28px"/>
      <text class="text-black">联系人</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',3)">
      <Image src="./src/assets/home/person.svg" width="28px" height="28px"/>
      <text class="text-black">我</text>
    </div>
  </div>
</template>

<style scoped>
.home-footer-bar {
  width: 100%;
  height: 100%;
}
</style>