<template>
  <div class="home">
    <ng-ts-coredata></ng-ts-coredata>
    <ng-ts-roomcard></ng-ts-roomcard>
  </div>
</template>
<script>
import testCoredata from "../components/ng/Coredata";
import RoomCard from "../components/ng/RoomCardV3";
export default {
  components: {
    "ng-ts-coredata": testCoredata,
    "ng-ts-roomcard": RoomCard
  }
};
</script>
