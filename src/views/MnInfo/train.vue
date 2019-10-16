// 培训管理
<template>
  <div class="train">
    <div class="title">
      <h1 :style="{fontSize: '20px'}">{{preMnTitle}}</h1>
      <div class="search-edit">
        <el-date-picker
          size="small"
          v-model="time"
          type="year"
          value-format="yyyy"
          @change="changeTime"
          placeholder="选择日期时间">
        </el-date-picker>
        <el-button v-if="getUserJurisdiction('AT30')" :style="{marginLeft: '10px'}" size="small" type="primary" @click="clickAdd" icon="el-icon-plus"></el-button>
        <!-- <el-button :style="{marginLeft: '10px'}" size="small" @click="clickAdd" icon="el-icon-edit-outline"></el-button> -->
      </div>
    </div>
    <div class="table">
      <el-table :data="dataList" border stripe header-cell-class-name="table-th">
        <el-table-column align="center" prop="title" label="标题"></el-table-column>
        <el-table-column align="center" prop="content" label="内容"></el-table-column>
        <el-table-column v-for="(item, index) in columns" :label="String(item.label)" :key="index" align="center">
          <el-table-column v-for="(item1, index1) in item.children" :key="index1" align="center"
            :label="String(item1.week)"
            :width="String(item.label).includes('/') ? '80px':'40px'"
            :prop="item.prop">
            <template slot-scope="scope">
              <span
                v-if="scope.row.trainPlanDetailList && scope.row.trainPlanDetailList[item1.week - 1] && scope.row.trainPlanDetailList[item1.week - 1].trainId"
                class="record"
                :style="{
                  backgroundColor: scope.row.trainPlanDetailList[item1.week - 1].status === 0 ? '#999999' :
                  scope.row.trainPlanDetailList[item1.week - 1].status === 1 ? '#339933':
                  scope.row.trainPlanDetailList[item1.week - 1].status === 2 ? '#0000FF' : '#FFF'
                }"
                @click="clickShowRecord(scope.row.trainPlanDetailList[item1.week - 1], item1.week - 1)">
                {{scope.row.trainPlanDetailList[item1.week - 1].trainId ? scope.row.trainPlanDetailList[item1.week - 1].deviceType : ''}}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="140px" prop="content" label="操作">
          <template slot-scope="scope">
            <el-button size="small" v-if="getUserJurisdiction('AT31')" type="" @click="clickEdit(scope.row)" icon="el-icon-edit-outline"></el-button>
            <el-button size="small" v-if="getUserJurisdiction('AT32')" type="warning" @click="clickDelete(scope.row)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="培训记录表" @close="close('recordform')" :visible.sync="isRecordDialog" width="40%">
      <div class="main">
        <el-form :model="recordform" size="small" ref="recordform" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <!-- <el-form-item label="培训类型："><span>{{recordform.deviceType}}</span></el-form-item> -->
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训人：">
                <!-- <el-input disabled v-model="realname" placeholder=""></el-input> -->
                <el-input disabled v-model="recordform.submiter" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="计划时间：">
                <el-input disabled v-model="recordform.firstDay" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行时间：">
                <el-input disabled v-model="recordform.confirmTime" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="培训内容：" prop="content" :rules="[{required: true, message: '请输入培训内容'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.content" placeholder="请输入培训内容"></el-input>
          </el-form-item>
          <el-form-item label="培训过程：" prop="flow" :rules="[{required: true, message: '请输入培训过程'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.flow" placeholder="请输入培训过程"></el-input>
          </el-form-item>
          <el-form-item label="培训结果：" prop="result" :rules="[{required: true, message: '请输入培训结果'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.result" placeholder="请输入培训结果"></el-input>
          </el-form-item>
          <el-form-item label="培训资料：">
            <div class="img">
              <template v-for="item in recordform.fileList">
                <div @click="clickShowImg(item ? hostDomain + item : '')" v-bind:key="item" style="margin-left: 5px;">
                  <img :src="item ? hostDomain + item : ''" alt="" style="cursor:pointer">
                </div>
              </template>
              <el-upload
                v-if="recordform.status !== 2"
                class="avatar-uploader"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="(res) => uploadSuccess(res)"
                :before-upload="(info) => beforeAvatarUpload(info, 3)">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item v-if="recordform.status == 2" label="确认人：">
            <el-input :style="{width: '50%'}" disabled v-model="recordform.confirmer" placeholder=""></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center">
        <el-button size="small" type="primary"
          v-if="(recordform.status === 1 && getUserJurisdiction('AT29')) || recordform.status == 0"
          @click="clickRecordConfirm('recordform')">{{`${recordform.status == 0 ? '确认并提交' : '确认'}`}}</el-button>
      </div>
    </el-dialog>
    
    <el-dialog :title="!isEdit ? '新建培训内容' : '编辑培训内容'" @close="close('addform')" :visible.sync="isShowAddMaintain" width="40%">
      <div class="main">
        <el-form :model="addform" size="small" align="left" ref="addform" label-width="120px">
          <el-form-item label="标题：" prop="title" :rules="[{ required: true, message: '请输入标题' }]">
            <el-input v-model="addform.title"></el-input>
          </el-form-item>
          <el-form-item label="培训内容：" prop="content" :rules="[{ required: true, message: '请输入培训内容' }]">
            <el-input type="textarea" :rows="2" v-model="addform.content"></el-input>
          </el-form-item>
          <el-divider style="height:3px"></el-divider>
          <el-form-item label="安全培训周：" prop="week" :rules="[{ required: true, message: '请选择安全培训周' }]">
            <el-select :style="{width: '100%'}" v-model="addform.week" multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in weekDataList"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" align="center">
        <el-button size="small" type="primary" @click="clickAddMaintain('addform')">更新信息</el-button>
        <el-button size="small" @click="isShowAddMaintain = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
            title=""
            :visible.sync="isVisibleImg"
            width="40%">
      <img :style="{display: 'block',width: '100%', height: '100%'}" :src="showImg || ''" alt="">
    </el-dialog>
  </div>
