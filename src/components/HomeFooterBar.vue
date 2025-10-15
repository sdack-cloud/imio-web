<script setup lang="ts">

import {Text} from "view-ui-plus";

const  emit = defineEmits(['jump'])

</script>

<template>
  <div class="home-footer-bar flex justify-around">
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',0)">
      <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
      <text class="text-black">首页</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',1)">
      <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
      <text class="text-black">对话</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',2)">
      <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
      <text class="text-black">联系人</text>
    </div>
    <div class="flex flex-direction justify-center align-center" @click="emit('jump',3)">
      <Image src="https://i.loli.net/2017/08/21/599a521472424.jpg" width="28px" height="28px"/>
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