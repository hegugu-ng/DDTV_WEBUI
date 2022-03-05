<template>
  <div class="ng-data-group">
    <div class="data-item" v-for="(item, count) in CardItem" :key="count">
      <div class="title">{{ item.title }}</div>
      <div class="data">{{ item.data }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DataGroup",
  props: ['CardItem']
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
.ng-data-group {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(6.5rem, 1fr));
  grid-row-gap: 2vh;
  grid-column-gap: 2vh;
}
.ng-data-group > .data-item {
  border: 1px solid #e9eaec;
  border-radius: 8px;
  background: #fff;

  padding: 10px;
}
.ng-data-group > .data-item:hover {
  /* margin-top: 20px; */
  box-shadow: 1px 0px 20px 0 rgb(59 64 72 / 16%);
}
.ng-data-group > .data-item > .title {
  font-size: 15px;
}
.ng-data-group > .data-item > .data {
  margin-top: 7px;
  font-size: 30px;
  font-weight: bold;
}
</style>