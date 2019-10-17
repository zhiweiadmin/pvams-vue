// 常规数据维护
<template>
  <div class="routinedata-mn">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-card :body-style="{ padding: '10px' }">
          <p :style="{textAlign: 'center'}">日历</p>
        </el-card>
        <el-card :style="{marginTop: '20px'}" :body-style="{ padding: '10px' }">
          <el-calendar :style="{paddingTop: '5px'}" v-model="time"></el-calendar>
        </el-card>
      </el-col>
      <el-col :span="14">
        <el-row :gutter="20">
          <el-col class="day-detail" :span="12">
            <el-card :body-style="{ padding: '10px' }">
              <p :style="{textAlign: 'center'}">今日详情</p>
            </el-card>
            <el-card :style="{marginTop: '20px', minHeight: '183px'}" :body-style="{ padding: '10px' }">
              <div class="main">
                <div class="left">
                  <img src="../../assets/qing.png" alt="">
                  <p>23℃</p>
                </div>
                <div class="right">
                  <div style="width: 40%;float: left">
                    <div style="width: 100%;height:50%;" class="col">
                        <p>发电量 (kw·h)</p>
                        <div style="height: 30px">{{todayDetail.realPower}}</div>
                    </div>
                      <div style="width: 100%;float:left;" class="col">
                          <p>等效小时数</p>
                          <div style="height: 30px">{{todayDetail.realHour}}</div>
                      </div>
                  </div>
                    <div style="width: 40%;float: left">
                        <div style="width: 100%;height:50%;" class="col">
                            <p >辐照量 (KJ)</p>
                            <div style="height: 30px">{{todayDetail.fuzhaoPower}}</div>
                        </div>
                        <div style="width: 100%;float:left;" class="col">
                            <p>损失小时数</p>
                            <div style="height: 30px">{{todayDetail.loseHour}}</div>
                        </div>
                    </div>
<!--                  <el-row>-->
<!--                    <el-col class="col" :span="12">-->
<!--                      <p>发电量  （kw·h）</p>-->
<!--                      <p>{{todayDetail.realPower || ""}}</p>-->
<!--                    </el-col>-->
<!--                    <el-col class="col" :span="12">-->
<!--                      <p>辐照量  （KJ）</p>-->
<!--                      <p>{{todayDetail.fuzhaoPower || ""}}</p>-->
<!--                    </el-col>-->
<!--                    <el-col class="col" :span="12">-->
<!--                      <p>等效小时数</p>-->
<!--                      <p>{{todayDetail.realHour || ""}}</p>-->
<!--                    </el-col>-->
<!--                    <el-col class="col" :span="12">-->
<!--                      <p>损失小时数</p>-->
<!--                      <p>{{todayDetail.loseHour || ""}}</p>-->
<!--                    </el-col>-->
<!--                  </el-row>-->
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card :body-style="{ padding: '10px' }">
              <p :style="{textAlign: 'center'}">工作记录</p>
            </el-card>
            <el-card :style="{marginTop: '20px'}" :body-style="{ padding: '10px' }">
              <div class="">
                <el-button @click="clickAdd(1)" :style="{marginBottom: '20px', width: '47%'}">填写日报</el-button>
                <el-button @click="clickAdd(3)" :style="{marginBottom: '20px', width: '47%'}">填写月报</el-button>
              </div>
              <div>
                <el-button @click="clickAdd(2)" :style="{marginBottom: '20px', width: '47%'}">填写周报</el-button>
                <el-button @click="clickAdd(4)" :style="{marginBottom: '20px', width: '47%'}">填写季报</el-button>
              </div>
              <div>
                <el-button @click="clickAdd(5)" :style="{width: '100%'}">填写年报</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card :style="{marginTop: '20px'}" :body-style="{ padding: '10px' }">
              <p :style="{textAlign: 'center'}">等效小时数</p>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-card :style="{marginTop: '20px', marginBottom: '20px', minHeight: '281px'}" :body-style="{ padding: '10px' }">
              <div class="echart" id="routine-echart"></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-card :body-style="{ padding: '0 10px' }">
      <div class="table" :style="{paddingTop: '20px'}">
        <el-table header-cell-class-name="table-th" :data="tableList" border stripe>
          <el-table-column v-for="(col, index) in columns"
            align="center"
            :prop="col.prop"
            :key="index"
            :label="col.label"
            :width="col.width">
          </el-table-column>
          <el-table-column align="center" label="文件" >
            <template slot-scope="scope">
                <a class="style-pdf" target="view_window" :href="hostname + scope.row.filePath">{{scope.row.attach || ""}}</a>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" >
            <template slot-scope="scope">
              <el-button size="small" type="text">
                <a :href="`/pvams/dataMaintain/download/${scope.row.id}`">下载</a>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="dialog">
      <el-dialog
        title="工作登记"
        :visible.sync="isVisibleAdd"
        width="40%"
        @close="close('addForm')">
        <el-form :model="addForm" size="small" ref="addForm" label-width="100px">
          <el-form-item label="标题" prop="title" :rules="[{required: true, message: '请输入标题'}]">
            <el-input v-model="addForm.title" placeholder="输入工作标题"></el-input>
          </el-form-item>
          <el-form-item label="工作描述" prop="recordDesc" :rules="[{required: true, message: '请输入工作描述'}]">
            <el-input type="textarea" placeholder="请输入你的阶段性工作内容" :rows="2" v-model="addForm.recordDesc"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              :action="`/pvams/upload`"
              :show-file-list="false"
              :on-success="(res) => uploadSuccess(res)"
              :before-upload="(info) => beforeAvatarUpload(info, 1)">
              <el-button size="small" type="primary">上传文件</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
        <div align="center" slot="footer">
          <el-button size="small" type="primary" @click="clickConfirm('addForm')">确 定</el-button>
          <el-button size="small" @click="isVisibleAdd = false">清空</el-button>
        </div>
      </el-dialog>
      
    </div>
  </div>
