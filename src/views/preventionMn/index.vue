/**
* 预防性维护
*/
<template>
  <div class="prevention">
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
        <el-button v-if="getUserJurisdiction('AT12')" :style="{marginLeft: '10px'}" size="small" type="primary" @click="clickAdd" icon="el-icon-plus"></el-button>
      </div>
    </div>
    <div class="table">
      <el-table :data="dataList" border stripe header-cell-class-name="table-th">
        <el-table-column align="center" width="120px" prop="acSide" label="交流侧(A)"></el-table-column>
        <el-table-column align="center" width="120px" prop="secondaryEquipment" label="二次设备(B)"></el-table-column>
        <el-table-column align="center" width="120px" prop="dcSide" label="直流侧(C)"></el-table-column>
        <el-table-column v-for="(item, index) in columns" :label="String(item.label)" :key="index" align="center">
          <el-table-column
            v-for="(item1, index1) in item.children" :key="index1" align="center" :label="String(item1.week)"
            :width="String(item.label).includes('/') ? '80px':'40px'"
            :prop="item.prop">
            <template slot-scope="scope">
              <span
                v-if="scope.row.deviceMaintainDetailList && scope.row.deviceMaintainDetailList[item1.week - 1] && scope.row.deviceMaintainDetailList[item1.week - 1].maintainId"
                class="record"
                :style="{
                  backgroundColor: scope.row.deviceMaintainDetailList[item1.week - 1].status === 0 ? '#999999' :
                  scope.row.deviceMaintainDetailList[item1.week - 1].status === 1 ? '#339933':
                  scope.row.deviceMaintainDetailList[item1.week - 1].status === 2 ? '#0000FF' : '#FFF'
                }"
                @click="clickShowRecord(scope.row.deviceMaintainDetailList[item1.week - 1], item1.week - 1)">
                {{scope.row.deviceMaintainDetailList[item1.week - 1].maintainId ? scope.row.deviceMaintainDetailList[item1.week - 1].deviceType : ''}}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column fixed="right" align="center" width="140px" prop="content" label="操作">
          <template slot-scope="scope">
            <el-button size="small" v-if="getUserJurisdiction('AT13')" type="" @click="clickEdit(scope.row)" icon="el-icon-edit-outline"></el-button>
            <el-button size="small" v-if="getUserJurisdiction('AT14')" type="warning" @click="clickDelete(scope.row)" icon="el-icon-delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="预防性保养记录表" :visible.sync="isRecordDialog" width="40%"  @close="handleClose('recordform')">
      <div class="main">
        <el-form :model="recordform" size="small" ref="recordform" label-width="100px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维保类型：">
                <el-input disabled v-model="recordform.deviceType" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维保人：">
                <el-input disabled v-model="realname" placeholder=""></el-input>
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
                <el-input disabled v-model="recordform.maintainTime" placeholder=""></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="维保内容：" prop="content" :rules="[{required: true, message: '请输入维保内容'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.content" placeholder="请输入维保内容"></el-input>
          </el-form-item>
          <el-form-item label="维保过程：" prop="flow" :rules="[{required: true, message: '请输入维保过程'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.flow" placeholder="请输入维保过程"></el-input>
          </el-form-item>
          <el-form-item label="维保结果：" prop="result" :rules="[{required: true, message: '请输入维保结果'}]">
            <el-input :disabled="recordform.status !== 0" type="textarea" :rows="2" v-model="recordform.result" placeholder="请输入维保结果"></el-input>
          </el-form-item>
          <el-form-item label="维保资料：">
            <div class="img">
              <template v-for="item in recordform.fileList">
                <div @click="clickShowImg(item ? hostDomain + item : '')" v-bind:key="item" style="margin-left: 5px;">
                  <img :src="item ? hostDomain + item : ''" alt="">
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
          <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item v-if="recordform.status !== 0" label="确认人：">
                  <el-input v-model="recordform.confirmer" disabled placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
            
          </el-row>
          
        </el-form>
      </div>
      <div v-if="recordform.status !== 2" slot="footer" align="center">
        <el-button
          v-if="(recordform.status == 1 && getUserJurisdiction('AT11')) ||  recordform.status ==0 "
          size="small"
          type="primary"
          @click="clickRecordConfirm('recordform')">{{`${recordform.status == 0 ? '确认并提交' : '确认'}`}}</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="新建保养内容" :visible.sync="isShowAddMaintain" width="40%">
      <div class="main">
        <el-form :model="addform" size="small" align="left" ref="addform" label-width="120px">
          <el-form-item label="交流侧：" prop="acside">
            <el-input v-model="addform.acside"></el-input>
          </el-form-item>
          <el-form-item label="保养周：" prop="acsideWeek">
            <el-select :style="{width: '100%'}" v-model="addform.acsideWeek" @change="changeWeek" multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in weekDataList"
                :disabled="item.disabled"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider style="height:3px"></el-divider>
          <el-form-item label="二次设备：" prop="secondaryEquipment">
            <el-input v-model="addform.secondaryEquipment"></el-input>
          </el-form-item>
          <el-form-item label="保养周：" prop="secondaryEquipmentWeek">
            <el-select :style="{width: '100%'}" v-model="addform.secondaryEquipmentWeek" @change="changeWeek" multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in weekDataList"
                :disabled="item.disabled"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider style="height:3px"></el-divider>
          <el-form-item label="直流侧：" prop="dcSide">
            <el-input v-model="addform.dcSide"></el-input>
          </el-form-item>
          <el-form-item label="保养周：" prop="dcSideWeek">
            <el-select :style="{width: '100%'}" v-model="addform.dcSideWeek" @change="changeWeek" multiple placeholder="请选择">
              <el-option
                v-for="(item, index) in weekDataList"
                :disabled="item.disabled"
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
        <el-button size="small" @click="clickCancle('addform')">取消</el-button>
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
import config from "../../config";
import moment from "moment";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      time: "",
      disWeekList: [],
      isShowAddMaintain: false,
      isRecordDialog: false,
      dataList: [1],
      stationId: "",
      preMnTitle: "",
      addform: {},
      realname: "",
      actionUrl: "/pvams/upload",
      columns: [],
      weekDataList: [],
      recordform: {},
      userId: "",
      hostDomain: "",
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
      this.loadingOpen();
      const {data: { data }} = await this.axios('/pvams/getDateWeek');
      this.loadingClose();
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
    // 
    changeTime(v) {
      this.getTableData();
    },
    async getTableData() {
      this.loadingOpen();
      const params = {stationId: this.stationId, year: this.time || ''}
      const { data: {data: { list = [], title = "" }} } = await this.axios('/pvams/maintain/getStationMaintainPlan', { params });
      this.loadingClose();
      this.preMnTitle = title;
      if (list) {
        this.dataList = list;
      }
    },
    // change周
    changeWeek(v) {
      const arr = v || [];
      const acsideWeek = this.addform.acsideWeek;
      const dcSideWeek = this.addform.dcSideWeek;
      const secondaryEquipmentWeek = this.addform.secondaryEquipmentWeek;
      this.disWeekList = acsideWeek.concat(dcSideWeek.concat(secondaryEquipmentWeek));
      this.weekDataList.forEach((v) => {
        if (this.disWeekList.includes(v.value)) {
          v.disabled = true;
        } else {
          v.disabled = false;
        }
      });
    },
    clickAdd() {
      this.addform = {
        acsideWeek: [],
        dcSideWeek: [],
        secondaryEquipmentWeek: [],
      };
      this.weekDataList && this.weekDataList.forEach((v) => v.disabled = false);
      this.isShowAddMaintain = true;
    },
    async clickEdit(row) {
      const { maintainId = "" } = row;
      const { data: { code, data } } = await this.axios('/pvams/maintain/query', { params: {maintainId} });
      if (code === 200) {
        this.isShowAddMaintain = true;
        this.addform.acside = data.acSide.name || "";
        this.addform = {
          acside: data.acSide.name || "",
          acsideWeek:  data.acSide.week || "",
          dcSide:  data.dcSide.name || "",
          dcSideWeek:  data.dcSide.week || "",
          secondaryEquipment:  data.secondaryEquipment.name || "",
          secondaryEquipmentWeek:  data.secondaryEquipment.week || "",
          maintainId:  data.maintainId,
        }
      }
    },
    clickDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { maintainId = "" } = row;
        const params = { maintainId };
        const { data: { code } } = await this.axios('/pvams/maintain/delete', { params });
        if (code === 200) {
          this.$message({ type: 'success', message: '删除成功' });
          this.getTableData();
        }
      });
    },
    clickCancle(formName) {
      this.$refs[formName].resetFields();
      this.isShowAddMaintain = false;
    },
    // 新增保养
    async clickAddMaintain(formName) {
      const acSide = {
        name: this.addform.acside,
        week: this.addform.acsideWeek,
      };
      const dcSide = {
        name: this.addform.dcSide,
        week: this.addform.dcSideWeek,
      };
      const secondaryEquipment = {
        name: this.addform.secondaryEquipment,
        week: this.addform.secondaryEquipmentWeek,
      };
      const params = {acSide, secondaryEquipment, dcSide, stationId: this.stationId, year: this.time, maintainId: this.addform.maintainId || null};
      if (!this.addform.acside && !this.addform.secondaryEquipment && !this.addform.dcSide) {
        this.$message({type: "error", message: "请选择其中一项"});
        return;
      }
      if (this.addform.acsideWeek.length === 0 && this.addform.secondaryEquipmentWeek.length === 0 && this.addform.dcSideWeek.length == 0) {
        this.$message({type: "error", message: "请选择保养周"});
        return;
      }
      const url = this.addform.maintainId ? '/pvams/maintain/updateMaintainPlan' : '/pvams/maintain/addMaintainPlan'
      const {data} = await this.axios.post(url, params);
      if (data.ok) {
        this.isShowAddMaintain = false;
        this.$refs[formName].resetFields();
        this.getTableData();
      }
    },
    async clickRecordConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { status = "" } = this.recordform;
          const params = {
            ...this.recordform,
            maintainer: this.recordform.maintainer || this.realname,
            confirmUserId: status === 0 ? null : this.userId,
          };
          const url = status === 0 ? "/pvams/maintain/submitMaintainPlan" : "/pvams/maintain/confirmMaintainPlan"
          const {data} = await this.axios.post(url, params);
          if (data.code === 200) {
            this.isRecordDialog = false;
            this.$message({ type: "success", message: "提交成功" });
            this.getTableData();
          }
        }
      });

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
    // dialog close
    handleClose(formName) {
      this.$refs[formName].resetFields();
    },
    clickShowRecord(row, index) {
      this.recordform = {
        ...row,
        confirmer: row.confirmer && row.status !== 0 ? row.confirmer : this.realname,
      };
      this.recordform.maintainTime = row.status === 0 ? moment(new Date()).format('YYYY-MM-DD HH:mm:ss') : this.recordform.maintainTime;
      this.isRecordDialog = true;
    },
    clickShowImg(img) {
      const imgSrc = img.indexOf('http://') === 0 ? img : `${this.hostname}${img}`
      this.isVisibleImg = true;
      this.showImg = imgSrc || "";
    }
  },
}
</script>
<style lang="less" scoped>
.prevention {
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
.prevention {
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
