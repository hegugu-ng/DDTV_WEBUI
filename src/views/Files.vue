<template>
  <div id="files">
    <el-button  type="primary" @click="File_GetAllFileList">获取已录制的文件列表</el-button>
    <el-button style="margin-left: 10px;" type="primary" @click="File_GetFile">下载对应的文件</el-button>
    <el-button style="margin-left: 10px;" type="primary" @click="File_GetTypeFileList">分类获取已录制的文件总列表</el-button>


  </div>
</template>
<script>
import { postFormAPI, getListAPIv2 } from "../api";
export default {
  data() {
    return {
    };
  },
  mounted: function () {
    console.log(this.$route.params)
  },
  methods: {
    /**
     * 获取已录制的文件列表
     */
    File_GetAllFileList: async function () {
      let res = await postFormAPI("File_GetAllFileList");
      return res.data.data;
    },
    /**
     * 下载对应的文件
     * FileName	string		根据提交的文件路径和文件名下载该文件
     */
    File_GetFile: async function (FileName) {
      let data = {"FileName":FileName}
      let res = await postFormAPI("File_GetFile",data);
      return res.data;
    },
    /**
     * 分类获取已录制的文件总列表
     * 
     */
    File_GetTypeFileList: async function () {
      let res = await postFormAPI("File_GetTypeFileList");
      return res.data.data;
    }
  }
}
</script>