</template>

<script>
import config from "@/config";
import moment from "moment";
import { constants } from 'fs';
import echart from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line"
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      time: "",
      isVisibleAdd: false,
      hostname: "",
      columns: [
        {
          prop: "typeName",
          label: "类型",
          width: "",
        },
        {
          prop: "title",
          label: "标题",
          width: "",
        },
        {
          prop: "recordDesc",
          label: "工作描述",
          width: "400px",
        },
        {
          prop: "createDttm",
          label: "创建时间",
          width: "160px",
        },
        {
          prop: "realname",
          label: "上报人",
          width: "",
        },
      ],
      typeList: [
        { label: "日报", value: 1 },
        { label: "周报", value: 2 },
        { label: "月报", value: 3 },
        { label: "季报", value: 4 },
        { label: "年报", value: 5 },
      ],
      todayDetail: {},
      typeValue: "",
      addForm: {},
      tableList: [],
      userId: "",
      realname: "",
      stationId: "",
      hostDomain: "",
    }
  },
  created() {
    this.hostname = config.HOST.pvamsDomain || "";
    this.hostDomain = `${config.HOST.pvamsDomain}`;
    this.userId = localStorage.getItem("userId");
    this.realname = localStorage.getItem("realname");
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) {
        this.getTableData();
        this.getTodayDetail();
        this.getWeekHourData();
      }
    }
  },
  watch: {
    getStateData(v) {
      const stationId = this.$store.state.getTreeId.treeId.id;
      if (stationId && stationId.includes("s")) {
        this.stationId = stationId.slice(1, stationId.length);
        this.getTableData();
        this.getTodayDetail();
        this.getWeekHourData();
      }
    },
    changeCalendar(v) {
      this.calendarTime = moment(v).format('YYYY-MM-DD');
      this.getTableData();
      this.getTodayDetail();
      this.getWeekHourData();
      // console.log(this.calendarTime);
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
    changeCalendar() {
      return this.time;
    },
  },
  mounted() {
  },
  methods: {
    // 今日详情数据
    async getTodayDetail() {
      this.loadingOpen();
      const params = {
        stationId: this.stationId,
        time: this.calendarTime || "",
      };
      const { data: { code, data } = {} } = await this.axios("/pvams/dataMaintain/queryTodayDetail", { params });
      this.loadingClose();
      if (code === 200) {
        this.todayDetail = data;
      }
    },
    // 获取等效小时数数据
    async getWeekHourData() {
      this.loadingOpen();
      const params = {
        stationId: this.stationId,
        time: this.calendarTime || "",
      };
      const { data: { code, data: {dataResult = []} = {} } } = await this.axios("/pvams/dataMaintain/getWeekHour", { params });
      this.loadingClose();
      if (code === 200) {
        const itemData = {
          xAxisData: [],
          seriesData: [],
        };
        dataResult.forEach((v) => {
            itemData.xAxisData.push(v.date);
            itemData.seriesData.push(v.realHour);
        });
      this.drawLineEch1("routine-echart", itemData);
      }
    },
    // 
    async getTableData() {
      this.loadingOpen();
      const params = {
        stationId: this.stationId,
        userId: this.userId,
        time: this.calendarTime || "",
      };
      const { data: { code, data: {resultList = []} } = {} } = await this.axios("/pvams/dataMaintain/queryRecord", { params });
      this.loadingClose();
      if (code === 200) {
        resultList.forEach(v => {
          if (v.type) {
            const typeLable = this.typeList.filter((d) => d.value === v.type );
            v.typeName = typeLable && typeLable.length !== 0 && typeLable[0].label
          }
        });
        this.tableList = resultList;
      }
    },
    clickAdd(type) {
      this.addForm = { type }
      this.isVisibleAdd = true;
    },
    close(formName) {
      this.$refs[formName].resetFields();
    },
    clickConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        const params = {
          ...this.addForm,
          stationId: this.stationId,
          userId: this.userId,
        }
        if (valid) {
          const { data: { code } } = await this.axios.post("/pvams/dataMaintain/addRecord", params);
          if (code === 200) {
            this.getTableData(1);
            this.isVisibleAdd = false;
          }
        }
      });
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        this.addForm.attach = res.data || "";
      } else {
        this.$message({type: "warning", message: res.message});
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
    drawLineEch1(id, itemData) {
      let myChart = echart.init(document.getElementById(id));
      myChart.setOption({
        color: ['#3398DB'],
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : itemData.xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'等效小时数',
            type:'bar',
            barWidth: '60%',
            data: itemData.seriesData
          }
        ]
      })      
    }
  },
}
</script>
<style lang="less" scoped>
  .style-pdf {
    color: #409EFF;
    text-decoration: underline;
  }
.routinedata-mn {
  .echart {
    min-height: 250px;
    height: 100%;
  }
  .day-detail {
    .main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 160px;
      .left {
        width: 25%;
        height: 100%;
        margin-top: 45px;
        text-align: center;
        p {
          padding-top: 10px;
        }
      }
      .right {
        height: 100%;
        width: 70%;
        margin-top: 50px;
        .col {
          text-align: left;
          margin-bottom: 20px;
          padding-left: 20px;
          color: rgba(0, 0, 0, 0.647058823529412);
          font-size: 20px;
          &>p:nth-of-type(1) {
            color: rgba(0, 0, 0, 0.447058823529412);
            font-size: 12px;
          }
          &>p:nth-of-type(2) {
            padding-top: 5px;
          }
        }
      }
    }
  }
}
</style>

<style lang="less">
.routinedata-mn {
  .el-calendar-table .el-calendar-day {
    padding: 0;
    height: 62px;
    line-height: 62px;
    text-align: center;
  }
  .el-calendar-table td.is-selected {
    background-color: rgba(39, 36, 50, 1);
    color: #ffffff;
  }
}
</style>
