// 重要维护
<template>
  <div class="impt-mn">
    <el-form :model="searchform" size="small" ref="searchform" label-width="100px">
      <el-col :span="8">
        <el-form-item label="信息类型：">
          <el-select clearable @change="changeQuery" v-model="searchform.type" placeholder="请选择">
            <el-option v-for="(item, index) in infoTypeList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="提报人：">
          <el-select clearable @change="changeQuery" v-model="searchform.name" placeholder="请选择">
            <el-option v-for="(item, index) in options2"
              :key="index"
              :label="item.realname"
              :value="item.realname">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="审批状态：">
          <el-select clearable @change="changeQuery" v-model="searchform.status" placeholder="请选择">
            <el-option v-for="(item, index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="提报时间：">
          <el-date-picker
            @change="changeQuery"
            :style="{width: '100%'}"
            v-model="searchform.startDate"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="13" align="right">
        <el-button size="small" type="" @click="clickAdd">新建维护</el-button>
      </el-col>      
    </el-form>
    <div class="table" :style="{margin: '20px 0'}">
      <el-table header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column align="center" width="80px" type="index" label="序号"></el-table-column>
        <el-table-column v-for="(col, index) in columns"
          align="center"
          :type="col.type"
          :prop="col.prop"
          :key="index"
          :label="col.label"
          :width="col.width">
        </el-table-column>
        <!-- statusLabel -->
        <el-table-column align="center" width="100px" label="审批状态">
          <template slot-scope="scope">
            <span class="status-sty" :style="{
              color: scope.row.status === 0 ? '#3333FF' :
              scope.row.status === 1 ? '#008000' :
              scope.row.status === 2 ? '#CC9952' :
              scope.row.status === 3 ? '#999999' : '#000'
            }"> <i :style="{
              backgroundColor: scope.row.status === 0 ? '#3333FF' :
              scope.row.status === 1 ? '#008000' :
              scope.row.status === 2 ? '#CC9952' :
              scope.row.status === 3 ? '#999999' : '#000'
            }"></i> {{scope.row.statusLabel}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status == 0 && getUserJurisdiction('AT15')" type="text" @click="clickEdit(scope.row, 1)">审批</el-button>
            <el-button size="mini" v-if="scope.row.status == 3" type="text" @click="clickEdit(scope.row, 2)">重报</el-button>
            <el-button size="mini" type="text" v-if="getUserJurisdiction('AT16')" @click="clickDet(scope.row)">删除</el-button>
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
        :title="isEdit ? '审批重要维护信息' : '新建重要维护信息'"
        :visible.sync="isVisibleAdd"
        width="50%"
        @close="closeAddForm('formAdd')">
        <div class="main">
          <el-form :model="formAdd" size="small" ref="formAdd" label-width="80px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="提报人">
                  <el-input disabled v-model="formAdd.presenter" placeholder=""></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="提报时间">
                  <span v-if="isUpdate">{{formAdd.presentDate || ""}}</span>
                  <el-date-picker v-else
                  :disabled="true"
                    :style="{width: '100%'}"
                    v-model="formAdd.presentDate"
                    type="datetime"
                    format="yyyy-MM-dd hh:mm:ss"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="信息类型">
                  <span v-if="isUpdate">{{formAdd.typeName || ""}}</span>
                  <el-select v-else v-model="formAdd.type" placeholder="请选择">
                    <el-option v-for="(item, index) in infoTypeList"
                      :key="index"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="开始时间">
                  <span v-if="isUpdate">{{formAdd.startDate || ""}}</span>
                  <el-date-picker v-else
                    :style="{width: '100%'}"
                    v-model="formAdd.startDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="结束时间">
                  <span v-if="isUpdate">{{formAdd.endDate}}</span>
                  <el-date-picker v-else
                    :style="{width: '100%'}"
                    v-model="formAdd.endDate"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-col :span="24">
              <el-form-item label="主题">
                <span v-if="isUpdate">{{formAdd.subject}}</span>
                <el-input v-else type="textarea" :rows="2" v-model="formAdd.subject" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="信息详情">
                <span v-if="isUpdate">{{formAdd.infoDetail}}</span>
                <el-input v-else type="textarea" :rows="2" v-model="formAdd.infoDetail" placeholder=""></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="isEdit" :span="24">
              <el-form-item label="审批">
                <el-col :span="12">
                  <p>审批状态：<span>未审批</span></p>
                </el-col>
                <el-col :span="12">
                  <el-radio v-model="formAdd.radiostatus" :label="1">通过</el-radio>
                  <el-radio v-model="formAdd.radiostatus" :label="2">拒绝</el-radio>
                </el-col>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <div align="center" slot="footer">
          <el-button type="primary" size="small" @click="clickConfirm('formAdd')">提交</el-button>
          <el-button size="small" @click="isVisibleAdd = false">取 消</el-button>
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
      isVisibleAdd: false,
      searchform: {},
      total: 0,
      options2: [],
      isEdit: false,
      formAdd: {},
      tableList: [],
      realname: "",
      isUpdate: false,
      userId: "",
      statusList: [
        { label: "新提报", value: 0 },
        { label: "已通过", value: 1 },
        { label: "已拒绝", value: 2 },
        { label: "已过期", value: 3 },
      ],
      stationId: "",
      infoTypeList: [
        { label: "调度命令", value: 1 },
        { label: "重要隐患", value: 2 },
        { label: "重要工作安排", value: 3 },
        { label: "事故信息", value: 4 },
      ],
      columns: [
        {
          prop: "subject",
          label: "主题",
          width: "",
        },
        {
          prop: "typeName",
          label: "类型",
          width: "",
        },
        {
          prop: "presenter",
          label: "提报人",
          width: "",
        },
        {
          prop: "presentDate",
          label: "提报时间",
          width: "160px",
        },
        {
          prop: "startDate",
          label: "有效期开始时间",
          width: "160px",
        },
        {
          prop: "endDate",
          label: "有效期结束时间",
          width: "160px",
        },
        // {
        //   prop: "statusLabel",
        //   label: "审批状态",
        //   width: "",
        // },
      ],
    }
  },
  created() {
    this.realname = localStorage.getItem("realname");
    this.userId = localStorage.getItem("userId");
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) {
        this.getTableList(1);
        this.getRealnameData();
      }
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (this.stationId) {
          this.getTableList(1);
          this.getRealnameData();
        }
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
      const startDate = this.searchform.startDate && this.searchform.startDate.length !== 0 && this.searchform.startDate[0];
      const endDate = this.searchform.startDate && this.searchform.startDate.length !== 0 && this.searchform.startDate[1];
      const params = {
        ...this.searchform,
        startDate,
        endDate,
        stationId: this.stationId,
        pageNo,
        pageSize:20
      };
      const { data: { data: { infoList = [], page: { count = 0 } = {} } } = {} } = await this.axios.post('/pvams/info/query', params);
      this.loadingClose();
      this.total = count;
      infoList.forEach(v => {
        if (v.type) {
          const typeNames = this.infoTypeList.filter((d) => d.value === v.type);
          v.typeName = typeNames && typeNames[0].label;
        }
        if (v.status || v.status === 0) {
          const statusLabels = this.statusList.filter((d) => d.value === v.status);
          v.statusLabel = statusLabels && statusLabels[0].label;
        }
      });
      this.tableList = infoList;
    },
    // 提报人获取
    async getRealnameData() {
      const { data: { data = [], code } = {} } = await this.axios(`/pvams/info/getPresenter/${this.stationId}`);
      if (code === 200) {
        // console.log(data);
        this.options2 = data;
      }
    },
    changeQuery() {
      this.getTableList(1);
    },
    handleCurrentChange(val) {
      this.getTableList(val);
    },
    closeAddForm(formName) {
      this.$refs[formName].resetFields();
    },
    clickAdd() {
      this.formAdd = {
        presenter: this.realname,
        presentDate: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
      };
      this.isEdit = false;
      this.isVisibleAdd = true;
    },
    clickConfirm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            presentUserId: this.userId,
            stationId: this.stationId,
            ...this.formAdd,
          };
          if (!this.formAdd.status && this.formAdd.status !== 0) {
            // 新增
            const { data: { code } } = await this.axios.post('/pvams/info/add', params);
            if (code === 200) {
              this.getTableList(1);
              this.isVisibleAdd = false;
            }
          } else if (this.formAdd.status === 0) {
            // 确认
            const param = { id: this.formAdd.id, status: this.formAdd.radiostatus, approveUserId: this.userId };
            const { data: { code } } = await this.axios('/pvams/info/approve', { params: param });
            if (code === 200) {
              this.getTableList(1);
              this.isVisibleAdd = false;
            }
          } else if (this.formAdd.status === 3) {
            // 重报
            const { data: { code } } = await this.axios.post('/pvams/info/update', params);
            (code);
            if (code === 200) {
              this.getTableList(1);
              this.isVisibleAdd = false;
            }
          }
        }
      });
    },
    // 编辑
    clickEdit(row, type) {
      // console.log(row);
      this.isEdit = type === 1;
      this.formAdd = {...row};
      this.isVisibleAdd = true;
    },
    clickDet(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { code } } = await this.axios(`/pvams/info/delete/${row.id}`);
        if (code === 200) {
          this.$message({ type: 'success', message: '操作成功' });
          this.getTableList();
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.impt-mn {
}
</style>
