<template>
    <div>
        <el-alert :title="InfoData.Note" type="warning" show-icon :closable="false" />
        <div class="getBox" v-if="S">
            <h2>一串数字，验证你是你</h2>
            <div class="zyxdesc">请您使用您报名时的QQ：{{ id }}在 5分钟 内向 QQ：2949434209 发送下列数字：</div>
            <div class="success-st ispass">{{ valcode }}</div>
            <el-button style="margin-top: 20px;" type="primary" @click="getVal">我已发送，可以开始</el-button>
        </div>

        <div class="zyx-info-bt" v-else>
            <h2>实名信息填写，请在5分钟内完成填写。</h2>
            <div class="zyxdesc" style="margin-top: 20px;">取消自由行报名</div>
            <el-button style="margin-top: 20px;" type="primary" @click="open('取消自由行', Cancel)">取消自由行报名（点了就取消，无法恢复）
            </el-button>
            <div class="zyxdesc" style="margin-top: 20px;">点击上面取消按钮视为已经知晓取消后无法恢复，之后不受理任何因误操作导致的取消。</div>

            <div class="zyxdesc">修改角色</div>
            <div class="zyxdesc">你可以全新修改你的自由行，但是请按照规范填写角色。</div>
            <div class="zyxdesc">第一天角色，不来空</div>
            <el-input v-model="DAY1" placeholder="第一天角色" clearable />
            <div class="zyxdesc">第二天角色，不来空</div>
            <el-input v-model="DAY2" placeholder="第二天角色" clearable />
            <div class="zyxdesc">第三天角色，不来空</div>
            <el-input v-model="DAY3" placeholder="第三天角色" clearable />
            <el-button style="margin-top: 20px;" type="primary" @click="Cheng">提交修改角色</el-button>
            <!-- <div v-if="Is_Certification">
                <div class="zyxdesc">实名信息填写后无法修改，请同学们在填写时一定核对清楚，填错了将无法核验入场。</div>
                <div class="zyxdesc">姓名</div>
                <el-input v-model="name" placeholder="请填写您证件上的姓名" clearable />
                <div class="zyxdesc">居民身份证号码</div>
                <el-input v-model="idcard" placeholder="居民身份证号码" clearable />
                <div class="zyxdesc">手机号（非常重要，之后修改角色、取消自由行将使用手机接收验证码）</div>
                <div class="phonegroup">
                    <el-input type="text" maxlength="11" v-model="phone" placeholder="中国大陆11位手机号码" clearable />
                    <<el-button @click="getyzcode" :disabled="showbtn ? attcode : true">{{ showbtn ? '获取验证码' : code_ts }}
                    </el-button>
                </div>
                 <div class="zyxdesc">验证码</div>
                <el-input v-model="t_yzcode" placeholder="验证码" clearable />

                <el-button style="margin-top: 20px;" type="primary" @click="putData">提交认证信息</el-button>
            </div>-->
        </div>

    </div>
</template>

<script>
import axios from 'axios';
import { getListAPIv2 } from "../api";

