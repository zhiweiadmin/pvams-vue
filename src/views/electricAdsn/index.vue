/** 
*  发电量管理
*/
<template>
  <div class="electric-adsn">
    <!-- <h1>发电量管理</h1> -->
    <div>
      <el-form :style="{overflow: 'hidden'}" :model="form" ref="form" label-width="80px">
        <el-col :span="12" align="left">
          <el-form-item label-width="0px" label="">
            <el-date-picker
              v-model="year"
              type="monthrange"
              range-separator="至"
              value-format="yyyy-MM"
              start-placeholder="开始日期"
              @change="dateChange"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12" align="right">
          <el-button size="small" :type="isBtnActive ? 'primary' : ''" @click="clickMonthSeason(0), isBtnActive = true">按月</el-button>
          <el-button size="small" :type="(!isBtnActive && isBtnActive !== 0) ? 'primary' : ''" @click="clickMonthSeason(1), isBtnActive = false">按季度</el-button>
        </el-col>
      </el-form>
    </div>
    <el-row :gutter="20">
      <el-col :span="24">
        <p :style="{ textAlign: 'left', marginBottom: '20px' }">发电量及等效小时曲线</p>
      </el-col>
      <el-col :span="24">
        <div class="echart" id="columnar1"></div>
      </el-col>
      <el-col>
        <el-divider style="height:3px"></el-divider>
      </el-col>
      <el-col :span="24" :style="{marginTop: '0'}">
        <el-row :gutter="40">
          <el-col :span="24">
            <p :style="{ textAlign: 'left', marginBottom: '20px' }">资产发电能力进度</p>
          </el-col>
          <el-col :span="12">
            <div :style="{height: '200px'}" id="columnar3"></div>
          </el-col>
          <el-col :span="12">
            <div :style="{height: '200px'}" id="columnar4"></div>
          </el-col>
          <el-col :span="12" :style="{marginTop: '20px'}">
            <div :style="{height: '200px'}" id="columnar5"></div>
          </el-col>
          <el-col :span="12" :style="{marginTop: '20px'}">
            <div :style="{height: '200px'}" id="columnar6"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-divider style="height:3px"></el-divider>
          <el-col :span="24">
            <el-row>
              <el-col :span="18">
                <p :style="{ textAlign: 'left' }">发电量超欠发比例</p>
              </el-col>
            </el-row>
            <div class="" style="height: 150px" id="columnar7"></div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="24">
        <el-row>
          <el-divider style="height:3px"></el-divider>
          <el-col :span="24">
            <el-row>
              <el-col :span="18">
                <p :style="{ textAlign: 'left' }">最近25年电站发电量及等效小时数</p>
              </el-col>
              <el-col :span="6">
                <el-button v-if="isShowBackBtn" size="small" type="" @click="clickBack"><返回</el-button>
              </el-col>
            </el-row>
            <div class="echart" id="columnar2"></div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echart from "echarts/lib/echarts";
import jurisdiction from "@/mixin/jurisdictionMixin";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line"
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import Highcharts from 'highcharts/highstock';
import HeatMap from 'highcharts/modules/heatmap';
import TreeMap from 'highcharts/modules/treemap';
import moment from "moment";

