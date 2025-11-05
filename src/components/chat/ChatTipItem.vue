<script setup lang="ts">

import {Msg} from "@/components/chat/ChatItem.vue";

const props = withDefaults(defineProps<{
  msg : Msg | null
}>(), {
  msg:  null
})
</script>

<template>
  <div class="ivu-p-8 flex align-center justify-center">
  <Text>
    {{ msg?.text }}
  </Text>
  </div>
</template>

<style scoped>

</style>