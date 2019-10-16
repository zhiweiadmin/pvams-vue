// 工器具管理
<template>
  <div class="tools-implements">
    <div class="main-content-end">
      <a :href="`/pvams/tool/export/${stationId}`">
        <el-button type="" size="small">导出模板</el-button>
      </a>
      <el-upload
        v-if="getUserJurisdiction('AT23')"
        :style="{marginLeft: '20px'}"
        class="upload-demo"
        :action="`/pvams/tool/import/${stationId}`"
        :on-success="(res) => uploadSuccess(res)"
        :show-file-list="false"
        :before-upload="(info) => beforeAvatarUpload(info)">
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
            <el-button size="small" v-if="scope.row.checkStatus===0" type="text" @click="clickSingle(scope.row)">点检</el-button>
            <el-button size="small" type="text" @click="clickRecord(scope.row, 1)">记录查询</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-pagination
        align="right"
        small
        :page-size="20"
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
              <el-form-item label="工器具名称">
                <el-input disabled v-model="formSingle.tool" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="位置">
                <el-input disabled v-model="formSingle.position" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input disabled v-model="formSingle.num" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类型">
                <el-input disabled v-model="formSingle.type" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点检时间">
                <el-input disabled v-model="formSingle.checkTime" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="点检人">
                <el-input disabled v-model="formSingle.checker" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="丢失数量" prop="loseNum" :rules="[{ required: true, message: '请输入丢失数量' }]">
                <el-input v-model="formSingle.loseNum" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="破损数量" prop="damageNum" :rules="[{ required: true, message: '请输入破损数量' }]">
                <el-input v-model="formSingle.damageNum" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="更换数量" prop="changeNum" :rules="[{ required: true, message: '请输入更换数量' }]">
                <el-input v-model="formSingle.changeNum" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="点检结果" prop="checkResult" :rules="[{ required: true, message: '请输入点检结果' }]">
                <el-input v-model="formSingle.checkResult" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="下次点检日期" prop="nextCheckTime" :rules="[{ required: true, message: '请选择下次点检日期' }]">
                <!-- <el-input v-model="formSingle.nextCheckTime" placeholder=""></el-input> -->
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
            <el-table-column v-if="getUserJurisdiction('AT24')" label="操作" align="center">
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
          label: "工器具名称",
          width: "120px",
          prop: "tool",
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
      pageNo: 1,
      formSingle: {},
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
      recordId: "",
      realname: "",
      userId: '',
      isVisibleQuery: false,
      stationId: '',
      isVisbleSingle: false,
    }
  },
  created() {
    this.userId = localStorage.getItem("userId");
    this.realname = window.localStorage.getItem("realname");
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
        pageSize: 20,
      };
      const { data: { code, data: { page: { count = 0 } = {}, resultList = []} = {} } = {} } = await this.axios('/pvams/tool/query', { params });
      this.loadingClose();
      if (code === 200) {
        this.tableList = resultList;
        this.total = count;
      }
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getTableList(v);
    },
    clickSingle(row) {
      this.isVisbleSingle = true;
      const checker = row.checker || this.realname;
      this.formSingle = {
        ...row,
        checker,
        nextCheckTime: "",
        toolId: row.id,
        checkTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      };
    },
    // 
    async clickQueryConfirm(row) {
      const params = {
        userId: this.userId,
        id: row.id,
        confirmStatus: 1,
      };
      const { data: { code } = {} } = await this.axios("/pvams/tool/confirm", { params });
      if (code === 200) {
        this.getTableList(this.pageNo);
        this.clickRecord({id: this.recordId}, 1)
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
          const { data: { code } = {} } = await this.axios.post('/pvams/tool/check', params);
          if (code === 200) {
            this.$message({ type: 'success', message: '点检成功' });
            this.getTableList(this.pageNo);
            this.isVisbleSingle = false;
          }
        }
      });
    },
    closeSingle(formName) {
      this.$refs[formName].resetFields();
    },
    close() {},
    async clickRecord(row, pageNo) {
      this.recordId = row.id;
      this.isVisibleQuery = true;
      const params = {
        toolId: row.id,
        pageNo,
        pageSize: 20,
      };
      const { data: { code, data: { resultList = [] } = {} } = {} } = await this.axios('/pvams/tool/queryRecord', { params });
      if (code === 200) {
        this.recordDataList = resultList;
      }
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        this.getTableList(this.pageNo);
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
.tools-implements {
  
}
</style>
