<template>
  <div class="city-tree">
    <el-card :body-style="{ padding: '20px' }">
      <el-row>
        <el-input size="small" v-model="serach" placeholder="请输入" suffix-icon="el-icon-search"></el-input>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-tree
            ref="tree"
            :default-expanded-keys="defaultKeys"
            :highlight-current="true"
            node-key="id"
            :data="cityList"
            :props="defaultProps"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick">
          </el-tree>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serach: "",
      defaultKeys: [],
      defaultProps: {
        children: "childNodeList",
        label: "showName"
      },
      cityList: [],
    };
  },
  created() {
    const winHeight = window.innerHeight-40-68;
    this.domHeight = winHeight;
    this.getTreeData();
  },
  watch: {
    getDataItem(v) {
      const treeItem = this.$store.state.getTreeId.treeItem;
      const newId = treeItem.pId
      const cityRender = (item, id) => {
        if (item.id == id) {
          item.childNodeList = item.childNodeList ? item.childNodeList : [];
          item.childNodeList.push(treeItem);
        } else if(item.childNodeList && item.childNodeList.length !== 0) {
          item.childNodeList.forEach((d) => {
            cityRender(d, id);
          })
        }
      };
      this.cityList.forEach((v) => {
        cityRender(v, newId);
      });
    },
    serach(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    getDataItem() {
      return this.$store.state.getTreeId.treeItem;
    },
  },
  methods: {
    async getTreeData() {
      const { data: { data: { menuList = [] } = {} } = {} } = await this.axios.post("/pvams/getMenu");
      if (menuList && menuList.length !== 0) {
        this.cityList = menuList;
        if (this.cityList.length !== 0) {
          const dedata = this.cityList[0];
          this.defaultKeys = [];
          this.recursionData(dedata);
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.showName.indexOf(value) !== -1;
    },
    recursionData(data = {}) {
      if (data.childNodeList && data.childNodeList.length !== 0) {
       this.defaultKeys.push(data.id);
       this.recursionData(data.childNodeList[0]);
      } else {
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(data.id);
          this.$store.commit("getTreeId/setTreeId", data);
        })
        return;
      }
    },
    handleNodeClick(v) {
      const { id } = v;
      // console.log(v);
      this.$store.commit("getTreeId/setTreeId", v);
    }
  }
};
</script>

<style lang="less">
.city-tree {
  .is-current {
    &:focus > .el-tree-node__content {
      background-color: #999999 !important;
    }
    & > .el-tree-node__content {
      background-color: #999999 !important;
    }
  }
  .el-tree-node__content {
    &:hover, &:focus {
      background-color: #999999 !important;
    }
  }
  .el-card__body {
    position: fixed;
    width: 400px;
    top: initial;
    height: calc(100% - 100px);
    overflow-y: auto;
  }
}
</style>
<style lang="less" scoped>
.city-tree {
  .el-card {
    height: 100%;
  }
}
</style>