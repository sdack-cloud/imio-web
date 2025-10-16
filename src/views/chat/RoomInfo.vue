<script setup lang="ts">

import ActionBar from "@/components/ActionBar.vue";
import AvatarCard from "@/components/profile/AvatarCard.vue";
import {Button, Card, Cell, CellGroup, FooterToolbar, Grid, GridItem, Icon, Scroll, Switch} from "view-ui-plus";
import MemberGridItem from "@/components/chat/MemberGridItem.vue";
import {useAppStore} from "@/stores/app.ts";
let appStore = useAppStore();
</script>

<template>
  <ActionBar title="群详情"/>
  <div class="page-body">
    <AvatarCard class="ivu-m"/>

    <Scroll :height="Number(appStore.windowMedia.innerHeight) - 150">
    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        <Icon type="ios-film-outline"></Icon>
        群聊成员
      </template>
      <template #extra>
        查看更多成员
        <Icon type="ios-film-outline"></Icon>
      </template>

      <div class="flex flex-wrap">
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
        <MemberGridItem/>
      </div>
    </Card>

    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        <Icon type="ios-film-outline"></Icon>
        群聊信息
      </template>


      <CellGroup>
        <Cell title="群名称" extra="details"/>
        <Cell title="群编号" extra="details"/>
        <Cell title="群公告" extra="details" label="detailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetails detailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetailsdetails"/>
        <Cell title="我本群昵称" extra="details"/>
        <Cell title="群聊备注" extra="details"/>

      </CellGroup>

    </Card>

    <Card class="ivu-m" :bordered="false" :dis-hover="true" shadow>
      <template #title>
        <Icon type="ios-film-outline"></Icon>
        聊天会话
      </template>


      <CellGroup>
        <Cell title="群名称" extra="details"/>
        <Cell title="群编号" extra="details">
          <template #extra>
            <Switch  />
          </template>
        </Cell>
        <Cell title="我本群昵称" extra="details"/>
        <Cell title="群聊备注" extra="details"/>

      </CellGroup>

    </Card>

    </Scroll>
    <FooterToolbar >
      <Button type="delete" long>退出群聊</Button>

    </FooterToolbar>
  </div>
</template>

<style scoped>
.page-body {
  height: 100%;
  width: 100%;
}

.ivu-card {
  border-radius: 10px;

}
</style>

<style>
.ivu-footer-toolbar-right {
  float: none;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
</style>