</template>

<script>
import config from "@/config";
import moment from "moment";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      time: "",
      preMnTitle: "",
      isShowAddMaintain: false,
      isRecordDialog: false,
      dataList: [],
      addform: {},
      isEdit: false,
      recordform: {},
      actionUrl: "/pvams/upload",
      columns: [],
      weekDataList: [],
      hostDomain: "",
      userId: "",
      realname: "",
      stationId: "",
      isVisibleImg: false,
      showImg: "",
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
        this.getTableData();
        this.getWeekData();
      }
    }
  },
  watch: {
    getStateData(v) {
      const stationId = this.$store.state.getTreeId.treeId.id;
      if (stationId && stationId.includes("s")) {
        this.stationId = stationId.slice(1, stationId.length);
        this.getTableData();
        this.getWeekData();
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    async getWeekData() {
      const {data: { data }} = await this.axios('/pvams/getDateWeek');
      if (data && data.length !== 0) {
        const dataNum = data[data.length-1];
        if (dataNum && dataNum.length !== 0 && dataNum.children && dataNum.children.length !== 0) {
          const weekData = dataNum.children[dataNum.children.length - 1];
          const weekDay = weekData.week;
          for (let i = 1; i <= weekDay; i++) {
            const obj = { label: `第${i}周`, value: i};
            this.weekDataList.push(obj);
          }
        }
        data.forEach(v => {
          v['label'] = `${v.month}月`;
        })
        this.columns = data || [];
      }
    },
    async getTableData() {
      this.loadingOpen();
      const params = {stationId: this.stationId, year: this.time}
      const { data: {data: { list = [], title = "" }} } = await this.axios('/pvams/train/getTrainPlan', { params });
      this.loadingClose();
      this.preMnTitle = title;
      if (list) {
        this.dataList = list;
      }
    },
    changeTime(v) {
      this.getTableData();
    },
    close(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    clickAdd() {
      this.isEdit = false;
      this.addform = {};
      this.isShowAddMaintain = true;
    },
    // 新增保养
    clickAddMaintain(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addform,
            userId: this.userId,
            stationId: this.stationId,
            year: this.time || '',
          };
          const url = this.addform.trainId ? '/pvams/train/updateTrainPlan' : '/pvams/train/addTrainPlan'
          const { data: { code } } = await this.axios.post(url, params)
          if (code === 200) {
            this.isShowAddMaintain = false;
            this.getTableData();
          }
        }
      })
    },
    async clickEdit(row) {
      this.isEdit = true;
      const { trainId = "" } = row;
      const { data: { code, data } } = await this.axios('/pvams/train/query', { params: { trainId } });
      if (code === 200) {
        this.isShowAddMaintain = true;
        this.addform = {
          title: data.title || "",
          content: data.content || "",
          week: data.week || [],
          trainId: data.trainId || "",
        };
      }
    },
    clickDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { trainId = "" } = row;
        const params = { trainId };
        const { data: { code } } = await this.axios('/pvams/train/delete', { params });
        if (code === 200) {
          this.$message({ type: 'success', message: '删除成功' });
          this.getTableData();
        }
      });
    },
    clickRecordConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status = "" } = this.recordform;
          const params = {
            ...this.recordform,
            submitUserId: this.recordform.submitUserId || this.userId,
            confirmUserId: status === 0 ? null : this.userId,
          };
          const url = status === 0 ? "/pvams/train/submitTrainPlan" : "/pvams/train/confirmTrainPlan"
          const {data} = await this.axios.post(url, params);
          if (data.code === 200) {
            this.isRecordDialog = false;
            this.$message({ type: "success", message: "提交成功" });
            this.getTableData();
          }
        }
      });
    },
    clickShowRecord(row) {
      this.recordform = {
        ...row,
        submiter: row.submiter || this.realname,
      };
      this.recordform.confirmTime = row.status === 0 ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : this.recordform.confirmTime;
      this.isRecordDialog = true;
    },

    /* 上传成功 */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        const { data } = res;
        if (this.recordform && !this.recordform.fileList) {
          this.recordform.fileList = [];
        }
        this.recordform.fileList.push(data);
      } else {
        this.$message({type: "error", message: res.message});
      }
    },
    // 上传前校验
    beforeAvatarUpload(file, type) {
      if (type === 1) {
        const isLt20M = file.size / 1024 / 1024 < 20;
        if (!isLt20M) this.$message.error('上传文件大小不得超过20mb!');
        return isLt20M;
      } else if (type === 2) {
        return true;
      } else if (type === 3) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        const isJPGPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPGPng) this.$message.error('上传头像图片只能是 JPG或者Png 格式!');
        if (!isLt10M) this.$message.error('上传大小不得超过10mb!');
        return isJPGPng && isLt10M;
      }
    },
    clickShowImg(img) {
      const imgSrc = img.indexOf('http://') === 0 ? img : `${this.hostname}${img}`
      this.isVisibleImg = true;
      this.showImg = imgSrc || "";
    }
  }
}
</script>
<style lang="less" scoped>
.train {
  .img {
    display: flex;
    align-items: center;
    img {
      display: block;
      width: 136px;
      height: 95px;
    }
    .avatar-uploader {
      float: left;
      width: 136px;
      height: 95px;
      text-align: center;
      line-height: 95px;
      border: 1px solid #cccccc;
      border-radius: 5px;
      margin: 10px;
    }
  }
  .title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    h1 {
      width: 70%;
      text-align: center;
    }
    .search-edit {
      width: 30%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      text-align: right;
    }
  }
  .table {
    margin-top: 20px;
    .record {
      display: block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      border-radius: 2px;
      background-color: #001529;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
<style lang="less">
.train {
    .img {
    .avatar-uploader {
      .el-upload {
        width: 100%;
      }
    }
  }
  .table-th {
    padding: 5px 0;
    background-color: #001529 !important;
    color: #ffffff;
  }
}
</style>