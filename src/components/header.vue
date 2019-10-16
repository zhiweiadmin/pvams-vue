<template>
  <div class="">
    <div class="headermain">
      <el-header class="header" height="65px">
        <div class="logo">
          <img src="../assets/logo.png" alt="">
        </div>
        <div class="nav" v-for="(item, index) in navList" :key="index">
          <router-link class="link" :class="{activeColor: item.route == activeRoute.route || item.route == activeRoute.proute}" v-if="item.route" :to="{name: item.route}">
            {{item.name || ""}}
          </router-link>
          <span class="link" v-else :class="{activeColor: item.route == activeRoute.route}">{{item.name}}</span>
          <div v-if="item.children && item.children.length !== 0" class="nav-children">
            <p class="title">{{item.name || ""}}</p>
            <el-row class="children">
              <el-col class="nav-c" :span="(item.children.length > 3) ? 8 : 24" v-for="(citem, index1) in item.children" :key="index1">
                <div class="link" @click="clickGoToUrl(citem)" :class="{activeColor: citem.route == activeRoute.route}">
                  <span class="">{{citem.name || ""}}</span>
                </div>
                <span class="info">{{citem.info || ""}}</span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="userInfo">
          <span>欢迎：</span>
          <el-dropdown>
            <span class="el-dropdown-link" :style="{color: '#A5ACB3'}">
              {{realname}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="">
                <div @click="clickLoginOut">注销登录</div>
                </el-dropdown-item>
              <el-dropdown-item icon="">
                <div @click="clickEditUserInfo">修改信息</div>
              </el-dropdown-item>
              <el-dropdown-item icon="">
                <router-link :to="{name: 'userDataMn'}">数据维护</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- <span class="login-out" @click="clickLoginOut">退出</span> -->
        </div>
      </el-header>

    </div>
    <el-dialog title="修改信息" :visible.sync="isVisibleUser" width="40%" @close="handleClose('addUserform')">
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
        <el-form-item :style="{textAlign: 'left'}" label="角色：" prop="role" :rules="[{required: true, message: '请选择角色'}]">
          <el-select class="12" v-model="addUserform.role" placeholder="请选择角色">
            <el-option v-if="getUserJurisdiction('AT03')" label="超级管理员" :value="1"></el-option>
            <el-option class="12" v-for="(item, index) in userList"
              v-if="!item.isNoShow"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="密码：" prop="password" :rules="[{required: true, message: '请输入密码'}]">
          <el-input v-model="addUserform.password"></el-input>
        </el-form-item>
      </el-form>
      <div align="center" slot="footer">
        <el-button size="small" @click="isVisibleUser = false">取 消</el-button>
        <el-button size="small" type="primary" @click="confirmAddUser('addUserform')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import jurisdiction from "@/mixin/jurisdictionMixin";

export default {
  mixins: [jurisdiction],
  data() {
    return {
      isVisibleUser: false,
      realname: "",
      activeRoute: {
        route: ""
      },
      navList: [
        {
          name: "发电量管理",
          route: "electricAdsn",
          link: "/electricAdsn#/electricAdsn",
          id: "",
        },
        {
          name: "预防性维护",
          route: "preventionMn",
          link: "/preventionMn#/preventionMn",
          id: "",
        },
        {
          name: "资产管理",
          route: "pStation",
          link: "/pStation#/assetsAdsn/pStation",
          id: "",
          children: [
            {
              name: "电站信息",
              route: "pStation",
              link: "/#/assetsAdsn/pStation",
              proute: "pStation",
              id: "",
              info: "查询并管理电站基础信息",
            },
            {
              name: "设备信息",
              route: "equipment",
              proute: "pStation",
              link: "/#/assetsAdsn/equipment",
              id: "",
              info: "查询并管理电站内的设备信息",
            },
            {
              name: "人员信息",
              route: "personnel",
              proute: "pStation",
              link: "/#/assetsAdsn/personnel",
              id: "",
              info: "查询并管理电站内的人员信息",
            },
          ],
        },
        {
          name: "维护信息",
          route: "imptMn",
          id: "",
          link: "/imptMn#/imptMn",
          children: [
            {
              name: "重要维护",
              route: "imptMn",
              link: "/imptMn#/imptMn",
              id: "",
              info: "查询并管理电站重要维护信息",
            },
            {
              name: "常规数据维护",
              route: "routineDataMn",
              proute: "imptMn",
              link: "/routineDataMn#/routineDataMn",
              id: "",
              info: "查询并管理常规数据维护",
            },
            {
              name: "消防器材维护",
              route: "fireEquipmentMn",
              proute: "imptMn",
              id: "",
              link: "/fireEquipmentMn#/fireEquipmentMn",
              info: "查询并管理电站内消防器材",
            },
            {
              name: "安全管理",
              route: "security",
              proute: "imptMn",
              link: "/security#/security",
              id: "",
              info: "查询并管理电站安全联控"
            },
            {
              name: "工器具管理",
              route: "toolsImplementsMn",
              proute: "imptMn",
              id: "",
              link: "/toolsImplementsMn#/toolsImplementsMn",
              info: "查询并管理电站内工器具信息",
            },
            {
              name: "车辆出行报备",
              route: "carTrip",
              proute: "imptMn",
              link: "/carTrip#/carTrip",
              id: "",
              info: "查询并管理电站内车辆信息",
            },
            {
              name: "备件管理",
              route: "sparePart",
              proute: "imptMn",
              link: "/sparePart#/sparePart",
              id: "",
              info: "查询并管理电站备件信息",
            },
            {
              name: "培训管理",
              route: "train",
              proute: "imptMn",
              id: "",
              link: "/train#/train",
              info: "查询并管理电站内的培训计划",
            },
          ],
        },
        {
          name: "财务模型",
          route: "finance",
          link: "/finance#/finance",
          id: "",
        },
        {
          name: "数据分析",
          route: "dataFinance",
          link: "/dataFinance#/dataFinance",
          id: "",
        },
        {
          name: "用户管理",
          link: "/userAdsn#/userAdsn",
          route: "userAdsn",
          id: "",
        }
      ],
      addUserform: {},
      userType: "",
      unitId: "",
      userList: [
        { label: '超级管理员', value: 1, isNoShow: true },
        { label: '企业管理员', value: 2 },
        { label: '企业运维人员', value: 3 },
        { label: '企业运维人员', value: 4 },
        { label: '电站管理员', value: 5 },
        { label: '电站运维人员', value: 6 },
        { label: '电站普通用户', value: 7 },
      ],
    }
  },
  watch: {
    $route(val = {}) {
      const { name = '' } = val;
      this.navList.forEach((v) => {
        if (v.route === name) {
          this.activeRoute = v;
        } else if (v.children && v.children.length !== 0) {
          v.children.forEach((d) => {
            if (d.route === name) this.activeRoute = d;
          })
        }
      }) || {};
    },
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id) {
        const flag = this.userType == 0 ? (treeData.id.includes("s") || treeData.id.includes("c")) : treeData.id.includes("s");
        this.pId = treeData.id.includes("s") ?
                 treeData.pId.slice(1, treeData.id.length) :
                 treeData.id.includes("c") ? treeData.id.slice(1, treeData.id.length) : "";
        if (flag) {
          this.unitId = treeData.id.slice(1, treeData.id.length);
        }
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  created() {
    const treeData = this.$store.state.getTreeId.treeId;
    this.userType = localStorage.getItem("userType");
    if (treeData.id) {
      const flag = this.userType == 0 ? (treeData.id.includes("s") || treeData.id.includes("c")) : treeData.id.includes("s");
      this.pId = treeData.id.includes("s") ?
                 treeData.pId.slice(1, treeData.id.length) :
                 treeData.id.includes("c") ? treeData.id.slice(1, treeData.id.length) : "";
      if (flag) {
        this.unitId = treeData.id.slice(1, treeData.id.length);
      }
    }
    this.realname = window.localStorage.getItem("realname");
  },
  methods: {
    // 获取当前用户信息
    async getUserInfo() {
      const params = {};
      const { data: { code, data = {} } } = await this.axios('/pvams/user/queryUserInfo?userId=1', { params });
      if (code === 200) {
        this.addUserform = { ...data };
      }
    },
    clickEditUserInfo() {
      this.isVisibleUser = true;
      this.getUserInfo();
    },
    handleClose(formName) {
      this.$refs[formName].resetFields();
    },
    confirmAddUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addUserform,
            userType: this.userType,
            unitId: this.unitId,
          };
          const { data: {code = ""} } = await this.axios.post("/pvams/user/update", params);
          if (code === 200) {
            this.isVisibleUser = false;
          }
        }
      });
    },
    clickGoToUrl(item) {
      // const hostname = location.hostname;
      // if (hostname ==='148.70.2.3' || hostname === '101.37.67.138') {
      //   window.location.replace(`/pvams/${item.link}`);
      // } else {
      //   window.location.replace(item.link);
      // }
      this.$router.push({name: item.route});
    },
    async clickLoginOut() {
      const { data: { code } } = await this.axios('/pvams/logout');
      if (code === 200) {
        localStorage.removeItem('realname');
        localStorage.removeItem('token');
        localStorage.removeItem('userType');
        localStorage.removeItem('username');
        this.$router.push({ name: "login" });
      }
    },
    changeTimeStamp(timeStamp){
      var distancetime = new Date(timeStamp*1000).getTime() - new Date().getTime();
      var ms = Math.floor(distancetime%1000);
      var sec = Math.floor(distancetime/1000%60);
      var min = Math.floor(distancetime/1000/60%60);
      var hour =Math.floor(distancetime/1000/60/60%24);
      if(ms<10) ms = "0"+ ms;
      if(sec<10) sec = "0"+ sec;
      if(min<10) min = "0"+ min;
      if(hour<10) hour = "0"+ hour;
      const time = hour + ":" +min + ":" +sec; 
      if (time === '00:00:01') {
        // document.querySelector('#btnSC').click();
        return '停止';
      } else {
        return '开始';
      }
      // return hour + ":" +min + ":" +sec + ":" +ms;
    }
  }
  
}
</script>

