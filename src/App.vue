<template>
  <div id="app">
    <div v-if="routeName === 'login'">
      <router-view />
    </div>
    <el-container v-else class="container">
      <hearder></hearder>
      <el-main class="main" id="main">
        <city-tree :style="{minWidth: '400px', minHeight: `${domHeight}px`}"></city-tree>
        <div class="view" id="view" :style="{width: 'calc(100% - 400px)'}">
          <el-card v-if="routeName !== 'routineDataMn' " :body-style="{ padding: '20px', height: '100%' }">
            <router-view />
          </el-card>
          <div v-else>
            <router-view />
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import hearder from "@/components/header";
import cityTree from "@/components/cityTree"
export default {
  components: {
    hearder,
    cityTree
  },
  data() {
    return {
      domHeight: 0,
    }
  },
  computed: {
    routeName() {
      return this.$route.name;
    }
  },
  created() {
    const winHeight = window.innerHeight-40-68;
    this.domHeight = winHeight;
  }
}
</script>
<style lang="less" scoped>
#app {
  .main {
    margin-top: 65px;
  }
}
</style>

<style lang="less">
.el-loading-mask {
  margin-top: 65px !important;
  .el-loading-spinner {
    .el-icon-loading {
      font-size: 60px;
    }
    .el-loading-text {
      font-size: 20px;
    }
  }
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  .el-range-separator {
    padding: 0;
  }
  .status-sty {
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      width: 6px;
      height: 6px;
      margin-right: 5px;
      border-radius: 50%;
      background-color: red
    }
  }
  .main-content-end {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .main-content-start {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .main-content-between {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.el-header {
  text-align: center;
  // line-height: 60px;
}
  
.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

#app .el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  display: flex;
}
#app > .el-container {
  flex-direction: column;
}
.table-th {
    padding: 5px 0;
    background-color: #001529 !important;
    color: #ffffff;
  }
</style>
<style lang="less" scoped>
#app {
  .el-card {
    height: 100%;
  }
  .view {
    width: 100%;
    margin-left: 20px;
    text-align: left;
  }
}
</style>
