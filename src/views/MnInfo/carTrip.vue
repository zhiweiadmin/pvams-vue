// 车辆出行管理
<template>
  <div class="car-trip">
    <div class="main-content-end">
      <a :href="`/pvams/car/export/${stationId}`">
        <el-button type="" size="small">导出模板</el-button>
      </a>
      <el-upload
        v-if="getUserJurisdiction('AT25')"
        :style="{marginLeft: '20px'}"
        class="upload-demo"
        :action="`/pvams/car/import/${stationId}`"
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
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.status === 0 ? '在站' : '外出'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="借出确认" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.confirmStatus === 0 ? '未确认' : '已确认'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" v-if="scope.row.status === 0" type="text" @click="clickLend(scope.row, 1)">借出</el-button>
            <el-button size="small" v-if="scope.row.status === 1" type="text" @click="clickLend(scope.row, 0)">归还</el-button>
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
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                {{scope.row.action === 0 ? '归还' : '借出'}}
              </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center">
              <template slot-scope="scope">
                {{scope.row.confirmStatus === 0 ? '未确认' : '已确认'}}
              </template>
            </el-table-column>
            <!-- status -->
            <el-table-column v-if="getUserJurisdiction('AT26')" label="操作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.confirmStatus === 0" type="primary"  size="small" @click="clickConfirm(scope.row)">确认</el-button>
              </template>
            </el-table-column>
          </el-table>
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
      columns: [
        {
          label: "车牌号",
          width: "",
          prop: "carNum",
        },
        // {
        //   label: "状态",
        //   width: "",
        //   prop: "status",
        // },
        {
          label: "负责人",
          width: "",
          prop: "header",
        },
        {
          label: "品牌",
          width: "",
          prop: "brand",
        },
        // {
        //   label: "借出确认",
        //   width: "",
        //   prop: "confirmStatus",
        // },
        {
          label: "参数",
          width: "",
          prop: "param",
        },
      ],
      pageNo: 1,
      recordDataList: [],
      componentId: '',
      recordColumns: [
        {
          label: "申请人",
          width: "",
          prop: "applyer",
        },
        {
          label: "申请时间",
          width: "160px",
          prop: "submitDate",
        },
        {
          label: "审批人",
          width: "",
          prop: "approver",
        },
        {
          label: "审批时间",
          width: "160px",
          prop: "approveDate",
        },
      ],
      isVisibleQuery: false,
      total: 0,
      realname: "",
      stationId: '',
      userId: "",
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
        pageSize: 20,
      };
      const { data: { code, data: { page: {count = 0} = {}, resultList = []} = {} } = {} } = await this.axios('/pvams/car/query', { params });
      this.loadingClose();
      if (code === 200) {
        this.tableList = resultList;
        this.total = count;
      }
    },
    // 
    clickLend(row, action) {
      this.$confirm('是否确认借出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          carId: row.id,
          action,
          submitUserId: this.userId,
        };
        const { data: { code } = {} } = await this.axios.post('/pvams/car/borrow', params);
        if (code === 200) {
          this.getTableList(this.pageNo);
          this.$message({ type: 'success', message: '操作成功' })
        }
      })
    },
    close() {},
    async clickConfirm(row) {
      const params = {
        userId: this.userId,
        id: row.id,
        confirmStatus: 1
      };
      const { data: { code } } = await this.axios("/pvams/car/confirm", { params });
      if (code === 200) {
        this.clickRecord({id: this.componentId}, 1);
        this.getTableList(this.pageNo);
      }
    },
    async clickRecord(row, pageNo) {
      this.isVisibleQuery = true;
      this.componentId = row.id;
      const params = {
        userId: this.userId,
        carId: row.id,
        pageNo,
        pageSize: 20,
      };
      const { data: { code, data: { resultList = [] } = {} } = {} } = await this.axios('/pvams/car/queryRecord', { params });
      if (code === 200) {
        this.recordDataList = resultList;
      }
    },
    handleCurrentChange(v) {
      this.pageNo = v;
      this.getTableList(v);
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
  }
}
</script>

<style lang="less" scoped>
.car-trip {

}
</style>