<style lang="less" scoped>
.headermain {
  position: fixed;
  width: 100%;
  z-index: 100;
  top: 0;
}
.header {
  position: relative;
  background-color: rgba(0, 21, 41, 1);
  display: flex;
  justify-content: space-around;
  align-items: center;
  align-content: center;
  color: #A5ACB3;
  font-size: 14px;
  font-weight: 600;
  .logo {
    img {
      display: block;
      width: 61px;
      height: 58px;
    }
  }
  .nav {
    margin: 0 10px;
    height: 100%;
    display: flex;
    align-items: center;
    .nav-children {
      position: absolute;
      width: 100%;
      top: 65px;
      left: 0;
      background-color: #0B1822;
      height: 0;
      z-index: 100;
      overflow: hidden;
      transition: height .3s;
      .title {
        padding-top: 50px;
        text-align: left;
        padding-left: 200px;
        font-weight: 500;
        line-height: 22px;
      }
      .children {
        margin-top: 20px;
        font-weight: 500;
        padding-left: 200px;
        text-align: left;
        .nav-c {
          display: flex;
          align-items: center;
          margin: 10px 0;
          .link {
            span {
              font-size: 14px;
              display: block;
              padding: 4px 16px;
              width: 160px;
              background-color: #19262F;
              border-radius: 4px;
              line-height: 22px;
            }
          }
        }
        .info {
          position: relative;
          margin-left: 10px;
          padding-left: 5px;
          &::before {
            position: absolute;
            top: 0;
            left: 0;
            content: " ";
            background-color: #fff;
            width: 2px;
            height: 100%;
          }
        }
      }
    }
    &:hover {
      .nav-children {
        height: 300px;
      }
    }
    .link {
      cursor: pointer;
      &:hover {
        color: #fff;
      }
    }
    .activeColor {
      color: #fff;
    }
  }
  .userInfo {
    cursor: pointer;
    .login-out {
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
</style>
