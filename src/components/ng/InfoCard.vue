<template>
  <div class="ng-info-card">
    <div class="title">
      <div class="desc">{{ title }}</div>
      <div class="date">{{ update }}</div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "InfoCard",
  props: ["title", "update"]
};
</script>

<style>
.ng-info-card {
  background-color: #fff;
  border: 1px solid #ebeef5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 22px 0 rgb(0 0 0 / 10%);
  color: #242f57;
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
  /* color: #d3d3d3; */
}
</style>
