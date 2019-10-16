// 人员信息
<template>
  <div class="personnel">
    <el-row>
      <el-col :span="12">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>资产管理</el-breadcrumb-item>
          <el-breadcrumb-item>人员信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="12" align="right">
        <el-button size="small" @click="clickAdd">新建人员</el-button>
      </el-col>
    </el-row>
    <div class="main">
      <el-row :gutter="20">
        <el-col v-for="(item, index) in userDataList" :key="index" class="col" :span="8">
          <div class="list">
            <div class="info">
              <div class="faic" @click="clickShowImg(item.userPic)"><img :src="item.userPic || '../../assets/u3571.svg'" alt=""></div>
              <div class="userInfo">
                <p class="name">{{item.realName || ''}}</p>
                <p :style="{marginBottom: '10px'}">身份证号： <span>{{item.idCard || ''}}</span></p>
                <p>资质：<span @click="clickShowImg(item.certificatePic)" :style="{color: '#8D8DFF', cursor: 'pointer'}">{{item.credential || ''}}</span></p>
              </div>
              <div class="btns">
                <el-button size="mini" icon="el-icon-edit" type="" @click="clickEdit(item)"></el-button>
                <el-button :style="{marginLeft: '2px'}" size="mini" icon="el-icon-delete" type="" @click="clickDelete(item)"></el-button>
              </div>
            </div>
            <div class="footer">
              <span>{{item.maintainCompany || ''}}</span>
              <span>{{item.position || ''}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="dialog">
      <el-dialog @close="dialogClose('addForm')" title="人员信息新增" :visible.sync="isVisibleAdd" width="40%">
        <div class="dialog-main">
          <el-form :model="addForm" size="small" ref="addForm" label-width="120px">
            <el-form-item label="姓名：" prop="realName" :rules="[{required: true, message: '请输入姓名'}]">
              <el-input v-model="addForm.realName "></el-input>
            </el-form-item>
            <el-form-item label="运营公司名称：" prop="maintainCompany" :rules="[{required: true, message: '请输入运营公司名称'}]">
              <el-input v-model="addForm.maintainCompany "></el-input>
            </el-form-item>
            <el-form-item label="职位：" prop="position"
              :rules="[
              {required: true, message: '请输入职位'},
              ]">
              <el-input v-model="addForm.position "></el-input>
            </el-form-item>
            <el-form-item label="身份证号：" prop="idCard"
              :rules="[
                {required: true, message: '请输入身份证号'},
                {pattern: /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/, message: '请输入正确得身份证号'}
              ]">
              <el-input v-model="addForm.idCard "></el-input>
            </el-form-item>
            <el-form-item label="资质：" prop="credential" :rules="[{required: true, message: '请输入资质'}]">
              <el-input v-model="addForm.credential"></el-input>
            </el-form-item>
            <el-form-item label="证书：" prop="certificatePic" :rules="[{required: true, message: '请上传证书'}]">
              <div class="update-logo">
                <div class="logos round-logo">
                  <el-upload
                    :action="actionUrl"
                    :on-success="(res) => uploadSuccess(res, 'certificatePic')"
                    :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                    <!-- <div class="btn-upload" size="small" type="primary">头像上传</div> -->
                  </el-upload>
                  <div class="logo-show-img">
                    <img :src="addForm.certificatePic" alt="">
                    <div class="cover-bcg"></div>
                  </div>
                <div class="pic-update">
                  <p><span></span></p>
                  <p> <span>图片格式支持JPG、PNG</span></p>
                </div>
              </div>
            </div>
            </el-form-item>
            <el-form-item label="头像：" prop="userPic" :rules="[{required: true, message: '请上传头像'}]">
              <div class="update-logo">
                <div class="logos round-logo">
                  <el-upload
                    :action="actionUrl"
                    :on-success="(res) => uploadSuccess(res, 'userPic')"
                    :before-upload="beforeAvatarUpload">
                    <i class="el-icon-plus"></i>
                    <!-- <div class="btn-upload" size="small" type="primary">头像上传</div> -->
                  </el-upload>
                  <div class="logo-show-img">
                    <img :src="addForm.userPic" alt="">
                    <div class="cover-bcg"></div>
                  </div>
                  <div class="pic-update">
                    <p><span></span></p>
                    <p> <span>图片格式支持JPG、PNG</span></p>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" align="center">
          <el-button @click="clickCancel('addForm')">取 消</el-button>
          <el-button type="primary" @click="clickAddper('addForm')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="isVisibleImg"
        width="40%">
        <img :style="{display: 'block',width: '100%', height: '100%'}" :src="showImg || ''" alt="">
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
      isVisibleAdd: false,
      isVisibleImg: false,
      userDataList: [],
      actionUrl: "/pvams/upload",
      showImg: "",
      stationId: "",
      hostname: "",
      addForm: {
        realName: "",
        maintainCompany: "",
        position: "",
        idCard: "",
        credential: "",
        certificatePic: "",
        userPic: "",
      },
    }
  },
  created() {
    this.hostname = config.HOST.pvamsDomain || ""
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id  && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (this.stationId) this.getDataList();
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id  && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (treeData.pId) this.pId = treeData.pId.slice(1, treeData.pId.length);
        this.getDataList();
      }
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    clickAdd() {
      this.isVisibleAdd = true;
      this.addForm = {};
    },
    // 新增确认
    clickAddper(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const {certificatePic = "", userPic = ""} = this.addForm;
          const filerCertificatePic = certificatePic.slice(certificatePic.indexOf("/file"), certificatePic.length);
          const fileUserPic = userPic.slice(userPic.indexOf("/file"), userPic.length);
          const params = {
            ...this.addForm,
            stationId: this.stationId || 1,
            certificatePic: filerCertificatePic,
            userPic: fileUserPic
          };
          const url = this.addForm.memberId ? '/pvams/member/update' : '/pvams/member/add';
          const { data } = await this.axios.post(url, params);
          if (data.code === 200) {
            this.getDataList();
            this.isVisibleAdd = false;
          }
        }
      })
    },
    clickDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { memberId = "" } = row;
        const params = { memberId };
        const { data: { code } } = await this.axios('/pvams/member/delete', { params });
        if (code === 200) {
          this.$message({ type: 'success', message: '删除成功' });
          this.getDataList();
        }
      });
    },
    dialogClose(formName) {
      this.addForm = {};
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    clickCancel(formName) {
      this.isVisibleAdd = false;
    },
    clickEdit(row) {
      this.isVisibleAdd = true;
      this.addForm = {...row};
    },
    clickShowImg(img) {
      const imgSrc = img.indexOf('http://') === 0 ? img : `${this.hostname}${img}`
      this.isVisibleImg = true;
      this.showImg = imgSrc || "";
    },
    /* 上传成功 */
    uploadSuccess(res, img) {
      this.$set(this.addForm, img, config.HOST.pvamsDomain + res.data);
    },
    // 上传前校验
    beforeAvatarUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      // const isJPGPng = file.type === 'image/jpeg' || file.type === 'image/png';
      // if (!isJPGPng) this.$message.error('上传头像图片只能是 JPG或者Png 格式!');
      if (!isLt10M) this.$message.error('上传大小不得超过10mb!');
      return isLt10M;
    },
    async getDataList() {
      this.loadingOpen();
      // const host = location.origin;
      const params = { stationId: this.stationId || 1 };
      const { data: { data: { list = [] } } } = await this.axios("/pvams/member/query", { params });
      this.loadingClose();
      if (list) {
        list.forEach(v => {
          if (v.userPic) v.userPic = config.HOST.pvamsDomain + v.userPic;
          if (v.certificatePic) v.certificatePic = config.HOST.pvamsDomain + v.certificatePic;
        });
        this.userDataList = list
      }
    },
  },
}
</script>

