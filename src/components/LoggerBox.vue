<template>
    <!--展开动画-->
    <transition name="fade">
        <!--展开主页下的日志面板-->
        <div class="logger-view" v-if="logger_view.show">
            <div class="pane-toolbar">
            <div class="title">日志</div>
            <!--清空按钮-->
            <button type="button" class="ddtv-ui-bt toolbar-button flat icon-button" @click="logger_view.logs = []">
                <div class="bt-content">
                <i class="el-icon-delete-solid"></i>
                <span class="default-slot"></span>
                </div>
            </button>
            <!--关闭面板-->
            <button type="button" class="ddtv-ui-bt toolbar-button flat icon-button" @click="logger_view.show = false">
                <div class="bt-content">
                <i class="el-icon-close"></i>
                <span class="default-slot"></span>
                </div>
            </button>
            </div>
            <div class="logs">
                <div class="logger-message" v-for="(log,count) in logger_view.logs" :key="count">
                    <loglever :level="log.level" :levelshow="log.level != null ? true:false" />
                    <div class="message" :class="log.level != null ? 'm12':null">{{ log.msg }}</div>
                    <div class="date">{{ log.time }}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

