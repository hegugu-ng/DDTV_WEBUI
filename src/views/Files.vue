<template>
    <div class="file">
        <div class="body-contain--nav">
            <div class="nav-title" v-if="table.FilesRoot.length == 0">全部文件</div>
            <div v-else>
                <span class="nav-item-title" @click="GoToNext">返回上一级</span>
                <span class="nav-item-sep">|</span>
                <span class="nav-item">
                    <span class="nav-item-title" @click="GoToHome">全部文件</span>
                    <span class="nav-item-sep">&gt;</span>
                </span>
                <span class="nav-item" v-for="(item, index) in table.FilesRoot" :key="index">
                    <span v-if="index + 1 == table.FilesRoot.length" class="is-disable-nav nav-item-title">{{ item
                    }}</span>
                    <span v-else class="nav-item-title" @click="GoToRoot(item)">{{ item }}</span>
                    <span v-if="index + 1 != table.FilesRoot.length" class="nav-item-sep">&gt;</span>
                </span>
            </div>
        </div>
        <div class="table-header">
            <table class="table-header-table table-all">
                <colgroup>
                    <col width="8%">
                    <col width="45%">
                    <col width="23%">
                    <col width="22%">
                </colgroup>
                <thead>
                    <tr class="table-header-row">
                        <th class="table-header-select table-selent">
                            <el-checkbox v-model="table.table_head.selent"
                                :indeterminate="table.table_head.isIndeterminate"
                                @change="handleCheckAllChange"></el-checkbox>
                        </th>
                        <th class="table-header-th table-td is-name">
                            文件名称
                        </th>
                        <th class="table-header-th table-td cursor-p">
                            修改日期
                        </th>
                        <th class="table-header-th table-td cursor-p">
                            大小
                        </th>
                    </tr>
                </thead>
            </table>

        </div>
        <div class="table-body">
            <table class="table-body-table table-all">
                <colgroup>
                    <col width="8%">
                    <col width="45%">
                    <col width="23%">
                    <col width="22%">
                </colgroup>
                <tbody>
                    <tr class="table-body-row " v-for="item in table.table_body" :key="item.index" :data-id="item.index"
                        :index="item.index">
                        <td class="row-checkbox table-selent">
                            <el-checkbox v-model="item.selent"
                                @change="handleCheckedFilesChange(item.index, item.selent)"></el-checkbox>
                        </td>
                        <td class="table-td row-icon-name"  @click="GoFiles(item)">
                            <div class="name-list">
                                <img v-if="item.type == 'folder'" :src="require('../assets/img/folder.png')"
                                    :alt="item.type" class="icon-list" />
                                <img v-else-if="item.type == '.mp4'" :src="require('../assets/img/mp4.png')"
                                    :alt="item.type" class="icon-list" />
                                <img v-else-if="item.type == '.flv'" :src="require('../assets/img/video.png')"
                                    :alt="item.type" class="icon-list" />
                                <img v-else :src="require('../assets/img/txt.png')" :alt="item.type"
                                    class="icon-list" />
                                <a :title="item.name" class="list-name-text">{{ item.name }}</a>
                            </div>
                        </td>
                        <td class="normal-column table-td row-datetime">
                            {{ item.date }}
                        </td>
                        <td class="normal-column table-td row-size">{{ item.size }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import { postFormAPI, getListAPI } from "../api";
// import { play_str } from "../utils/play_url"
export default {
    data() {
        return {
            table: {
                FilesRoot: [],
                table_head: { selent: false, isIndeterminate: false },
                checked: [],
                table_body: []


            },
        };
    },


    created: async function () {
    },

    mounted: async function () {
        var data = await this.GetFiles()
        let i = 0
        for (var item of data) {
            if (item.FileType == "") item.FileType = "folder"
            if (item.DateTime == "0001-01-01T00:00:00") item.DateTime = "-"
            if (item.Size == 0) item.Size = "-"
            let dataitem = { index: i, selent: false, type: item.FileType, name: item.Name, date: item.DateTime, size: item.Size }
            this.table.table_body.push(dataitem)
            i = i + 1
        }


    },
    methods: {
        GoToNext: async function(){
            if(this.table.FilesRoot.length == 1){
                await this.GoToHome()
            }
            var i = 1
            for (var root of this.table.FilesRoot) {
                if(i == this.table.FilesRoot.length - 1){ 
                    console.log(root)
                    await this.GoToRoot(root)
                }
                i = i+1
            }


        },
        GoToHome: async function () {
            this.table.FilesRoot = []
            this.table.table_body = []
            this.table.checked = []
            this.table.table_head.selent = false
            this.table.table_head.isIndeterminate = false
            var data = await this.GetFiles()
            let i = 0
            for (var item of data) {
                if (item.FileType == "") item.FileType = "folder"
                if (item.DateTime == "0001-01-01T00:00:00") item.DateTime = "-"
                if (item.Size == 0) item.Size = "-"
                let dataitem = { index: i, selent: false, type: item.FileType, name: item.Name, date: item.DateTime, size: item.Size }
                this.table.table_body.push(dataitem)
                i = i + 1
            }
        },
        GoToRoot: async function (gotoroot) {
            var data = await this.GetFiles()
            var newroot = []
            for (var root of this.table.FilesRoot) {
                for (var item of data) {
                    if (item.Name == root) {
                        data = item.children
                        break
                    }
                }
                newroot.push(root)
                if (root == gotoroot) break
            }
            let i = 0
            this.table.FilesRoot = newroot
            this.table.table_body = []
            this.table.checked = []
            this.table.table_head.selent = false
            this.table.table_head.isIndeterminate = false

            console.log(data)
            for (var item of data) {
                if (item.FileType == "") item.FileType = "folder"
                if (item.DateTime == "0001-01-01T00:00:00") item.DateTime = "-"
                if (item.Size == 0) item.Size = "-"
                let dataitem = { index: i, selent: false, type: item.FileType, name: item.Name, date: item.DateTime, size: item.Size }
                this.table.table_body.push(dataitem)
                i = i + 1
            }

        },
        GoFiles: async function (item) {
            console.log(item)
            if (item.type == "folder") {
                this.table.FilesRoot.push(item.name)
                var data = await this.GetFiles()
                for (var root of this.table.FilesRoot) {
                    for (var item of data) {
                        if (item.Name == root) {
                            data = item.children
                            break
                        }
                    }
                }
                let i = 0
                this.table.table_body = []
                this.table.checked = []
                this.table.table_head.selent = false
                this.table.table_head.isIndeterminate = false

                console.log(data)
                for (var item of data) {
                    if (item.FileType == "") item.FileType = "folder"
                    if (item.DateTime == "0001-01-01T00:00:00") item.DateTime = "-"
                    if (item.Size == 0) item.Size = "-"
                    let dataitem = { index: i, selent: false, type: item.FileType, name: item.Name, date: item.DateTime, size: item.Size }
                    this.table.table_body.push(dataitem)
                    i = i + 1
                }


            }else{
                let path = "./Rec/"
                for (var root of this.table.FilesRoot) {
                    path = path+root + "/"
                }

                let FileName =  path + item.name

                let host = window.apiObj.apiUrl
                if (window.apiObj.apiUrl == false) host = location.protocol + '//' + location.host

                window.open(host + "/api/File_GetFile?FileName="+FileName +"&CMD=File_GetFile")

                // let data = await getListAPI("File_GetFile",param)
                
            }
        },
        GetFiles: async function () {
            let data = await postFormAPI("File_GetFilePathList")
            return data.data.data

        },
        handleCheckAllChange: function (val) {
            if (val) {
                for (var item of this.table.table_body) {
                    item.selent = true
                    this.table.checked.push(item)
                }
            }
            else {
                for (var item of this.table.table_body) {
                    item.selent = false
                }
                this.table.checked = []
            }
            this.table.table_head.isIndeterminate = false
        },
        handleCheckedFilesChange: function (index, selent) {
            if (selent) {
                for (var item of this.table.table_body) {
                    if (item.index == index) {
                        this.table.checked.push(item)
                        break
                    }
                }
            }
            else {
                for (var item of this.table.checked) {
                    if (item.index == index) {
                        this.table.checked.splice(this.table.checked.indexOf(item), 1)
                        break
                    }
                }

            }
            if (this.table.checked.length == this.table.table_body.length && this.table.table_body.length > 0) { this.table.table_head.selent = true, this.table.table_head.isIndeterminate = false }
            if (this.table.checked.length < this.table.table_body.length && this.table.table_body.length > 0) this.table.table_head.isIndeterminate = true
            if (this.table.checked.length == 0) { this.table.table_head.selent = false, this.table.table_head.isIndeterminate = false }

            console.log(this.table.checked)

        }
    },

};
</script>

<style scoped>
td,
th {
    padding: 0;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

.body-contain--nav {
    width: 100%;
    padding: 0 0 0 24px;
    box-sizing: border-box;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
}

.table-all {
    width: 100%;
    table-layout: fixed;
}

.table-td {
    border-bottom: 1px solid #f7f8fa;
    position: relative;
}

.table-header-row {
    line-height: 1;
    height: 50px;
    line-height: 50px;
    color: #818999;
    text-align: left;
    font-size: 12px;
}

.table-body-row {
    height: 50px;
    line-height: 50px;
    color: #03081a;
    font-size: 12px;
}

.table-body-row:hover {
    background-color: #f7f9fc;
    border-color: #f7f9fc;
}

.table-selent {
    padding-left: 24px;
}

.icon-list {
    width: 32px;
    height: 32px;
}

.name-list {
    display: flex;
    align-content: center;
    align-items: center;
}

.list-name-text {
    padding-left: 12px;
    line-height: 40px;
    max-width: calc(100% - 60px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.nav-item-title {
    color: #06a7ff;
    max-width: 120px;
    cursor: pointer;
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.nav-title {
    font-size: 12px;
    color: #03081a;
    font-weight: 700;
}

.nav-item-sep {
    margin: 0 4px;
    color: #c4d8f4;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
}

.is-disable-nav {
    color: #818999;
    cursor: auto;
}

.nav-item {
    font-size: 14px;

}
</style>