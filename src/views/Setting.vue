<template>
    <div class="setting">
        <ng-infocard title="系统设置" update="">
            <ng-datagroup :CardItem="CoreData"></ng-datagroup>
        </ng-infocard>
    </div>
</template>

<script>
import InfoCard from "../components/ng/InfoCard";

export default {
  components: {
    "ng-infocard": InfoCard,
  },
}
</script>

<style>
.setting {
    padding: 10px;
}
</style>