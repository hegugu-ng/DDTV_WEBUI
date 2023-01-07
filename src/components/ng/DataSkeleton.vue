<template>
  <div class="ng-data-group">
    <el-skeleton animated v-for="count in 6" :key="count">
      <template #template>
        <div style="border: 1px solid #e9eaec; border-radius: 8px; background: #fff; padding: 10px">
          <el-skeleton-item variant="text" style="font-size: 15px; width: 40%" />
          <el-skeleton-item variant="rect" style="margin-top: 12px; height: 30px; width: 55%; display: block" />
        </div>
      </template>
    </el-skeleton>
  </div>
</template>
