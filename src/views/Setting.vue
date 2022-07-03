<template>
    <div class="setting">
        <ng-infocard title="自动转码总开关" update="">
            <p class="info-text-box info-text-war">
                本开关用于开启服务器的转码功能，开启后将会对录制的视频进行转码。
                <br/>该功能需要依赖 <a class="keyword2" href="http://ffmpeg.org/">ffmpeg</a> ，请根据 <a href="https://ddtv.pro/AdvancedFeatures/%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%A0%81.html" class="keyword2">进阶功能说明-自动转码</a> 页面当中的内容进行检查是否已经安装ffmpeg。
                <br/>关闭后录制的.avi文件将不会被转换为.mp4文件，但是可以节省性能。
            </p>
            <el-switch class="live-switch" :v-model="true" active-color="#46d485" inactive-color="#efe3e3"></el-switch>
        </ng-infocard>

        <ng-infocard title="弹幕录制总共开关(包括礼物、舰队、SC)" update="" style="margin-top:10px">
            <p class="info-text-box info-text-war">
                本开关用于配置全局的弹幕录制，如若关闭，将不会录制弹幕，即使房间开启了录制弹幕。
            </p>
            <el-switch class="live-switch" :v-model="true" active-color="#46d485" inactive-color="#efe3e3"></el-switch>
        </ng-infocard>

        <ng-infocard title="文件自动分片" update="" style="margin-top:10px">
            <p class="info-text-box info-text-war">
                设置本配置项目之后，将会将大文件自动切分成若干段。
            </p>
            <el-switch class="live-switch" :v-model="true" active-color="#46d485" inactive-color="#efe3e3"></el-switch>
        </ng-infocard>

        <ng-infocard title="B站登录设置" update="" style="margin-top:10px">
            <p class="info-text-box info-text-war">
                DDTV的一些功能依赖于B站账号，故需要登录B站账号才能使用。
            </p>
            <el-button type="success" @click="$router.push('/blogin')">前往登录管理</el-button>
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
.keyword2 {
    color: #f73131;
    font-style: normal;
    font-weight: 400;
    text-decoration: underline;
}
.setting {
    padding: 10px;
}

.config-title {
    padding: 10px 0 10px;
    font-size: 14px;
}


.info-text-war {
    border-left-color: #f66;
}
.info-text-box {
    background-color: #f3ffe8;
    padding: 12px 24px 12px 30px;
    margin: 2em 0;
    border-left-width: 4px;
    border-left-style: solid;
    background-color: #f8f8f8;
    position: relative;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;

    font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #304455;
}
.info-text-box:before {
    content: "!";
    background-color: #f66;
    position: absolute;
    top: 14px;
    left: -12px;
    color: #fff;
    width: 20px;
    height: 20px;
    border-radius: 100%;
    text-align: center;
    line-height: 20px;
    font-weight: bold;
    font-family: "Dosis", "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
    font-size: 14px;
}
</style>