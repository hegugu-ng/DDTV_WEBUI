<template>
    <div>
        <el-alert :title="InfoData.Note" type="warning" show-icon :closable="false" />
        <div class="Banner">
            <img class="Banner-img" :src="InfoData.Banner" />
        </div>
        <div class="BaseInfo Text-font">
            <div class="main-title">{{ InfoData.Name }}</div>
            <div>{{ InfoData.Date }}</div>
        </div>
        <div style="display: flex;padding: 0 10px;">
            <div v-for="(item, index) in InfoData.Category" :key="index" class="tag">{{ item.name }}</div>
        </div>

        <div class="ProjectTitle">品类信息</div>
        <div style="padding:10px">
            <el-radio-group v-model="radio1" text-color="#000" fill="#f6e2a3" size="default">
                <el-radio-button v-for="(item, index) in InfoData.Category" :key="index" :label="item.id">{{ item.name
                }}</el-radio-button>
            </el-radio-group>
        </div>
        <div class="ProjectTitle">输入您报名时的QQ</div>
        <el-input v-model="id" placeholder="请输入qq" clearable />
        <div style="display: flex; align-items: center; margin: 10px">
            <input type="checkbox" id="save7days" v-model="rule" />
            <label class="ng-check-ladel" for="save7days">我已知晓并承诺遵守防疫政策和着装规范</label>
        </div>
        <div style="height: 4.2rem;"></div>
        <div class="foot-Bar">
            <el-button class="tsbt" id="gtbutten">查询自由行</el-button>

        </div>
        <el-drawer v-model="S" direction="btt" size="70%" title="参展详情">
            <div style="padding:15px">
                <div :class="pass == '通过' ? 'success-st ispass' : 'success-st nopass'">{{ pass }}</div>
                <div style="margin-left: 20px;" :class="pass == '通过' ? 'success-st ispass' : 'success-st nopass'">编号：{{
                        uid
                }}
                </div>
                <div class="zyxdesc" style="margin-top: 20px;">第一天角色</div>
                <div>{{ DAY1 }}</div>
                <div class="zyxdesc">第二天角色</div>
                <div>{{ DAY2 }}</div>
                <div class="zyxdesc">第三天角色</div>
                <div>{{ DAY3 }}</div>
                <el-button style="margin-top: 20px;" type="primary" @click="GoToCheng">详情</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getListAPIv2 } from "../api";
import axios from 'axios';
export default {
    data() {
        return {
            InfoData: {
                Note: "展会期间请全程佩戴口罩、遵守防疫规定、保持距离。",
                Banner: "//open.ngworks.cn/PIN2XQ6y1660014637880.jpeg@400h_70q_progressive.jpg",
                Name: "成都·IGS×世界线动漫展",
                Date: "2022.08.26 09:00 - 08.28 17:00",
                Category: [{ name: "Coser", id: 1 }, { name: "Lolita", id: 2 }, { name: "汉服", id: 3 }, { name: "摄影师", id: 4 }, { name: "兽装", id: 5 }, { name: "特摄", id: 6 }]

            },
            rule: false,
            radio1: "1",
            id: null,
            uid: null,
            pass: "",
            ID: "",
            DAY1: "",
            DAY2: "",
            DAY3: "",
            S: false,
            GeetData: {
                product: "bind",
                gt: null,
                challenge: null,
                offline: null,
                new_captcha: null,
            },

        }
    },
    mounted: async function () {
        await this.GetNote();
        await this.GeetRegister();
        await this.GetProgectInfo();
        let GeetData = this.GeetData;
        if (
            typeof GeetData.gt == "null" ||
            typeof GeetData.challenge == "null" ||
            typeof GeetData.offline == "null" ||
            typeof GeetData.new_captcha == "null"
        ) {
            this.openWindows("极验初始化失败", "验证失败");
            return;
        }
        initGeetest(GeetData, this.Geethandle);
    },
    methods: {
        /**
         * 获取项目信息
         */
        GetNote: async function () {
            let res = await getListAPIv2("https://sjxfreenin.ngworks.cn/Info?type=1");
            this.InfoData.Note = res.data.message
        },
        GetProgectInfo: async function () {
            let res = await getListAPIv2("https://sjxfreenin.ngworks.cn/ProgectInfo");
            this.InfoData.Banner = res.data.Banner
            this.InfoData.Name = res.data.Name
            this.InfoData.Date = res.data.Date
            this.InfoData.Category = res.data.Category
        },
        GeetRegister: async function () {
            let res = await getListAPIv2(`https://sjxfreenin.ngworks.cn/register?t=${new Date().getTime()}`);
            console.log(res);
            let GeetData = this.GeetData;
            GeetData.gt = res.data.gt;
            GeetData.challenge = res.data.challenge;
            GeetData.offline = !res.data.success;
            GeetData.new_captcha = res.data.new_captcha;
        },
        // 初始化验证码
        Geethandle: function (captchaObj) {
            let openWindows = this.openWindows,
                GeetCallBack = this.GeetCallBack;
            captchaObj
                .onReady(function () {
                    console.debug("[UI] 极验已经准备好了");
                })
                .onSuccess(function () {
                    var result = captchaObj.getValidate();
                    if (!result) {
                        openWindows("请先完成验证", "验证失败");
                        return;
                    }
                    GeetCallBack(result);

                    console.debug("[UI] 用户完成验证");
                });
            let btn = document.getElementById("gtbutten");
            btn.onclick = function () {
                captchaObj.verify();
            };
        },
        GeetCallBack: async function (result) {
            console.debug("[UI]", result);
            await this.GETUNSTER(result.geetest_challenge, result.geetest_validate, result.geetest_seccode)
        },
        GoToCheng: async function () {
            this.$router.push(`/sjxcheng?id=${this.id}&category=${this.radio1}`);
        },

        GETUNSTER: async function (challenge, validate, seccode) {
            if (this.id == null) {
                this.$message({
                    type: 'error',
                    message: "必须输入QQ号"
                });
                return
            }
            if (this.rule == false) {
                this.$message({
                    type: 'error',
                    message: "必须同意着装规范和防疫政策"
                });
                return
            }
            let url = "https://sjxfreenin.ngworks.cn/GetUserAnswer?id=" + this.id + "&category=" + this.radio1 + "&challenge=" + challenge + "&validate=" + validate + "&seccode=" + seccode;
            let res = await getListAPIv2(url);
            let content = res.data
            if (res.data.code == -1) {
                this.$message({
                    type: 'error',
                    message: content.message
                });
                return
            }
            this.uid = content.ID;
            this.pass = content.pass;
            this.DAY1 = content.day1;
            this.DAY2 = content.day2;
            this.DAY3 = content.day3;
            this.S = true

        }
    }
}
</script>
<style>
.Banner {
    display: flex;
    flex-direction: row;
    justify-content: center;
}

