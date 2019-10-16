/**
* 用户管理
*/
<template>
  <div class="user-adsn">
    <div class="main-content-between">
      <div>
        <el-button size="small" type="" @click="clickBatchDel">批量删除</el-button>
      </div>
      <div>
        <el-button type="" v-if="getUserJurisdiction('AT01')" size="small" @click="addCompanyForm = {},isVisibleAddCompany = true, isUpdateCompany = false, isDisable = false">新建公司</el-button>
        <el-button type="" v-if="getUserJurisdiction('AT02')" size="small" @click="clickUpdateCompany()">编辑公司</el-button>
        <el-button type="primary" v-if="getUserJurisdiction('AT35')" size="small" @click="clickAddUser(0)">新建用户</el-button>
      </div>
    </div>
    <div class="table" :style="{marginTop: '30px'}">
      <el-table @selection-change="handleSelectionChange" header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column type="selection" width="40px"></el-table-column>
        <el-table-column type="index" align="center" label="序号" width="60px"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名" width="120px">
          <template slot-scope="scope">
            <el-button type="text" @click="clickUserUpdate(scope.row)">{{scope.row.username || ""}}</el-button>
          </template>
        </el-table-column>
        <el-table-column v-for="(col, index) in columns"
          align="center"
          :type="col.type"
          :prop="col.prop"
          :key="index"
          :label="col.label"
          :width="col.width">
        </el-table-column>
        <el-table-column align="center" width="100px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="cilckDelete(scope.row)">删除</el-button>
            <el-button type="text" v-if="getUserJurisdiction('AT36')" size="small" @click="clickUserUpdate(scope.row, 1)">编辑</el-button>
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
      <el-dialog :title="isUpdateCompany ? '编辑公司' : '新建公司'" :visible.sync="isVisibleAddCompany" width="40%" @close="handleClose('addCompanyForm')">
        <el-form size="small" :model="addCompanyForm" ref="addCompanyForm" label-width="100px">
          <el-form-item label="公司名称：" prop="companyName" :rules="[{required: true, message: '请输入公司名称'}]">
            <el-input :disabled="isDisable" v-model="addCompanyForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="公司地址：" prop="provinceId" :rules="[{required: true, message: '请输入公司地址'}]">
            <el-row>
              <el-col :span="8">
                <el-select :disabled="isDisable" v-model="addCompanyForm.provinceId" @change="changeProvince" placeholder="请选择省">
                  <el-option v-for="(item, index) in provinceList" :key="index" :label="item.provinceName" :value="item.provinceId"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select :disabled="isDisable" v-model="addCompanyForm.cityId" @change="changeCity" placeholder="请选择市">
                  <el-option v-for="(item, index) in cityList" :key="index" :label="item.cityName" :value="item.cityId"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-select :disabled="isDisable" v-model="addCompanyForm.countyId" placeholder="请选择乡镇/区">
                  <el-option v-for="(item, index) in countyList" :key="index" :label="item.countyName" :value="item.countyId"></el-option>
                </el-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="街道地址：" prop="townAddress" :rules="[{required: true, message: '请输入街道地址'}]">
            <el-input :disabled="isDisable" v-model="addCompanyForm.townAddress" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="contact" :rules="[{required: true, message: '请输入联系人'}]">
            <el-input :disabled="isDisable" v-model="addCompanyForm.contact" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone" :rules="[{required: true, message: '请输入联系电话'}]">
            <el-input :disabled="isDisable" v-model="addCompanyForm.phone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="营业执照：" prop="license" :rules="[{required: true, message: '请上传营业执照'}]">
            <div class="img">
              <img :src="hostDomain + addCompanyForm.license" alt="">
              <el-upload
                :disabled="isDisable"
                class="avatar-uploader"
                :action="actionUrl"
                :show-file-list="false"
                :on-success="(res) => uploadSuccess(res)"
                :before-upload="(info) => beforeAvatarUpload(info, 3)">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="系统授权：" prop="grantAuthType" :rules="[{required: true, message: '请选择系统授权'}]">
            <el-radio-group v-model="addCompanyForm.grantAuthType">
              <el-radio :disabled="isDisable" :label="0">限制使用</el-radio>
              <el-radio :disabled="isDisable" :label="1">无限制使用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div align="center" slot="footer">
          <el-button size="small" @click="isVisibleAddCompany = false">取 消</el-button>
          <el-button size="small" :disabled="isDisable" type="primary" @click="confirmAddCompany('addCompanyForm')">确 定</el-button>
          <el-button size="small" v-if="isUpdateCompany" type="primary" @click="isDisable = false">编辑</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="isUserUpdate ? '编辑用户' : '新建用戶'" :visible.sync="isVisibleAddUser" width="40%" @close="handleClose('addUserform')">
        <el-form :model="addUserform" size="small" ref="addUserform" label-width="100px">
          <el-form-item label="用戶名：" prop="username" :rules="[{required: true, message: '請輸入用戶名'}]">
            <el-input v-model="addUserform.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名：" prop="realname" :rules="[{required: true, message: '姓名'}]">
            <el-input v-model="addUserform.realname"></el-input>
          </el-form-item>
          <el-form-item label="联系方式：" prop="phone" :rules="[{required: true, message: '請輸入联系方式'}]">
            <el-input v-model="addUserform.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="mail" :rules="[{required: true, message: '請輸入邮箱'}]">
            <el-input v-model="addUserform.mail"></el-input>
          </el-form-item>
          <el-form-item label="角色：" prop="role" :rules="[{required: true, message: '请选择角色'}]">
            <el-select v-model="addUserform.role" placeholder="请选择角色">
              <!-- <el-option v-if="getUserJurisdiction('AT03')" label="超级管理员" :value="1"></el-option> -->
              <el-option v-for="(item, index) in userTypeList"
                v-if="!item.isNoShow"
                :key="index"
                :label="item.name"
                :value="item.role">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="isUserUpdate ? '新密码：' : '密码：'" prop="password" :rules="[{required: true, message: '请输入密码'}]">
            <el-input v-model="addUserform.password"></el-input>
          </el-form-item>
        </el-form>
        <div align="center" slot="footer">
          <el-button size="small" @click="isVisibleAddUser = false">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmAddUser('addUserform')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import config from "../../config";
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      tableList: [],
      isVisibleAddCompany: false,
      isVisibleAddUser: false,
      isUpdateCompany: false,
      isDisable: true,
      columns: [
        {
          label: "姓名",
          width: "",
          prop: "realname",
          type: "",
        },
        {
          label: "角色",
          width: "",
          type: "",
          prop: "roleName",
        },
        {
          label: "联系电话",
          width: "",
          type: "",
          prop: "phone",
        },
        {
          label: "邮箱",
          width: "",
          type: "",
          prop: "mail",
        },
      ],
      actionUrl: "/pvams/upload",
      addCompanyForm: {
        grantAuthType: 0,
      },
      isEditUser: false,
      total: 0,
      hostDomain: "",
      addUserform: {},
      isUserUpdate: false,
      unitId: "",
      pId: "",
      userType: "",
      provinceList: [],
      cityList: [],
      countyList: [],
      queryUserType: 0,
      userList: [
        { label: '超级管理员', value: 1, isNoShow: true },
        { label: '企业管理员', value: 2 },
        { label: '企业运维人员', value: 3 },
        { label: '电站管理员', value: 4 },
        { label: '电站运维人员', value: 5 },
        { label: '电站普通用户', value: 6 },
      ],
      userTypeList: [],
    }
  },
  created() {
    this.hostDomain = `${config.HOST.pvamsDomain}/`;
    const treeData = this.$store.state.getTreeId.treeId;
    this.userType = localStorage.getItem("userType");
    this.getProvince();
    if (treeData.id) {
      const flag = this.userType == 0 ? (treeData.id.includes("s") || treeData.id.includes("c")) : treeData.id.includes("s");
      this.pId = treeData.id.includes("s") ?
                 treeData.pId.slice(1, treeData.id.length) :
                 treeData.id.includes("c") ? treeData.id.slice(1, treeData.id.length) : "";
      this.queryUserType = this.userType == 0 && treeData.id.includes("c") ? 0 : 1;
      if (flag) {
        this.unitId = treeData.id.slice(1, treeData.id.length);
        this.getDataList(1);
      }
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id) {
        const flag = this.userType == 0 ? (treeData.id.includes("s") || treeData.id.includes("c")) : treeData.id.includes("s");
        this.pId = treeData.id.includes("s") ?
                 treeData.pId.slice(1, treeData.id.length) :
                 treeData.id.includes("c") ? treeData.id.slice(1, treeData.id.length) : "";
        this.queryUserType = this.userType == 0 && treeData.id.includes("c") ? 0 : 1;
        if (flag) {
          this.unitId = treeData.id.slice(1, treeData.id.length);
          this.getDataList(1);
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
    // 用户列表
    async getDataList(pageNo) {
      this.loadingOpen();
      const params = {
        userType: this.queryUserType,
        unitId: this.unitId,
        pageNo,
        pageSize: 20,
      };
      const { data: {data: {count = '', userList = [] }} } = await this.axios('/pvams/user/query', { params });
      this.loadingClose();
      this.total = count;
      // userList.forEach(v => {
      //   if (v.role) {
      //     const list = this.userList.filter(d => d.value === v.role);
      //     v.roleName = list && list.length !== 0 && list[0].label;
      //   }
      // });
      this.tableList = userList;
    },
    // 角色列表
    async getRoleDataList(type = 0) {
      const params = {
        type,
        userType: this.queryUserType,
      };
      const { data: { data: { resultList = [] }, code } = {} } = await this.axios(`/pvams/user/getRole`, { params });
      if (code === 200) {
        this.userTypeList = resultList;
      }
    },
    // 公司信息
    async getCompanyList() {
      const url = `/pvams/unit/query/${this.pId}`;
      const { data: { data: { company = {} } } } = await this.axios(url);
      return company;
    },
    // 编辑公司
    async clickUpdateCompany() {
      const data = await this.getCompanyList();
      if (data.provinceId) {
        await this.changeProvince(data.provinceId)
        if (data.cityId) {
          await this.changeCity(data.cityId);
        }
      }
      this.addCompanyForm = data;
      this.addCompanyForm.provinceId = Number(data.provinceId) || ''
      this.addCompanyForm.cityId = Number(data.cityId) || ''
      this.addCompanyForm.countyId = Number(data.countyId) || ''
      // this.addCompanyForm = {
      //   ...data,
      //   provinceId: Number(data.provinceId) || '',
      //   cityId: Number(data.cityId) || '',
      //   countyId: Number(data.countyId) || '',
      // };
      this.isVisibleAddCompany = true;
      this.isUpdateCompany = true;
      this.isDisable = true;
    },
    // 市信息
    async getProvince() {
      const { data: { data: { data = [] } } } = await this.axios('/pvams/getProvince');
      this.provinceList = data
    },
    // change
    async changeProvince(v) {
      this.addCompanyForm.cityId = '';
      this.$set(this.addCompanyForm, 'countyId', '');
      const url = `/pvams/getCity/${v}`;
      const { data: { data: { data = [] } } } = await this.axios(url);
      this.cityList = data;
      this.countyList = [];
    },
    async changeCity(v) {
      this.$set(this.addCompanyForm, 'countyId', '');
      const url = `/pvams/getCounty/${v}`;
      const { data: { data: { data = [] } } } = await this.axios(url);
      this.countyList = [...data];
    },
    // 
    clickAddUser(type) {
      this.getRoleDataList(type);
      this.addUserform = {};
      this.isVisibleAddUser = true;
      this.isUserUpdate = false;
    },
    confirmAddCompany(formName) {
      this.$refs[formName].validate(async (valid) => {
        const url = this.isUpdateCompany ? '/pvams/unit/update' : '/pvams/unit/add';
        if (valid) {
          const { data: { code = "", data = {} } } = await this.axios.post(url, this.addCompanyForm);
          if (code === 200) {
            this.$message({ type: 'success', message:  this.isUpdateCompany ? '编辑成功' :  '添加成功' });
            // const resultData = {...data};
            // this.$store.commit("getTreeId/treeUpdate", resultData);
            this.isVisibleAddCompany = false;
            location.reload();
          }
        }
      });
    },
    confirmAddUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addUserform,
            userType: this.queryUserType,
            unitId: this.unitId,
          };
          const url = this.isUserUpdate ? "/pvams/user/update" : "/pvams/user/add";
          const { data: {code = ""} } = await this.axios.post(url, params);
          if (code === 200) {
            this.getDataList(1);
            this.isVisibleAddUser = false;
          }
        }
      });
    },
    clickUserUpdate(row, type) {
      this.getRoleDataList(type);
      this.addUserform = {...row}
      this.isUserUpdate = true;
      this.isVisibleAddUser = true;
    },
    async cilckDelete(row, type) {
      const params = {
        idList: type ? row : [row.userId],
        unitId: this.unitId,
        userType: this.queryUserType,
      };
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async (data) => {
        const { data: { code = "" } } = await this.axios.post('/pvams/user/delete', params);
        if (code === 200) {
          this.$message({ type: 'success', message: '操作成功' });
          this.getDataList(1);
        }
      })
    },
    handleSelectionChange(arr) {
      this.selectionIds = arr.map(v => v.userId);
    },
    async clickBatchDel() {
      this.cilckDelete(this.selectionIds, 1);
    },
    handleCurrentChange(val) {
      this.getDataList(val);
    },
    // dialog close
    handleClose(formName) {
      if (formName === 'addCompanyForm') {
        this.addCompanyForm.cityId = '';
        this.addCompanyForm.countyId = '';
      }
      this.$refs[formName].resetFields();
      this.addCompanyForm = {};
    },
    /* 上传成功 */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        const { data } = res;
        this.$set(this.addCompanyForm, 'license', data)
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
  },
}
</script>
<style lang="less" scoped>
.user-adsn {
  .img {
    display: flex;
    align-items: center;
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
}
</style>
<style lang="less">
.user-adsn {
  .img {
    .avatar-uploader {
      .el-upload {
        width: 100%;
      }
    }
  }
}
</style>
