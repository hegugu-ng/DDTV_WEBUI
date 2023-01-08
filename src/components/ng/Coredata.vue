<template>
  <ng-infocard title="核心数据" :update="UpdateTime">
    <el-skeleton :loading="CoreData === null" animated>
      <template #template>
        <div class="ng-data-group">
          <div
            style="border: 1px solid #e9eaec; border-radius: 8px; background: #fff; padding: 10px"
            v-for="count in 6"
            :key="count"
          >
            <el-skeleton-item variant="text" style="font-size: 15px; width: 40%" />
            <el-skeleton-item variant="rect" style="margin-top: 16px; height: 30px; width: 55%; display: block" />
          </div>
        </div>
      </template>
      <template #default>
        <DataGroup :CardItem="CoreData"></DataGroup>
      </template>
    </el-skeleton>
  </ng-infocard>
</template>
<script>
import InfoCard from "./InfoCard";
// import DataGroupSkeleton from "./DataSkeleton";
export default {
  name: "CoreDataComponents",
  components: {
    // 基础卡片样式的组件
    "ng-infocard": InfoCard,
    // 数据展示骨架屏
    // "ng-cd-skeleton": DataGroupSkeleton
  },
  data: function () {
    return {
      UpdateTime: "刚刚",
      CoreData: null
    };
  }
};
</script>
