<template>
  <div class="userdatamn">
    <div class="main">
      <el-row :gutter="20" v-for="(item, index) in dataList" :key="index">
        <el-col :span="6" class="col col1">
          <span>{{item.dataInfoName}}</span>
        </el-col>
        <el-col class="col col-main" :span="7" :style="{marginLeft: index1 > 0 ? '30px' : ''}" v-for="(item1, index1) in item.data" :key="index1">
          <div class="content" >
            <p>{{item1.titleName}}</p>
            <el-row class="content-main">
              <el-col class="info-col" :span="12">
                <img src="../../assets/exelimg.jpg" alt="">
              </el-col>
              <el-col :span="12" class="col-content">
                <p>
                  <a :href="item1.link + stationId">
                    <el-button :style="{padding: 0}" type="text">模板下载</el-button>
                  </a>
                </p>
                <el-upload
                  class="upload-demo"
                  :show-file-list="false"
                  :action="item1.actionLink + stationId"
                  :on-success="(res) => uploadSuccess(res)"
                  :before-upload="(info) => beforeAvatarUpload(info)">
                  <el-button :style="{paddingTop: '20px'}" size="small" type="text">上传文件</el-button>
                </el-upload>
              </el-col>
            </el-row>
          </div>
        </el-col>
        <el-col :span="24">
          <el-divider style="height:3px"></el-divider>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import moment from "moment";

export default {
  data() {
    return {
      dataList: [
        {
          dataInfoName: "电站基础信息",
          data: [
            {
              titleName: "电站-基础信息",
              link: "/pvams/station/template/",
              actionLink: "/pvams/station/import/",
            },
            {
              titleName: "电站-设备信息",
              link: "/pvams/device/export/",
              actionLink: "/pvams/device/import/",
            }
          ],
        },
        {
          dataInfoName: "电站发电量及等效小时信息",
          data: [
            {
              titleName: "电站-实际发电量及等效小时数",
              link: "/pvams/power/export/",
              actionLink: "/pvams/power/import/",
            },
          ],
        },
        {
          dataInfoName: "电站财务信息",
          data: [
            {
              titleName: "电站-财务分析数据",
              link: "/pvams/finance/template/",
              actionLink: "/pvams/finance/import/"
            }
          ],
        },
        {
          dataInfoName: "数据分析信息",
          data: [
            {
              titleName: "电站-数据分析信息",
              link: "/pvams/data/template/",
              actionLink: "/pvams/data/import/"
            }
          ],
        },
      ],
      userId: "",
      realname: "",
      stationId: "",
    }
  },
  created() {
    this.hostDomain = `${config.HOST.pvamsDomain}`;
    this.userId = localStorage.getItem("userId");
    this.realname = localStorage.getItem("realname");
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) {
        // 
      }
    }
  },
  watch: {
    getStateData(v) {
      const stationId = this.$store.state.getTreeId.treeId.id;
      if (stationId && stationId.includes("s")) {
        this.stationId = stationId.slice(1, stationId.length);
        // 
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        this.getTableList(1);
      } else {
        this.$message({type: "error", message: res.message});
      }
    },
    // 上传前校验
    beforeAvatarUpload(file) {
      const isLt20M = file.size / 1024 / 1024 < 20;
      if (!isLt20M) this.$message.error('上传文件大小不得超过20mb!');
      return isLt20M;
    },
  },
}
</script>

<style lang="less" scoped>
.userdatamn {
  .main {
    .col {
      min-height: 150px;
    }
    .col-main {
      & > div {
        min-height: 150px;
        border-radius: 5px;
        box-shadow: 0px 1px 20px 1px rgba(4, 31, 71, 0.54)
      }
      .content {
        & > P {
          text-align: center;
          padding: 10px 0;
        }
        .info-col {
          img {
            display: block;
            margin: 0 auto;
            width: 40px;
            height: 40px;
          }
        }
        .col-content {
          text-align: right;
          padding-right: 20px;
        }
        .content-main {
          margin-top: 20px;
        }
      }
    }
    .col1 {
      padding-top: 30px;
      padding-left: 40px !important;
    }
  }
}
</style>
