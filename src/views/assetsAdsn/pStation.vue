// 电站信息
<template>
  <div class="p-station">
    <div class="main-content-between">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>资产管理</el-breadcrumb-item>
          <el-breadcrumb-item>电站信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="main-content-end">
        <el-button size="small" v-if="getUserJurisdiction('AT04')" @click="isVisibleAdd = true">新建电站</el-button>
        <a :href="`${hostname}/pvams/station/template/${stationId}`">
          <el-button size="small" :style="{margin: '0 10px'}">导出模板</el-button>
        </a>
        <el-upload
          v-if="getUserJurisdiction('AT05')"
          :style="{marginLeft: '10px'}"
          :action="`/pvams/station/import/${stationId}`"
          :on-success="(res) => uploadSuccess(res)"
					:show-file-list="false"
          :before-upload="(info) => beforeAvatarUpload(info, 1)">
          <el-button size="small" type="primary">导入信息</el-button>
        </el-upload>
      </div>
    </div>
    <div class="main" v-show="item" v-for="(item, index) in mainList" :key="index">
      <p class="title" v-if="item">{{item.title || ""}}</p>
      <el-form v-if="item" :model="item" label-width="150px" ref="form">
        <el-col class="col" :span="8" v-for="(item1, index1) in item.formList" :key="index1">
          <el-form-item v-if="item1.show" class="item" :label="`${item1.label}：`">
            <span class="form-value">{{item1.value || ""}}</span>
          </el-form-item>
          <!-- 并网信息 -->
        </el-col>
        <!-- <el-col :span="24" class="col">
          <el-form-item v-if="item.title === '并网信息'" label="接入点照片：">
            <div class="imgs">
              <img v-for="(itemimg, indeximg) in item.imgs"
                :key="indeximg"
                :src="itemimg.fileUrl" alt="">
              <el-upload
                v-if="getUserJurisdiction('AT06')"
                class="avatar-uploader"
                :action="`/pvams/station/uploadAccessPointFile/${stationId}`"
                :show-file-list="false"
                :on-success="(res) => uploadSuccess(res)"
                :before-upload="(info) => beforeAvatarUpload(info, 3)">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </div>
          </el-form-item>
        </el-col> -->
        <el-col :span="24" class="col">
          <el-form-item v-if="item.title === '资产影像信息'" label-width="0">
            <el-row>
              <el-col :span="24" class="col" v-for="(assetsImgs, idx) in item.images" :key="idx">
                <el-form-item :label="`${assetsImgs.name}：`">
                    <div class="imgs" style="display:flex;flex-flow:wrap;">
                    <!-- <a class="divimg" :href="itemimg.fileUrl" target="_blank" v-for="(itemimg, indeximg) in assetsImgs.imgs" :key="indeximg">
                       <img :src="itemimg.fileUrl" alt="">
                       <p class="picname">{{itemimg.picName}}</p>
                    </a> -->

                    <!-- <a class="divimg" target="_blank" v-for="(itemimg, indeximg) in assetsImgs.imgs" :key="indeximg">
                       <img :src="itemimg.fileUrl" alt="">
                       <p class="picname">{{itemimg.picName}}</p>
                    </a> -->
                    
                    <!-- <el-upload
                      v-if="getUserJurisdiction('AT06')"
                      class="avatar-uploader"
                      :action="`/pvams/station/uploadAccessPointFile/${stationId}/${index1+1}`"
                      :show-file-list="false"
                      :on-success="(res) => uploadSuccess(res)"
                      :before-upload="(info) => beforeAvatarUpload(info, 3)">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> -->

                    <!-- <el-upload
                      v-if="getUserJurisdiction('AT06')"
                      name="file"
                      :action="`/pvams/station/uploadAccessPointFile/${stationId}/${index1+1}`"
                      list-type="picture-card"
                      :on-preview="handlePictureCardPreview"
                      :on-remove="handleRemove"
                      :on-success="(res) => uploadSuccess(res)"
                      :before-upload="(info) => beforeAvatarUpload(info, 3)">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog> -->
                    <el-upload
                        name="file"
                        :action="`/pvams/station/uploadAccessPointFile/${stationId}/${idx}`"
                        list-type="picture"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                        :file-list="assetsImgs.imgs">
                        <!-- <i class="el-icon-plus"></i> -->
                        <el-button round>点击上传</el-button>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="">
                    </el-dialog>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-form>
    </div>
    <div class="table" :style="{padding: '20px'}">
      <el-row :style="{marginBottom: '20px'}">
        <el-col :span="12"><p :style="{fontWeight: '600'}">电站资料</p></el-col>
        <el-col :span="12" align="right">
          <el-upload
            v-if="getUserJurisdiction('AT07')"
            class="upload-demo"
            :action="`/pvams/station/uploadStationFile/${stationId}`"
            :on-success="(res) => uploadSuccess(res)"
            :before-upload="(info) => beforeAvatarUpload(info, 2)">
            <el-button size="small" type="primary">上传</el-button>
          </el-upload>
        </el-col>
      </el-row>
      <el-table header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column align="center" width="100px" label="序号" type="index"></el-table-column>
        <el-table-column align="center" label="文件名称" prop="fileName">
          <template slot-scope="scope">
            <a class="style-pdf" target="view_window" :href="hostname + scope.row.path">{{scope.row.fileName || ""}}</a>
          </template>
        </el-table-column>
        <el-table-column align="center" width="200px" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini">
              <a :href="`${hostname}/pvams/station/download/${scope.row.id}`">下载</a>
            </el-button>
            <el-button type="text" @click="clickDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="dialog">
      <el-dialog title="新建电站" :visible.sync="isVisibleAdd" width="40%" @close="clickClose">
        <el-form :model="addform" size="small" ref="addform" label-width="100px">
          <el-form-item label="电站名称：" prop="stationName" :rules="[{required: true, message: '请输入电站名称'}]">
            <el-input v-model="addform.stationName"></el-input>
          </el-form-item>
          <el-form-item label="电站类型：" prop="stationType" :rules="[{required: true, message: '请选择电站类型'}]">
            <el-select v-model="addform.stationType" placeholder="请选择">
              <el-option v-for="(item, index) in stationTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" align="center">
          <el-button size="small" @click="isVisibleAdd = false">取 消</el-button>
          <el-button size="small" type="primary" @click="clickConfirmAdd('addform')">确 定</el-button>
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
      isVisibleAdd: false,
      mainList: [],
      tableList: [],
      stationId: "",
      pId: "",
      hostname: "",
      isPid: false,
      addform: {
        stationName: "",
      },
      stationTypeList: [
        { label: "地面电站", value: 1 },
        { label: "山地电站", value: 2 },
        { label: "农光电站", value: 3 },
        { label: "渔光电站", value: 4 },
        { label: "渔浮电站", value: 5 },
        { label: "分布式电站", value: 6 },
        { label: "扶贫电站", value: 7 },
        { label: "户用分布式电站", value: 8 },
      ],
      dialogImageUrl: '',
      dialogVisible: false,
      picLists: [],
    }
  },
  created() {
    this.hostname = config.HOST.pvamsDomain || "";
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && (treeData.id.includes("s") || treeData.id.includes("c"))) {
      if (treeData.id.includes("s") && treeData.pId) {
        this.isPid = false;
        this.stationId = treeData.id.slice(1, treeData.id.length);
        this.pId = treeData.pId.slice(1, treeData.pId.length);
      } else if (treeData.id.includes("c") && treeData.id) {
        this.isPid = true;
        this.pId = treeData.id.slice(1, treeData.id.length);
      }
      if (treeData.pId)
      if (this.stationId) this.getDataList();
    }
  },
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && (treeData.id.includes("s") || treeData.id.includes("c"))) {
        if (treeData.id.includes("s") && treeData.pId) {
          this.stationId = treeData.id.slice(1, treeData.id.length);
          this.isPid = false;
          this.pId = treeData.pId.slice(1, treeData.pId.length);
        } else if (treeData.id.includes("c") && treeData.id) {
          this.isPid = true;
          this.pId = treeData.id.slice(1, treeData.id.length);
        }
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
    handleRemove(file, fileList) {
        console.log('准备移除'+file.id)
        this.axios("/pvams/station/deleteAssetsPic/"+file.id);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 
    async getDataList() {
      this.loadingOpen();
      const params = { stationId: this.stationId };
      const { data: {data} } = await this.axios("/pvams/station/getStationInfo", { params });
      this.loadingClose();
      if (data) {
        const {baseInfo = {}, stationInfo = {}, buildInfo = {}, constructInfo = {}, superviseInfo = {}, girdInfo = {}, stationFileList = {}, assetsImgs = {}} = data;
        this.tableList = stationFileList;
        if (baseInfo) {
          baseInfo.title = "电站位置信息";
          baseInfo.formList = [
            { label: "电站名称", value: baseInfo.stationName, show: true },
            { label: "电站编号", value: baseInfo.stationId, show: true },
            { label: "省份选择", value: baseInfo.province, show: true },
            { label: "地级市选择", value: baseInfo.city, show: true },
            { label: "区县级选择", value: baseInfo.county, show: true },
            { label: "乡镇选择", value: `${baseInfo.town}${baseInfo.village}`, show: true },
            { label: "电站经度", value: baseInfo.longitude, show: true },
            { label: "电站纬度", value: baseInfo.latitude, show: true },
          ];
        }
        if (stationInfo) {
          stationInfo.title = "电站基础信息";
          const stationType = stationInfo.stationType;
          const flag1 = ['1', '2', '3', '4', '5', '6', '7'].includes(stationType); // 5-7

          stationInfo.formList = [
            // { label: "发电站名称", value: stationInfo.stationName, show: true },
            // { label: "发电站地址", value: stationInfo.address, show: true },
            // { label: "容配比", value: stationInfo.scale, show: true },
            { label: "电站类型", value: stationInfo.stationTypeName, show: true },
            { label: "装机容量(MW)", value: stationInfo.installedCapacity, show: true },
            { label: "并网容量(MW)", value: stationInfo.gridCapacity, show: true },

            { label: "电站装机功率", value: stationInfo.installedPower, show: false }, // 1
            { label: "并网时间", value: stationInfo.gridTime, show: true }, // 2
            { label: "项目倾角", value: stationInfo.projectAngle, show: true }, // 3
            { label: "阵列间距", value: stationInfo.arraySpace, show: true }, // 4
            { label: "并网电压等级(KV)", value: stationInfo.gridPowerLevel, show: flag1 }, // 5
            { label: "并网点数量", value: stationInfo.gridNum, show: flag1 }, // 6
            { label: "电站容配比", value: stationInfo.scale, show: true }, // 7

            { label: "送出线路长度", value: stationInfo.lineLength, show: ['1', '2', '3', '4', '5'].includes(stationType) }, // 8
            { label: "路面类型", value: stationInfo.roadType, show: ['1', '2', '3', '4', '5', '7'].includes(stationType) }, //9
            { label: "是否于耕种区毗邻", value: stationInfo.isCloseFramarea, show: ['1', '2', '3', '7'].includes(stationType) }, // 10
            { label: "是否封闭围栏", value: stationInfo.isCorral, show: ['1', '2', '3', '7'].includes(stationType) }, // 11
            { label: "是否有外来人员种植", value: stationInfo.isOutsidersPlant, show: ['1', '2', '3', '7'].includes(stationType) }, // 12
            { label: "是否有外来人员祭祖", value: stationInfo.isOutsidersAncestor, show: ['1', '2', '3', '7'].includes(stationType) }, // 13
            { label: "组件底端距地面距离", value: stationInfo.bottomLandDistance, show: ['1', '2', '3', '7'].includes(stationType) }, // 14
            { label: "水塘数量", value: stationInfo.pondNum, show: ['4', '5'].includes(stationType) }, // 15
            { label: "水塘平均深度", value: stationInfo.pondAvgDepth, show: ['4', '5'].includes(stationType) }, // 16
            { label: "浮体类型", value: stationInfo.floatType, show: ['4'].includes(stationType) }, // 17
            { label: "固定类型", value: stationInfo.fixedType, show: ['4'].includes(stationType) }, // 18
            { label: "组件底端距水面距离", value: stationInfo.bottomWaterDistance, show: ['4', '5'].includes(stationType) }, // 19
            { label: "是否有水产养殖", value: stationInfo.isAquatic, show: ['4', '5'].includes(stationType) }, // 20
            { label: "是否有动物养殖", value: stationInfo.isAnimal, show: ['3'].includes(stationType) }, // 21
            { label: "屋顶类型", value: stationInfo.roofType, show: ['6', '8'].includes(stationType) }, // 22
            { label: "有/无采光带", value: stationInfo.isDaylight, show: ['6', '8'].includes(stationType) }, // 23
            { label: "上屋面条件", value: stationInfo.upCondition, show: ['6', '8'].includes(stationType) }, // 24
            { label: "屋顶数量(座)", value: stationInfo.roofNum, show: ['6', '8'].includes(stationType) }, // 25
            { label: "分布点数量", value: stationInfo.distributionPointNum, show: ['6', '7', '8'].includes(stationType) }, // 26
            { label: "清洗水源", value: stationInfo.clearWaterSource, show: ['1', '2', '3', '4', '5'].includes(stationType) }, // 27
            { label: "清洗水源接入", value: stationInfo.clearWaterSourceAccess, show: ['6', '8'].includes(stationType) }, // 28
          ];
        }
        if (buildInfo) {
          buildInfo.title = "施工信息";
          buildInfo.formList = [
            { label: "施工单位", value: buildInfo.buildCompany, show: true },
            { label: "联系人", value: buildInfo.contact, show: true },
            { label: "联系电话", value: buildInfo.phone, show: true },
            { label: "单位地址", value: buildInfo.companyAddress, show: true },
            { label: "备注", value: buildInfo.remark, show: true },
          ];
        }
        if (constructInfo) {
          constructInfo.title = "建设信息";
          constructInfo.formList = [
            { label: "建设单位", value: constructInfo.constructCompany, show: true},
            { label: "联系人", value: constructInfo.contact, show: true },
            { label: "联系电话", value: constructInfo.phone, show: true },
            { label: "单位地址", value: constructInfo.companyAddress, show: true },
            { label: "备注", value: constructInfo.remark, show: true },
          ];
        }
        if (superviseInfo) {
          superviseInfo.title = "监理信息";
          superviseInfo.formList = [
            { label: "监理单位", value: superviseInfo.superviseCompany, show: true  },
            { label: "联系人", value: superviseInfo.contact, show: true },
            { label: "联系电话", value: superviseInfo.phone, show: true },
            { label: "单位地址", value: superviseInfo.companyAddress, show: true },
            { label: "备注", value: superviseInfo.remark, show: true },
          ];
        }
        if (girdInfo) {
          girdInfo.title = "并网信息";
          girdInfo.formList = [
            { label: "电网名称", value: girdInfo.girdName, show: true },
            { label: "联系人", value: girdInfo.contact, show: true },
            { label: "联系电话", value: girdInfo.phone, show: true },
            { label: "电压等级", value: girdInfo.voltageLevel, show: true },
            { label: "备注", value: girdInfo.remark, show: true }
          ];
        }
        let objAssetsImgs = {};
        if (assetsImgs) {
          console.log(assetsImgs);
          objAssetsImgs.title = "资产影像信息";
          Object.keys(assetsImgs).forEach((v) => {
            if (assetsImgs[v] && assetsImgs[v].length !== 0) {
              assetsImgs[v].forEach((d) => {
                 //d.fileUrl = config.HOST.pvamsDomain + d.fileUrl;
                 this.picLists.push({url: d.fileUrl,name:d.picName});
              }) 
            }
          });
          let images = [
            { name: '电站整体图', imgs: assetsImgs.TYPE0,idx:0 },
            { name: '支架基础', imgs: assetsImgs.TYPE1,idx:1 },
            { name: '组串', imgs: assetsImgs.TYPE2 ,idx:2},
            { name: '汇流箱', imgs: assetsImgs.TYPE3 ,idx:3},
            { name: '逆变器', imgs: assetsImgs.TYPE4 ,idx:4},
            { name: '变压器', imgs: assetsImgs.TYPE5 ,idx:5},
            { name: '高压开关', imgs: assetsImgs.TYPE6 ,idx:6},
            { name: '电压互感器(PT柜)', imgs: assetsImgs.TYPE13,idx:13 },
            { name: '并网柜', imgs: assetsImgs.TYPE7 ,idx:7},
            { name: '并网表', imgs: assetsImgs.TYPE8 ,idx:8},
            { name: '防雷接地装置', imgs: assetsImgs.TYPE9 ,idx:9},
            { name: 'SVG', imgs: assetsImgs.TYPE10 ,idx:10},
            { name: '接地变压器', imgs: assetsImgs.TYPE11 ,idx:11},
            { name: '电容柜', imgs: assetsImgs.TYPE12 ,idx:12},
            { name: '辅助设施', imgs: assetsImgs.TYPE14 ,idx:14}
          ];
          objAssetsImgs.images = images;
        }
        console.log(objAssetsImgs)
        if (girdInfo) {
          if (girdInfo.accessPointFiles && girdInfo.accessPointFiles.length !== 0) {
            girdInfo.accessPointFiles.forEach(v => {
              v.fileUrl = config.HOST.pvamsDomain + v.fileUrl;
            });
            girdInfo.imgs = girdInfo.accessPointFiles;
          }
          girdInfo.type = 1;
        }
        this.mainList = [baseInfo, stationInfo, constructInfo,buildInfo, superviseInfo, girdInfo, objAssetsImgs];
      }
    },
    clickClose() {
      this.$refs.addform.resetFields();
    },
    clickConfirmAdd(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const params = {
            ...this.addform,
            companyId: this.pId
          };
          const { data } = await this.axios.post("/pvams/station/add", params);
          if (data.code === 200) {
            this.$message({type: "success", message: "添加成功"});
            this.isVisibleAdd = false;
            const resultData = {
              ...data.data.data,
              isPid: this.isPid
            }
            this.$store.commit("getTreeId/treeUpdate", resultData);
          }
        }
      })
    },
    /* 上传成功 */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
        this.getDataList()
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
    clickAddpStation() {},
    clickUpload() {},
    async clickDelete(row) {
      const { id } = row;
      const { data } = await this.axios(`/pvams/station/deleteStationFile/${id}`);
      if (data && data.code == 200) {
        this.$message({type: 'success', message: "删除成功"})
        this.getDataList();
      }
    },
  },
}
</script>

<style lang="less" scoped>
.p-station {
  .main {
    padding: 20px;
    .title {
      font-size: 16px;
      font-weight: 600;
      margin: 10px 0;
    }
    .col {
      .item {
        .form-value {
          display: block;
          margin-top: 11px;
        }
      }
      .imgs {
        display: flex;
        img {
          display: block;
          // float: left;
          margin: 10px;
          border-radius: 5px;
          background-color: #ccc;
        }
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
        .divimg {
          position: relative;
          .picname {
            position: absolute;
            bottom: -10px;
            left: 10px;
          }
        }
      }
    }
  }
  .style-pdf {
    color: #409EFF;
    text-decoration: underline;
  }
}
</style>
<style lang="less">
.p-station {
  .main {
    overflow: hidden;
    clear: both;
    .col {
      .el-form-item {
        margin-bottom: 10px;
      }
      .el-form-item__content {
        line-height: initial
      }
      .form-value {
        white-space: nowrap;
      }
    }
    .imgs {
      .avatar-uploader {
        .el-upload {
          width: 100%;
        }
      }
    }
    li{
      float: left;
      list-style:none;
      display: block;
      width: 200px;
      margin: 10px;
    }
  }
}
</style>
