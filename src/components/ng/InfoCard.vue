<template>
  <div class="ng-info-card">
    <div class="title">
      <div class="desc">{{title}}</div>
      <div class="date">{{update}}</div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "InforCard",
  props: ['title','update']
};
</script>


<style>
.ng-info-card {
  background-color: #fff;
  border: 1px solid #e5dbdb;
  border-radius: 5px;
  padding: 20px;
}
.ng-info-card > .title {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  /* padding: 0px 25px 0px 25px; */
}
.ng-info-card > .title > .desc {
  font-weight: bold;
}
.ng-info-card > .title > .date {
  font-size: 13px;
  color: #d3d3d3;
}
</style>