let flagNum = 0;
// import { eleData1, eleData2  } from "./data.json.js";
export default {
  mixins: [jurisdiction],
  data() {
    return {
      form: {},
      jieduanList: [
        {
          title: '本月时间进度',
          percend: '60%'
        },
        {
          title: '本月发电进度',
          percend: '60%'
        },
        {
          title: '本年时间进度',
          percend: '60%'
        },
        {
          title: '本年发电进度',
          percend: '60%'
        },
      ],
      isBtnActive: 1,
      year: [],
      color1: ["#3A4B68", "#7687E8", "#34D4F1"],
      color2: ["#263849", "#FC7A5C"],
      echartData1: {},
      isShowBackBtn: false,
      loading: "",
      stationId: "",
      echartData2: {},
    }
  },
  async created() {
    const stationId = this.$store.state.getTreeId.treeId.id;
    const stime = moment(new Date()).format('YYYY') + '-01';
    const etime = moment(new Date()).format('YYYY') + '-12';
    this.year = [stime, etime];
    if (stationId && stationId.includes("s")) {
      this.stationId = stationId.slice(1, stationId.length);
      this.getEleData1();
      this.getEleData2();
      this.getProgressData();
    }
  },
  watch: {
    getStateData() {
      const stationId = this.$store.state.getTreeId.treeId.id;
      if (stationId && stationId.includes("s")) {
        this.stationId = stationId.slice(1, stationId.length);
        this.getEleData1();
        this.getEleData2();
        this.getProgressData();
      }
    },
  },
  mounted() {
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
  methods: {
    // 
    dateChange(v) {
      this.getEleData1();
      this.getEleData2();
    },
    clickMonthSeason(type) {
      this.getEleData1(type);
      this.getEleData2(type);
    },
    // echarts
    async getEleData1(type) {
      this.loadingOpen();
      const starttime = this.year && this.year.length !== 0 ? this.year[0] : '';
      const endtime = this.year && this.year.length !== 0 ? this.year[1] : '';
      const resultData = { data: [], lilundata: [],jihuadata: [], shijidata: [], dimensions: [],shijidengxiao: [], fuzhaodengxiao: [], lilundengxiao: []};
      const params = {
        stationId: this.stationId,
        starttime,
        endtime,
        type,
      }
      const {data: {data: {list}}} = await this.axios('/pvams/power/getPowerGeneration', { params });
      this.loadingClose()
      if (list && list.length !== 0) {
        list.forEach((v) => {
          if (v) {
            const year = `${v.year}-${v.dateVal}`;
            resultData.dimensions = ["理论发电量", "辐照发电量", "实际发电量", "实际等效小时数", "辐照等效小时数", "理论等效小时数"]
            resultData.data.push(year);
            resultData.lilundata.push(v.powerTheoryVal);
            resultData.jihuadata.push(v.powerPlanVal);
            resultData.shijidata.push(v.powerRealVal);
            resultData.fuzhaodengxiao.push(v.fuzhaoHour);
            resultData.shijidengxiao.push(v.realHour);
            resultData.lilundengxiao.push(v.theoryHour);
          }
        });
        this.drawLineEch1("columnar1", resultData);
      } else {
        this.drawLineEch1("columnar1", {});
      }
    },
    async getEleData2() {
      this.loadingOpen();
      const resultData = { data: [], lilundata: [], shijidata: [], dimensions: [], shijidengxiao: [], lilundengxiao: [] };
      const params = { stationId: this.stationId };
      const {data: { data: {list} }} = await this.axios('/pvams/power/getPowerWeakRate', { params });
      this.loadingClose()
      if (list && list.length !== 0) {
        list.forEach((v) => {
          if (v) {
            resultData.dimensions = ["理论发电量", "实际发电量", "实际等效小时数", "理论等效小时数"]
            resultData.data.push(v.dateVal);
            resultData.lilundata.push(v.powerTheoryVal);
            resultData.shijidata.push(v.powerRealVal);
            resultData.shijidengxiao.push(v.realHour);
            resultData.lilundengxiao.push(v.theoryHour);
          }
        });
        this.echartData2 = resultData;
        this.drawLineEch1("columnar2", resultData);
      } else {
        this.drawLineEch1("columnar2", {});
      }
    },
    async getProgressData() {
      this.loadingOpen();
      const url = `/pvams/power/progress/${this.stationId}`;
      const { data: { code, data: { week = {}, month = {}, quarter = {}, year = {}, beyond = [] } = {} } = {} } = await this.axios(url);
      this.loadingClose();
      if (code === 200) {
        const weekItem = {
          label: ["时间", "发电量"],
          data: [week.dateProgress || "", week.powerProgress || ""],
          notCompleteData: [
            100 - week.dateProgress > 0 ? 100 - week.dateProgress : 0,
            100 - week.powerProgress > 0 ? 100 - week.powerProgress : 0
          ],
        };
        const monthItem = {
          label: ["时间", "发电量"],
          data: [month.dateProgress || "", month.powerProgress || ""],
          notCompleteData: [
            100 - month.dateProgress > 0 ? 100 - month.dateProgress : 0,
            100 - month.powerProgress > 0 ? 100 - month.powerProgress : 0
          ],
        };
        const quarterItem = {
          label: ["时间", "发电量"],
          data: [quarter.dateProgress || "", quarter.powerProgress || ""],
          notCompleteData: [
            100 - quarter.dateProgress > 0 ? 100 - quarter.dateProgress : 0,
            100 - quarter.powerProgress > 0 ? 100 - quarter.powerProgress : 0
          ],
        };
        const yearItem = {
          label: ["时间", "发电量"],
          data: [year.dateProgress || "", year.powerProgress || ""],
          notCompleteData: [
            100 - year.dateProgress > 0 ? 100 - year.dateProgress : 0,
            100 - year.powerProgress > 0 ? 100 - year.powerProgress : 0,
          ],
        };
        const dataItem = {
          data1: [],
          data2: [],
        };
        beyond.forEach(v => {
          if (v.name === '欠发') {
            dataItem.data1 = v.data || [];
          } else if (v.name === '超发') {
            dataItem.data2 = v.data || [];
          }
        });

        this.drawLineEch2(weekItem, 'columnar3', '周');
        this.drawLineEch2(monthItem, 'columnar4', '月');
        this.drawLineEch2(quarterItem, 'columnar5', '季');
        this.drawLineEch2(yearItem, 'columnar6', '年');
        this.drawLineEch3(dataItem);
      }
    },
    drawLineEch1(id, itemData) {
      let myChart = echart.init(document.getElementById(id));
      myChart.setOption({
        color: id === "columnar1" ? this.color1 : this.color2,
        tooltip: {
          trigger: "axis",
          axisPointer: { type: "shadow" },
          backgroundColor: "#fff",
          textStyle: { color: "#000" }
        },
        legend: {
          bottom: 0,
          data: itemData.dimensions || [],
        },
        xAxis: {
          type: "category",
          axisTick: { show: false },
          data: itemData.data
        },
        yAxis: id === "columnar1" ? [
          {
            type: 'value',
            name: '发电量(KW.h)',
          },
          {
            type: 'value',
            name: '等效小时数(h)',
            position: 'right',
            axisLine: {},
            axisLabel: { formatter: '{value} h' }
          },
        ] : [{
              type: 'value',
              name: '发电量(KW.h)',
            },
            {
              type: 'value',
              name: '等效小时数(h)',
              position: 'right',
              axisLine: {},
              axisLabel: { formatter: '{value} h' }
            }
        ],
        series: id === "columnar1" ?  [
        {
            name: "理论发电量",
            type: "bar",
            barGap: 0,
            data: itemData.lilundata
        },
        {
            name: "实际发电量",
            type: "bar",
            barGap: 0,
            data: itemData.shijidata
        },
        {
            name: "辐照发电量",
            type: "bar",
            barGap: 0,
            data: itemData.jihuadata,
        },
        {
          name: "实际等效小时数",
          type: "line",
          barGap: 0,
          yAxisIndex: 1,
          data: itemData.shijidengxiao,
          color: "#7687E8",
          lineStyle: {
            color: "#7687E8",
          },
        },
        {
          name: "辐照等效小时数",
          type: "line",
          yAxisIndex: 1,
          data: itemData.fuzhaodengxiao,
          color: "#34D4F1",
          lineStyle: {
            color: "#34D4F1",
          },
        },
        {
          name: "理论等效小时数",
          type: "line",
          yAxisIndex: 1,
          data: itemData.lilundengxiao,
          color: "#3A4B68",
          lineStyle: {
            color: "#3A4B68",
          },
        },
        ] : [
          {
            name: "理论发电量",
            type: "bar",
            barGap: 0,
            data: itemData.lilundata
          },
          {
            name: "实际发电量",
            type: "bar",
            barGap: 0,
            data: itemData.shijidata
          },
          {
            name: "实际等效小时数",
            type: "line",
            yAxisIndex: 1,
            data: itemData.shijidengxiao,
            color: "#FC7A5C",
            lineStyle: {
              color: "#FC7A5C",
            },
          },
          {
            name: "理论等效小时数",
            type: "line",
            yAxisIndex: 1,
            color: "#263849",
            data: itemData.lilundengxiao,
            lineStyle: {
              color: "#263849",
            },
          },
        ],
      });
      if (id !== 'columnar2') return;
      myChart.on('click', async (data) => {
        if (data.name && data.name.includes('年') || data.name.includes('月')) return;
        flagNum +=1;
        if (flagNum === 1) {
          const params = {
            year: data.name || '',
            stationId: this.stationId
          };
          const resultData = { data: [], lilundata: [], shijidata: [], dimensions: [], shijidengxiao: [], lilundengxiao: [] };
          const {data: { data: {list} }} = await this.axios('/pvams/power/getPowerWeakRateMonth', { params });
          this.isShowBackBtn = true;
          if (list && list.length !== 0) {
            list.forEach((v) => {
              if (v) {
                resultData.dimensions = ["实际发电量", "理论发电量", "实际等效小时数", "理论等效小时数"]
                const valName = v.dateType === 0 ? `${v.dateVal}月` : `${v.dateVal}年`
                resultData.data.push(valName);
                resultData.lilundata.push(v.powerTheoryVal);
                resultData.shijidata.push(v.powerRealVal);
                resultData.shijidengxiao.push(v.realHour);
                resultData.lilundengxiao.push(v.theoryHour);
              }
            });
            this.drawLineEch1("columnar2", resultData);
          } else {
            this.drawLineEch1("columnar2", {});
          }
          flagNum = 0;
        }
      })
    },
    clickBack() {
      this.drawLineEch1("columnar2", this.echartData2);
      this.isShowBackBtn = false;
    },
    drawLineEch2(dataItem, id, str) {
      let myChart = echart.init(document.getElementById(id));
      myChart.setOption({
        color: '#6DA7D7',
        title: {
            align: 'center',
            text: `${str}发电量完成情况`,
            // subtext: '数据来自网络'
        },
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'shadow'
        //     }
        // },
        legend: {
            reversed: true,
            y: 'bottom',
            // bottom: 0,
            data: ['完成率', '未完成率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: 30,
            containLabel: true
        },
        xAxis: {
          min: 0,
          max:100,
            type: 'value',
            // boundaryGap: [0, 0.1]
        },
        yAxis: {
            type: 'category',
            data: dataItem.label || [],
        },
        series: [
          {
            show: false,
            name: '完成率',
            type: 'bar',
            stack: '2',
            barWidth: 30,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: function(v) {
                  if(v.data == 0) return "";
                  return v.data.toFixed(2) + '%'
                },
                textStyle: {
                    color: '',
                    fontSize: 16
                }
              }
            },
            data: dataItem.data || [],
          },
          {
            name: '未完成率',
            data: dataItem.notCompleteData,
            stack: '2',
            barWidth: 30,
            label: {
              normal: {
                show: true,
                position: 'inside',
                formatter: function(v) {
                    if(v.data == 0) return "";
                    return v.data.toFixed(2) + '%'
                },
                textStyle: {
                    color: '',
                    fontSize: 16
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#e88b4d'
                },
                emphasis: {
                    color: '#e88b4d'
                }
              },
            type: 'bar',
          }
        ]
      });
    },
    // 发电量超欠发比例
    drawLineEch3(dataItem) {
      // var categories = ['周发电量', '月发电量','季发电量','年发电量'];
      var categories = ['年发电量'];
      var chart = Highcharts.chart('columnar7', {
        chart: {
          type: 'bar'
        },
        title: {
          text: ''
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        xAxis: [{
          categories: categories,
          reversed: false,
          labels: {
            step: 1
          }
        }, {
          // 显示在右侧的镜像 xAxis （通过 linkedTo 与第一个 xAxis 关联）
          opposite: true,
          reversed: false,
          categories: categories,
          linkedTo: 0,
          labels: {
            step: 1
          }
        }],
        yAxis: {
          title: {
            text: null
          },
          labels: {
            formatter: function () {
              return this.value + '%';
            }
          },
          min: -100
        },
        plotOptions: {
          series: {
            stacking: 'normal'
          }
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + ':' + this.point.y + '%</b>';
          }
        },
        series: [{
            name: '欠发',
            data: dataItem.data1 || [-12, 0,-20,-40],
        }, {
            name: '超发',
            data: dataItem.data2 || [0,45,0,0],
        }]
      });
    },
  },
}
</script>

<style lang="less" scoped>
.electric-adsn {
  .echart {
    min-height: 300px;
    height: 100%;
  }
  .jieduan {
    font-size: 14px;
    padding: 20px;
    & > p {
      color: #333333;
    }
    .main {
      padding: 20px;
      & > div {
        margin: 10px 0;
        & > p {
          display: flex;
          justify-content: space-between;
          color: #5E72E4;
          margin-bottom: 10px;
          & > span {
            color: #C9C9C9;
          }
        }
      }
      .tiao {
        & > p {
          background-color: rgba(242, 242, 242, 1);
          border-radius: 4px;
          height: 8px;
          span {
            display: block;
            height: 8px;
            background-color: rgba(50, 50, 93, 1);
            border-radius: 4px;
          }
        }
      }
    }
  }
}
</style>
<style lang="less">
.electric-adsn {
  .table-th {
      padding: 5px 0;
      background-color: #001529;
      color: #ffffff;
    }
  .el-divider--horizontal {
    height: 2px;
  }
}
</style>