export default {
    data() {
        return {
            InfoData: {
                Note: "展会期间请全程佩戴口罩、遵守防疫规定、保持距离。",
            },
            category: null,
            id: null,
            valcode: "",
            ID: "",
            DAY1: "",
            DAY2: "",
            DAY3: "",
            name: "",
            idcard: "",
            phone: "",
            S: true,
            token: "",
            confirm: true,  //提交验证按钮判断
            attcode: true,  //点击获取验证码按钮判断
            showbtn: true, // 展示获取验证码或倒计时按钮判断
            yzcode: '',
            t_yzcode: '',
            code_ts: '获取验证码', //倒计时提示文字
            sec: 60, // 倒计时秒数
            GeetData: {
                product: "bind",
                gt: null,
                challenge: null,
                offline: null,
                new_captcha: null,
            },
            Is_Certification: false

        }
    },
    mounted: async function () {
        await this.GetNote();

        if (this.$route.query.id == null) {
            this.$router.push("/sjxespptq");
        }
        this.id = this.$route.query.id;
        this.category = this.$route.query.category;
        this.GetCodeData(this.id, this.category);
        // let res = await getListAPIv2("https://sjxfreenin.ngworks.cn/Is_Certification?id=" + this.id + "&category=" + this.category);
        // if (res.data.data == 0) this.Is_Certification = true
        // else this.Is_Certification = false

        // await this.GeetRegister();
        // let GeetData = this.GeetData;
        // if (
        //     typeof GeetData.gt == "null" ||
        //     typeof GeetData.challenge == "null" ||
        //     typeof GeetData.offline == "null" ||
        //     typeof GeetData.new_captcha == "null"
        // ) {
        //     this.openWindows("极验初始化失败", "验证失败");
        //     return;
        // }
        // initGeetest(this.GeetData, this.Geethandle);
    },
    watch: {
        DAY3: function (value) {
            var reg = /\b1[3456789]\d{9}\b/g
            let val = reg.test(value)
            if (val) {
                this.attcode = false
            } else {
                this.attcode = true
            }
        }
    },
    methods: {
        GetNote: async function () {
            let res = await getListAPIv2("https://sjxfreenin.ngworks.cn/Info?type=2");
            this.InfoData.Note = res.data.message
        },
        open(active, fun) {
            this.$confirm(`取消后无法恢复，确认继续取消吗？`, active, {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                fun()
                this.$message({
                    type: 'success',
                    message: `${active}成功!`
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: `已取消${active}`
                });
            });
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
            let btn = document.getElementById("getcode");
            btn.onclick = function () {
                captchaObj.verify();
            };
        },
        GeetCallBack: async function (result) {
            console.debug("[UI]", result);
            await this.getyzcode()
            // window.open("https://cloud.ngworks.cn/ts.mp4")
        },

        putData: async function () {
            let res = await getListAPIv2(`https://sjxfreenin.ngworks.cn/Certification?id=${this.id}&category=${this.category}&token=${this.token}&name=${this.DAY1}&idcard=${this.DAY2}&phone=${this.DAY3}&code=${this.t_yzcode}`);
            if (res.data.code != 0) {
                this.$message({
                    type: 'error',
                    message: res.data.message
                });
                return
            }
            this.$message({
                type: 'success',
                message: res.data.message
            });
            this.$router.push("/sjxespptq");

        },
        getyzcode: async function () {
            let res = await getListAPIv2(`https://sjxfreenin.ngworks.cn/sendSms?phone=${this.DAY3}`);
            if (res.data.code != 0) {
                this.$message({
                    type: 'error',
                    message: res.data.message
                });
                return
            }
            var timer = setInterval(() => {
                this.sec = this.sec - 1
                this.code_ts = this.sec + 'S后重试'
                this.showbtn = false
                if (this.sec === 0) {
                    clearInterval(timer)
                    this.sec = 60
                    this.code_ts = this.sec + 'S后重试'
                    this.showbtn = true
                }
            }, 1000)
        },
        GetCodeData: function (id, ct) {
            let url = `https://sjxfreenin.ngworks.cn/GetValCode?id=${id}&category=${ct}`
            axios({
                method: 'get',
                url: url,
            }).then(response => {
                const content = response.data;
                console.log(content)
                if (content.code == -1) {
                    this.$message({
                        type: 'error',
                        message: content.message
                    });
                } else {
                    this.valcode = content.tcode;
                }
            }).catch((error) => {
            })
        },
        getVal: function () {
            let url = `https://sjxfreenin.ngworks.cn/CheckValCode?id=${this.id}`
            axios({
                method: 'get',
                url: url,
            }).then(response => {
                const content = response.data;
                console.log(content)
                if (content.code == -1) {
                    this.$message({
                        type: 'error',
                        message: content.message
                    });
                } else {
                    this.S = false,
                        this.token = content.token;
                }
            }).catch((error) => {
            })


        },
        Cancel: function () {
            let url = `https://sjxfreenin.ngworks.cn/Cancel?id=${this.id}&category=${this.category}&token=${this.token}`
            axios({
                method: 'get',
                url: url,
            }).then(response => {
                const content = response.data;
                console.log(content)
                if (content.code == -1) {
                    this.$message({
                        type: 'error',
                        message: content.message
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: content.message
                    });
                    this.$router.push("/sjxespptq");
                }
            }).catch((error) => {
            })


        },
        Cheng: function () {
            let url = `https://sjxfreenin.ngworks.cn/ChengData?id=${this.id}&category=${this.category}&token=${this.token}&day1s=${this.DAY1}&day2s=${this.DAY2}&day3s=${this.DAY3}`
            axios({
                method: 'get',
                url: url,
            }).then(response => {
                const content = response.data;
                console.log(content)
                if (content.code == -1) {
                    this.$message({
                        type: 'error',
                        message: content.message
                    });
                } else {
                    this.$message({
                        type: 'success',
                        message: content.message
                    });
                    this.$router.push("/sjxespptq");

                }
            }).catch((error) => {
            })
            return data


        }
    }
}
</script>
<style>
.phonegroup {
    display: flex;
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