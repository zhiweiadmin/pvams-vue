// 消防器材维护
<template>
  <div class="fire-equipment">
    <div class="main-content-end">
      <a :href="imgUplodaPath" :style="{marginRight: '10px'}" target="_blank">{{imgUplodaName || ''}}</a>
      <el-upload
        :style="{margin: '0 20px'}"
        class="upload-demo"
        :action="`/pvams/fire/uploadFile/${stationId}`"
        :on-success="(res) => uploadSuccess(res, 3)"
        :show-file-list="false"
        :before-upload="(info) => beforeAvatarUpload(info, 3)">
        <el-button size="small" type="primary">导入分布图</el-button>
      </el-upload>
      <a :href="`/pvams/fire/export/${stationId}`">
        <el-button type="" size="small">导出模板</el-button>
      </a>
      <el-upload
        v-if="getUserJurisdiction('AT17')"
        :style="{marginLeft: '20px'}"
        class="upload-demo"
        :action="`/pvams/fire/import/${stationId}`"
        :on-success="(res) => uploadSuccess(res, 1)"
        :show-file-list="false"
        :before-upload="(info) => beforeAvatarUpload(info, 1)">
        <el-button size="small" type="primary">导入信息</el-button>
      </el-upload>
    </div>
    <div class="table" :style="{marginTop: '20px'}">
      <el-table header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column v-for="(col, index) in columns"
          align="center"
          :prop="col.prop"
          :key="index"
          :label="col.label"
          :width="col.width">
        </el-table-column>
        <el-table-column label="点检状态" align="center" width="100px">
          <!-- checkStatus -->
          <template slot-scope="scope">
            <span class="status-sty" :style="{
              color: scope.row.checkStatus === 0 ? '#FF1F4D' :
              scope.row.checkStatus === 1 ? '#CAA668' :
              scope.row.checkStatus === 2 ? '#008000' : '#000'
            }"> <i :style="{
              backgroundColor: scope.row.checkStatus === 0 ? '#FF1F4D' :
              scope.row.checkStatus === 1 ? '#CAA668' :
              scope.row.checkStatus === 2 ? '#008000' : '#000'
            }"></i> {{scope.row.checkStatus === 0 ? '未点检' : scope.row.checkStatus === 1 ? '未确认' : '已完成'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="scope.row.checkStatus===0" @click="clickSingle(scope.row)">点检</el-button>
            <el-button size="small" type="text" v-if="getUserJurisdiction('AT18')" @click="clickRecord(scope.row, 1)">记录查询</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        align="right"
        small
        :page-size="10"
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="total">
      </el-pagination>
    </div>
    <div class="dialog">
      <el-dialog
        title="消防器材点检单"
        :visible.sync="isVisbleSingle"
        width="40%"
        @close="closeSingle('formSingle')">
        <div class="main" :style="{overflow: 'hidden'}">
          <el-form :model="formSingle" size="small" ref="formSingle" label-width="120px">
            <el-col :span="12">
              <el-form-item label="器材名称">
                <el-input disabled v-model="formSingle.fireName" placeholder=""></el-input>
                <!-- <span>{{formSingle.fireName}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="位置"  label-width="80px">
                <el-input disabled v-model="formSingle.position" placeholder=""></el-input>
                <!-- <span>{{formSingle.position}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input disabled v-model="formSingle.num" placeholder=""></el-input>
                <!-- <span>{{formSingle.num}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型" label-width="80px">
                <el-input disabled v-model="formSingle.type" placeholder=""></el-input>
                <!-- <span>{{formSingle.type}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点检时间">
                <el-input disabled v-model="formSingle.checkTime" placeholder=""></el-input>
                <!-- <span>{{formSingle.checkTime}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点检人" label-width="80px">
                <el-input disabled v-model="realname" placeholder=""></el-input>

                <!-- <span>{{realname}}</span> -->
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="点检过程" prop="checkProcess" :rules="[{ required: true, message: '请输入点检过程' }]">
                <el-input type="textarea" :rows="2" v-model="formSingle.checkProcess" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="点检结果" prop="checkResult" :rules="[{ required: true, message: '请输入点检结果' }]">
                <el-input type="textarea" :rows="2" v-model="formSingle.checkResult" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="下次点检日期" prop="nextCheckTime" :rules="[{ required: true, message: '请选择下次点检日期' }]">
                <el-date-picker
                  v-model="formSingle.nextCheckTime"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div align="center" slot="footer">
          <el-button @click="isVisbleSingle = false">取 消</el-button>
          <el-button type="primary" @click="clickSingleConfirm('formSingle')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="记录查询"
        :visible.sync="isVisibleQuery"
        width="62%"
        @close="close">
        <div class="main">
          <el-table :data="recordDataList" border stripe>
            <el-table-column v-for="(col, index) in recordColumns"
              align="center"
              :prop="col.prop"
              :key="index"
              :label="col.label"
              :width="col.width">
            </el-table-column>
            <el-table-column label="确认状态" width="80px" align="center">
              <template slot-scope="scope">
                {{scope.row.confirmStatus === 0 ? '未确认' : '已确认'}}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="clickQueryConfirm(scope.row)" :disabled="scope.row.confirmStatus !== 0" type="primary"  size="small">确认</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      tableList: [],
      columns: [
        {
          label: "器材名称",
          width: "",
          prop: "fireName",
        },
        {
          label: "位置",
          width: "",
          prop: "position",
        },
        {
          label: "数量",
          width: "",
          prop: "num",
        },
        {
          label: "类型",
          width: "",
          prop: "type",
        },
        {
          label: "本次点检日期",
          width: "160px",
          prop: "checkTime",
        },
        {
          label: "参数",
          width: "",
          prop: "param",
        },
        // {
        //   label: "点检状态",
        //   width: "",
        //   prop: "checkStatus",
        // },
        {
          label: "点检校验计划",
          width: "200px",
          prop: "checkPlan",
        },
        {
          label: "下次点检日期",
          width: "160px",
          prop: "nextCheckTime",
        },
      ],
      total: 0,
      imgUplodaPath: "",
      imgUplodaName: "",
      formSingle: {},
      isVisibleQuery: false,
      recordDataList: [],
      recordColumns: [
        {
          label: "点检人",
          width: "",
          prop: "checker",
        },
        {
          label: "点检时间",
          width: "160px",
          prop: "checkTime",
        },
        {
          label: "确认人",
          width: "",
          prop: "confirmer",
        },
        {
          label: "下次点检时间",
          width: "160px",
          prop: "nextCheckTime",
        },
        // {
        //   label: "确认状态",
        //   width: "",
        //   prop: "confirmStatus",
        // },
      ],
      pageNo: 1,
      recordId: "",
      userId: '',
      stationId: '',
      isVisbleSingle: false,
      realname: '',
    }
  },
  created() {
    this.userId = localStorage.getItem("userId");
    this.realname = localStorage.getItem("realname");
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) this.getTableList(1);
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (this.stationId) this.getTableList(1);
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    // 
    async getTableList(pageNo) {
      this.loadingOpen();
      const params = {
        stationId: this.stationId,
        pageNo,
        pageSize: 10,
      };
      const { data: { code, data: { name = '', path = '', page: { count = 0 } = {}, resultList = []} = {} } = {} } = await this.axios('/pvams/fire/query', { params });
      this.loadingClose();
      if (code === 200) {
        this.imgUplodaName = name;
        this.imgUplodaPath = path;
        this.tableList = resultList;
        this.total = count;
      }
    },
    clickSingle(row) {
      this.isVisbleSingle = true;
      this.formSingle = {
        ...row,
        nextCheckTime: "",
        fireId: row.id,
        checkTime: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      };
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getTableList(v);
    },
    // 记录查询确认
    async clickQueryConfirm(row) {
      const params = {
        userId: this.userId,
        id: row.id,
        confirmStatus: 1,
      };
      const { data: { code } = {} } = await this.axios("/pvams/fire/confirm", { params });
      if (code === 200) {
        this.clickRecord({id: this.recordId}, 1);
        this.getTableList(this.pageNo);
      }
    },
    clickSingleConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.formSingle.id = null;
          const params = {
            ...this.formSingle,
            checkUserId: this.userId,
          };
          const { data: { code } = {} } = await this.axios.post('/pvams/fire/check', params);
          if (code === 200) {
            this.$message({ type: 'success', message: '点检成功' });
            this.getTableList(this.pageNo);
            this.isVisbleSingle = false;
          }
        }
      });
    },
    close() {},
    async clickRecord(row, pageNo) {
      this.recordId = row.id;
      this.isVisibleQuery = true;
      const params = {
        fireId: row.id,
        pageNo,
        pageSize: 20,
      };
      const { data: { code, data: { resultList = [] } = {} } = {} } = await this.axios('/pvams/fire/queryRecord', { params });
      if (code === 200) {
        this.recordDataList = resultList;
      }
    },
    closeSingle(formName) {
      this.$refs[formName].resetFields();
    },
    uploadSuccess(res, type) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        if(type === 3) {
          this.imgUplodaName = res.data && res.data.name;
          this.imgUplodaPath = res.data && res.data.path;
        } 
        this.getTableList(this.pageNo);
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
        const isLt10M = file.size / 1024 / 1024 < 20;
        const isJPGPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPGPng) this.$message.error('上传头像图片只能是 JPG或者Png 格式!');
        if (!isLt10M) this.$message.error('上传大小不得超过10mb!');
        return isJPGPng && isLt10M;
      }
    },
  },
}
</script>

<style lang="less" scoped>
.fire-equipment {
  .main-content-end {
    a {
      color: #409EFF;
      text-decoration: underline;
    }
  }
}
</style>