<style lang="less" scoped>
.personnel {
  .main {
    padding: 20px;
    .col {
      margin-bottom: 20px;
      .list {
        position: relative;
        width: 100%;
        height: 182px;
        overflow: hidden;
        background-color: #ffffff;
        // background-color: red;
        border: 1px solid #cccccc;
        border-radius: 4px;
        .info {
          padding: 10px;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          position: relative;
          .btns {
            position: absolute;
            right: 4px;
            top: 4px;
          }
          .faic {
            img {
              display: block;
              width: 48px;
              cursor: pointer;
              height: 48px;
              border-radius: 50%;
            }
          }
          .userInfo {
            margin-left: 10px;
            font-size: 14px;
            color: #8D8D8D;
            .name {
              color: #000;
              font-weight: 600;
              font-size: 16px;
              margin-bottom: 10px;
            }
            p {
              // white-space: nowrap;
              span {
              }
            }
          }
        }
        .footer {
          position: absolute;
          display: flex;
          bottom: 0;
          left: 0;
          background-color: rgba(233, 233, 233, 1);
          width: 100%;
          height: 46px;
          border-top: 1px solid #cccccc;
          & > span {
            font-size: 12px;
            text-align: center;
            line-height: 46px;
            width: 100%;
            color: #666666;
            &:nth-last-of-type(1) {
              border-left: 1px solid #cccccc;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.personnel {
  .update-logo {
    & > p {
      text-align: center;
      height: 40px;
      line-height: 40px;
      color: #999999;
      // span:nth-of-type(1) {
      //   font-size: 19px;
      //   margin-right: 10px;
      // }
    }
    .logos {
      position: relative;
      margin: 20px 0;
      margin-bottom: 50px;
      text-align: center;
      .el-upload {
        width: 148px;
        line-height: 148px;
        border: 1px dashed #d9d9d9;
        // border-radius: 50%;
      }
      .logo-show-img {
        pointer-events: none;
        position: absolute;
        width: 148px;
        height: 100%;
        top: 0;
        left: 50%;
        margin-left: -74px;
        // border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          display: block;
          cursor: pointer;
          // border-radius: 50%;
          overflow: hidden;
        }
        .cover-bcg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: initial;
        }
      }
    }
    .pic-update {
        position: absolute;
        left: 50%;
        bottom: -50px;
        transform: translateX(-50%);
        text-align: center;
      p:nth-of-type(1) {
        font-size: 14px;
        color: #999999;
        text-align: center;
      }
      p:nth-of-type(2) {
        font-size: 12px;
        color: #BBBBBB;
        text-align: center;
        line-height: 20px;
      }
    }
    .round-logo {
      .el-upload-list--text {
        display: none;
      }
    }
  }
}
</style>
