// 备件管理
<template>
  <div class="spare-part">
    <div class="main-content-end">
      <a :href="`/pvams/component/export/${stationId}`">
        <el-button type="" size="small">导出模板</el-button>
      </a>
      <el-upload
        v-if="getUserJurisdiction('AT27')"
        :style="{marginLeft: '20px'}"
        class="upload-demo"
        :action="`/pvams/component/import/${stationId}`"
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
        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="clickConfirm(scope.row, 0)">领用</el-button>
            <el-button size="mini" type="text" @click="clickConfirm(scope.row, 1)">入库</el-button>
            <el-button size="mini" type="text" @click="clickRecord(scope.row, 1)">记录查询</el-button>
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
        title="记录查询"
        :visible.sync="isVisibleQuery"
        width="62%">
        <div class="main">
          <el-table :data="recordDataList" border stripe>
            <el-table-column v-for="(col, index) in recordColumns"
              align="center"
              :prop="col.prop"
              :key="index"
              :label="col.label"
              :width="col.width">
            </el-table-column>
            <el-table-column label="领用状态" align="center" width="80px">
              <template slot-scope="scope">
                {{scope.row.action === 0 ? '领取' : '入库'}}
              </template>
            </el-table-column>
            <el-table-column label="审批状态" align="center" width="80px">
              <template slot-scope="scope">
                {{scope.row.status === 0 ? '待确认' : scope.row.status === 1 ? '已确认' : scope.row.status === 2 ? '驳回' : ''}}
              </template>
            </el-table-column>
            <el-table-column v-if="getUserJurisdiction('AT28')" label="操作" align="center" width="150px">
              <template slot-scope="scope">
                <el-button v-if="!scope.row.status" type="primary" @click="clickQueryConfirm(scope.row, 1)" size="small">确认</el-button>
                <el-button v-if="!scope.row.status" type="danger" @click="clickQueryConfirm(scope.row, 2)" size="small">驳回</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div>
          <el-pagination
            align="right"
            small
            :page-size="10"
            @current-change="(res) => handleCurrentChange(res, 2)"
            layout="prev, pager, next"
            :total="recordTotal">
          </el-pagination>
        </div>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="isShowDialog"
        @close="close('collarForm')"
        width="30%">
        <div class="main">
          <el-form :model="collarForm" ref="collarForm" size="small" label-width="100px">
            <el-form-item label="数量：" prop="num" :rules="[
              {required: true, message: '请输入数量'},
              {pattern: /^\d/, message: '只能输入数值'}
              ]">
              <el-input v-model.number="collarForm.num"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div align="center" slot="footer">
          <el-button @click="isShowDialog = false">取 消</el-button>
          <el-button type="primary" @click="clickCollarConfirm('collarForm')">确 定</el-button>
        </div>
      </el-dialog>
      
    </div>
  </div>
</template>

<script>
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      tableList: [],
      stationId: "",
      columns: [
        {
          label: "备件名称",
          width: "",
          prop: "componentName",
        },
        {
          label: "数量",
          width: "",
          prop: "num",
        },
        {
          label: "品牌",
          width: "",
          prop: "brand",
        },
        {
          label: "库存上限",
          width: "",
          prop: "stockUp",
        },
        {
          label: "库存下限",
          width: "",
          prop: "stockLower",
        },
        {
          label: "参数",
          width: "",
          prop: "param",
        },
        // {
        //   label: "状态",
        //   width: "",
        //   prop: "status",
        // },
      ],
      total: 0,
      collarForm: {
      },
      pageSize1: 1,
      pageSize2: 1,
      recordTotal: 0,
      recordId: '',
      isShowDialog: false,
      isVisibleQuery: false,
      recordDataList: [],
      recordColumns: [
        {
          label: "申请人",
          width: "",
          prop: "applyer",
        },
        {
          label: "提交日期",
          width: "160px",
          prop: "submitDate",
        },
        {
          label: "数量",
          width: "",
          prop: "num",
        },
        {
          label: "审批人",
          width: "",
          prop: "approver",
        },
        {
          label: "审批日期",
          width: "160px",
          prop: "approveDate",
        },
        // {
        //   label: "领用状态",
        //   width: "",
        //   prop: "action",
        // },
      ],
      status: [
        { label: '领取', value: 0 },
        { label: '入库', value: 1 },
      ],
    }
  },
  created() {
    this.userId = localStorage.getItem("userId");
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
        pageSize:20
      };
      const { data: { code, data: {page: {count = 0} = {}, resultList = [] } = {} } = {} } = await this.axios('/pvams/component/query', {params});
      this.loadingClose();
      this.total = count;
      this.tableList =resultList
    },
    async clickConfirm(row, action) {
      this.collarForm = {
        num: '',
        action,
        id: row.id
      };
      this.isShowDialog = true;
    },
    async clickCollarConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.collarForm,
            stationId: this.stationId,
            userId: this.userId,
          };
          const { data: { code } } = await this.axios.post('/pvams/component/action', params);
          if (code === 200) {
            this.getTableList(this.pageSize1);
            this.$message({ type: 'success', message: `${this.collarForm.action === 0 ? '领取' : '入库'}成功` });
            this.isShowDialog = false;
          }
        }
      })
    },
    close(formName) {
      this.collarForm = {};
      this.$refs.collarForm && this.$refs.collarForm.resetFields();
    },
    async clickRecord(row, pageNo) {
      this.recordId = row.id;
      this.isVisibleQuery = true;
      const params = {
        userId: this.userId,
        componentId: row.id,
        pageNo,
        pageSize: 10,
      };
      const { data: { code, data: { resultList = [], page: { count = 0 } = {} } = {} } = {} } = await this.axios('/pvams/component/queryRecord', { params });
      if (code === 200) {
        this.recordDataList = resultList;
        this.recordTotal = count;
        // console.log(this.recordTotal);
      }
    },
    async clickQueryConfirm(row, status) {
      const params = {
        id: row.id,
        status,
        userId: this.userId,
      };
      const { data: { code = 0 } } = await this.axios("/pvams/component/confirm", { params });
      if (code === 200) {
        // this.isVisibleQuery = false;
        // this.getTableList(1);
        this.getTableList(this.pageSize1)
        this.clickRecord({id: this.recordId}, this.pageSize2);
      }
    },
    handleCurrentChange(v, i) {
      if (i === 1) {
        this.pageSize1 = v;
        this.getTableList(v);
      } else if (i===2) {
        this.pageSize2 = v;
        this.clickRecord({id: this.recordId}, v);
      } else {
        this.getTableList(v);
      }
    },
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        this.getTableList(this.pageSize1);
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
  }
}
</script>

<style lang="less" scoped>

</style>
