// 设备信息
<template>
  <div class="equipment">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>资产管理</el-breadcrumb-item>
          <el-breadcrumb-item>设备信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="10" align="right">
        <a v-if="getUserJurisdiction('AT09')" :href="`${hostname}/pvams/device/export/${stationId}`">
          <el-button size="small">导出信息</el-button>
        </a>
      </el-col>
      <el-col :span="2" align="right">
        <el-upload
          v-if="getUserJurisdiction('AT09')"
          class="upload-demo"
					:show-file-list="false"
          :action="`/pvams/device/import/${stationId}`"
          :on-success="(res) => uploadSuccess(res)"
          :before-upload="(info) => beforeAvatarUpload(info)">
          <el-button size="small" type="primary">导入信息</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <div class="table" :style="{margin: '20px 0'}">
      <el-table header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column type="index" width="50px" align="center" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in columns"
          align="center"
          :prop="col.prop"
          :key="index"
          :label="col.label"
          :width="col.width">
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
  </div>
</template>

<script>
import config from "@/config";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      tableList: [1],
      columns: [
        {
          prop: "deviceName",
          label: "设备名称",
        },
        {
          prop: "number",
          label: "数量",
        },
        {
          prop: "type",
          label: "类型",
        },
        {
          prop: "model",
          label: "型号",
        },
        {
          prop: "supplier",
          label: "供应商",
        },
        {
          prop: "contact",
          label: "联系人",
        },
        {
          prop: "phone",
          label: "联系方式",
        },
        {
          prop: "warrantyStartDate",
          label: "质保起始日期",
          width: "120px",
        },
        {
          prop: "warrantyEndDate",
          label: "质保终止日期",
          width: "120px",
        },
        {
          prop: "param",
          label: "主要参数",
          width: "100px",
        },
        {
          prop: "remark",
          label: "备注",
        }
      ],
      stationId: "",
      total: 0,
      hostname: "",
    }
  },
  created() {
    this.hostname = config.HOST.pvamsDomain || ""
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) this.getTableList();
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (this.stationId) this.getTableList();
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    async getTableList(pageNo) {
      this.loadingOpen();
      const params = {
        stationId: this.stationId,
        pageNo,
        pageSize: 10
      };
      const {data: {data: {deviceList, page: { count } = {}} = {}}} = await this.axios("/pvams/station/getStationDevice", { params });
      this.loadingClose();
      if (deviceList) {
        this.tableList = deviceList || [];
        this.total = count;
      }
    },
    handleCurrentChange(val) {
      this.getTableList(val);
    },
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

</style>