.Banner-img {
    max-width: 100%;
    max-height: 100%;
    -o-object-fit: contain;
    object-fit: contain;
}

.BaseInfo {
    padding: 10px;
}

.main-title {
    font-size: 1.2rem;
    padding-bottom: 10px;
}

.Text-font {
    color: #212121;
    font-weight: 700;
    font-size: .85333rem;
    line-height: 1.17333rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-flex: 1;
    -webkit-flex: 1 1;
    -ms-flex: 1 1;
    flex: 1 1;
}

.lbe {
    margin: 0 .53333rem .53333rem 0;
    display: inline-block;
    color: #505050;
    background-color: #ffe1b3 !important;
}

.ProjectTitle {
    font-size: .9rem;
    border-left: 5px solid #ec9d23;
    margin: 8px 0;
    padding: 0 5px;
}

.tsbt {
    background-color: #ec9d23 !important;
    border-color: #ff9b00 !important;
    border-radius: 2.13333rem !important;
    width: 90% !important;
    height: 72% !important;
    color: #fff !important;

}

.el-radio-button {
    margin-right: 10px;
    margin-bottom: 5px;
    /* color: #ff5687 !important;
    background-color: #fff2f6 !important; */
}

.el-radio-button__original-radio:checked+.el-radio-button__inner {
    color: #ff5687 !important;
    background-color: #f6e2a3 !important;
}

.el-radio-button__inner {
    color: #a1858d;
    background-color: #fff2f6;
    border-radius: 10px !important;
    border: 1px solid #dcdfe6 !important;
    border-left: 1px;
}

.el-radio-button:first-child .el-radio-button__inner {
    border-radius: 10px !important;
}

.el-radio-button__inner:hover {
    color: #000;
}

.foot-Bar {
    display: flex;
    justify-content: center;
    align-items: stretch;
}

.tag {
    border-radius: .21333rem;
    height: .85333rem;
    line-height: .85333rem;
    min-height: .85333rem;
    font-size: .64rem;
    padding: .1rem .2rem;
    position: relative;
    margin-right: .21333rem;
    margin-bottom: .21333rem;
    background-color: #67C23A;
    color: #fff;
}

.foot-Bar {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 4.2rem;
    background-color: #fff;
}

.ng-check-ladel {
    font-size: 12px;
}

.getBox {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.zyxdesc {
    width: 100%;
    padding: 10px 0;
}

.btdesc {
    margin-top: 20px;
}

.success-st {
    font-size: 30px;
    font-weight: bold;
    padding: 10px;
    display: inline;
    border-radius: 8px;
}

.ispass {
    COLOR: #67C23A;
    border: 1px solid #67C23A;
}

.nopass {
    color: #F56C6C;
    border: 1px solid #F56C6C;
}

.zyx-info-bt {
    padding: 20px 10px;
}
</style>