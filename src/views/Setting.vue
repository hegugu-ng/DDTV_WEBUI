<template>
    <div class="setting">
        <ng-infocard title="自动转码总开关" update="">
            <p class="info-text-box info-text-war">
                本开关用于开启服务器的转码功能，开启后将会对录制的视频进行转码。
                <br />该功能需要依赖 <a class="keyword2" href="http://ffmpeg.org/">ffmpeg</a> ，请根据 <a
                    href="https://ddtv.pro/AdvancedFeatures/%E8%87%AA%E5%8A%A8%E8%BD%AC%E7%A0%81.html"
                    class="keyword2">进阶功能说明-自动转码</a> 页面当中的内容进行检查是否已经安装ffmpeg。
                <br />关闭后录制的.avi文件将不会被转换为.mp4文件，但是可以节省性能。
            </p>
            <el-switch class="live-switch" size="large" active-text="开启视频转码" inactive-text="关闭视频转码" v-model="liverecode"
                active-color="#46d485" inactive-color="#efe3e3" :before-change="beforeChangeRecode"></el-switch>
        </ng-infocard>

        <ng-infocard title="弹幕录制总共开关(包括礼物、舰队、SC)" update="" style="margin-top:10px">
            <p class="info-text-box info-text-war">
                本开关用于配置全局的弹幕录制，如若关闭，将不会录制弹幕，即使房间开启了录制弹幕。
            </p>
            <el-switch class="live-switch" size="large" active-text="开启弹幕录制" inactive-text="关闭弹幕录制" v-model="livedamaku"
                active-color="#46d485" inactive-color="#efe3e3" :before-change="beforeChangeDanmuk"></el-switch>
        </ng-infocard>

        <ng-infocard title="文件自动分片" update="" style="margin-top:10px">
            <p class="info-text-box info-text-war">
                设置本配置项目之后，将会将大文件自动切分成若干段。
                <br />修改后需要点击后面的的“提交”按钮。
                <br />如设置小于100MB可能出现错误，推荐大于100MB。
            </p>
            <el-switch class="live-switch" size="large" active-text="开启文件分片" inactive-text="关闭文件分片"
                v-model="liverecelip" active-color="#46d485" inactive-color="#efe3e3"></el-switch>
            <el-input-number v-model="num" :min="1" :disabled="!liverecelip" style="margin-left: 10px;" />
            <el-select :disabled="!liverecelip" style="width: 65px;margin-left: 10px;" v-model="value" class="m-2"
                placeholder="Select">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-button style="margin-left: 10px;" type="primary" @click="SetCutVdio">提交</el-button>
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
import { postFormAPI } from "../api";

export default {
    components: {
        "ng-infocard": InfoCard,
    },
    data() {
        return {
            liverecode: true,
            livedamaku: true,
            liverecelip: true,
            num: 100,
            options: [
                {
                    value: 'MB',
                    label: 'MB',
                },
                {
                    value: 'GB',
                    label: 'GB',
                },
            ],
            value: "MB",
            timer: null
        }
    },
    mounted: async function () {
        // this.timer = setInterval(this.System_Config, 5000);
        this.System_Config()
    },
    beforeUnmount() {
        clearInterval(this.timer);
    },
    methods: {
        beforeChangeRecode: async function () {
            let param = {
                state: !this.liverecode
            };
            let res = await postFormAPI("Config_Transcod", param);
            this.$message({ type: 'success', message: res.data.data });
            this.System_Config()
            return true
        },

        beforeChangeDanmuk: async function () {
            let param = {
                state: !this.livedamaku
            };
            let res = await postFormAPI("Config_DanmuRec", param);
            this.$message({ type: 'success', message: res.data.data });
            this.System_Config()
            return true
        },

        System_Config: async function () {
            let res = await postFormAPI("System_Config");
            let data = res.data.data;
            console.log(data)
            for (var item of data) {
                switch (item.Key) {
                    case 21:
                        let number = (Number(item.Value) / 1024) / 1024;
                        if (number == 0) {
                            this.liverecelip = false;
                        } else {
                            if (number >= 1024) { this.num = number / 1024; this.value = "GB" }
                            else { this.num = number; this.value = "MB" }
                            this.liverecelip = true;
                        }
                        break;
                    case 7:
                        if (item.Value == 'True') {
                            this.liverecode = true;
                        } else {
                            this.liverecode = false;
                        }

                        break;
                    case 16:
                        if (item.Value == 'True') {
                            this.livedamaku = true;
                        } else {
                            this.livedamaku = false;
                        }
                        break;
                }
            }
        },
        SetCutVdio: async function () {
            let Data;
            if (this.liverecelip) {
                Data = this.num * 1024;
                if (this.value == "MB") {
                    Data = Data * 1024
                } else {
                    Data = Data * 1024 * 1024
                }
            } else {
                Data = 0
            }
            let param = {
                Size: Data
            };
            if (Data < 104857600 && Data > 0) {
                this.$message({ type: 'error', message: "操作失败！不应该小于100MB。" });
                this.value = "MB"
                this.num = 100
                return
            }
            // 发请求
            let res = await postFormAPI("Config_FileSplit", param);
            this.$message({ type: 'success', message: res.data.data });
            this.System_Config()
        }
    }

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