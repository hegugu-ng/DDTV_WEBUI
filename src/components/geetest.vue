<template>
  <!--极验组件-->
  <button class="ng-login" id="gtbutten">登录</button>
</template>
<script>
import gt from "../utils/gt";
import { getListAPIv2 } from "@/api";
export default {
  data() {
    return {};
  },
  mounted: async function () {
    console.log("gt", gt);
    let res = await getListAPIv2(`/register?t=${new Date().getTime()}`);
    let gt_ = res.data.gt,
      challenge = res.data.challenge,
      offline = res.data.success,
      new_captcha = res.data.new_captcha,
      btn = document.getElementById("gtbutten");
    let gt_config = {
      product: "bind",
      gt: gt_,
      challenge: challenge,
      offline: !offline,
      new_captcha: new_captcha
    };
    let handle = function (captchaObj) {
      captchaObj
        .onReady(function () {
          console.debug("[UI] 极验已经准备好了");
        })
        .onSuccess(function () {
          const result = captchaObj.getValidate();
          console.log("result", result);
        });
      btn.onclick = function () {
        captchaObj.verify();
      };
    };

    // initGeetest(gt_config, handle);
  }
};
</script>
<style>
.ng-login {
  background: #7e7bdf;
  outline: none;
  border: none;
  width: 100%;
  padding: 10px 0 10px 0;
  color: #fff;
  border-radius: 9px;
}
</style>
