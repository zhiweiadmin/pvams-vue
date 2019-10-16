/** 
* 财务模型
*/
<template>
	<div class="finance">
		<div class="main-content-end">
			<a v-if="getUserJurisdiction('AT33')" :href="`/pvams/finance/template/${stationId}`">
				<el-button size="small" type="">下载模板</el-button>
			</a>
			<el-upload
			  v-if="getUserJurisdiction('AT34')"
			  :style="{marginLeft: '20px'}"
				:action="`/pvams/finance/import/${stationId}`"
				:on-success="(res) => uploadSuccess(res)"
				:show-file-list="false"
				:before-upload="(info) => beforeAvatarUpload(info, 1)">
				<el-button size="small" type="primary">导入数据</el-button>
			</el-upload>
		</div>
		<el-row :style="{marginTop: '20px'}" class="nav" :gutter="20">
			<el-col class="col" :span="item.span" v-for="(item, index) in navList" :key="index">
				<div class="main">
					<div>
						<p>{{item.name || ""}}</p>
						<p class="num">{{item.money || ""}}</p>
					</div>
					<div>
						<img :src="item.icon || ''" alt="">
					</div>
				</div>
			</el-col>
		</el-row>
		<p><el-divider style="height:3px"></el-divider></p>
		<div class="echarts">
			<div class="finchart1">
				<el-button class="btn" size="mini" v-if="btn1" @click="clickBack(3, 'btn1')"><&nbsp; 返回</el-button>
				<div :id="'finchart1'"></div>
			</div>
			<p>
				<el-divider style="height:3px"></el-divider>
			</p>

			<div class="finchart2">
				<el-button class="btn" size="mini" v-if="btn2" @click="clickBack(2, 'btn2')"><&nbsp; 返回</el-button>
				<div :id="'finchart2'"></div>
			</div>
			<p>
				<el-divider style="height:3px"></el-divider>
			</p>
			<div class="finchart3">
				<div :id="'finchart3'"></div>
			</div>
		</div>
		<el-divider style="height:3px"></el-divider>
		<div class="table">
			<el-table header-cell-class-name="table-th" :data="tableList" border stripe>
        <el-table-column type="index" align="center" label="序号" width="60px"></el-table-column>
        <el-table-column prop="policyName" align="center" label="保单名称"></el-table-column>
        <el-table-column prop="policyFee" align="center" label="保费"></el-table-column>
        <el-table-column prop="policyStartDate" align="center" label="保单开始日期"></el-table-column>
        <el-table-column prop="policyEndDate" align="center" label="保单结束日期"></el-table-column>
      </el-table>
		</div>
	</div>
</template>

<script>
import xCharts from "@/components/xCharts.vue";
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts from 'highcharts/highstock'
import HeatMap from 'highcharts/modules/heatmap'
import TreeMap from 'highcharts/modules/treemap'
import jurisdiction from "@/mixin/jurisdictionMixin";

HighchartsDrilldown(Highcharts)
HeatMap(Highcharts)
TreeMap(Highcharts)

export default {
  mixins: [jurisdiction],
	data() {
		return {
			dataJson1: {},
			dataJson2: {},
			btn1: false,
			tableList: [],
			btn2: false,
			navList: [
				{
					name: "电站总投资(元)",
					money: "350,123",
					icon: "",
					span: 4,
				},
				{
					name: "融资成本（元）",
					money: "350,123",
					icon: "",
					span: 4,
				},
				{
					name: "运营成本（元）",
					money: "350,123",
					icon: "",
					span: 4,
				},
				{
					name: "融资成本剩余回收周期（月）",
					money: "24",
					icon: "",
					span: 5,
				},
				{
					name: "运营成本剩余回收周期（月）",
					money: "45",
					icon: "",
					span: 5,
				},
			],
			stationId: "",
		}
	},
	created() {
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
      if (treeData.pId) this.pId = treeData.pId.slice(1, treeData.pId.length);
			if (this.stationId) {
				this.getFinanceInfoData();
				this.getYearBenefitData(3);
				this.getYearBenefitData(2);
				this.getPolicyDataList();
				this.getQueryProfit();
			}
    }
	},
  watch: {
    getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (treeData.pId) this.pId = treeData.pId.slice(1, treeData.pId.length);
				this.getFinanceInfoData();
				this.getYearBenefitData(3);
				this.getYearBenefitData(2);
				this.getPolicyDataList();
				this.getQueryProfit();
      }      
    },
  },
  computed: {
    getStateData() {
      return this.$store.state.getTreeId.treeId;
    },
  },
	methods: {
		// 获取财务数据
		async getFinanceInfoData() {
      this.loadingOpen();
			const params = {
				stationId: this.stationId,
			};
			const { data: { code, data = {} } } = await this.axios("/pvams/finance/getFinanceInfo", { params });
      this.loadingClose();
			if (code === 200) {
				this.navList[0].money = data.total_investment;
				this.navList[1].money = data.finance_cost;
				this.navList[2].money = data.run_cost;
				this.navList[3].money = data.finance_cycle;
				this.navList[4].money = data.run_cycle;
			}
		},
		// 获取保单
		async getPolicyDataList() {
			const params = { stationId: this.stationId };
			const { data: { data: { resultData = [] }, code } = {} } = await this.axios('/pvams/finance/getPolicy', { params });
			if (code === 200) {
				// console.log(resultData);
				this.tableList = resultData;
			}
		},
		// 获取实际/计划发电量及收益数据
		async getYearBenefitData(statType, isbtn) {
      this.loadingOpen();
			const params = {
				stationId: this.stationId,
				statType
			};
			const { data: { code, data: { resultData = [] } = {} } = {} } = await this.axios("/pvams/finance/getYearBenefit", { params });
      this.loadingClose();
			if (code === 200) {
				if (statType === 3) {
					const echartsData = { benefitData: [], powerData: []};
					resultData.forEach(v => {
						if (v) {
							const obj1 = { name: v.date, y: v.benefit };
							const obj2 = { name: v.date, y: v.power };
							echartsData.benefitData.push(obj1);
							echartsData.powerData.push(obj2);
						}
					});
					this.drawLineEch('finchart1',  echartsData);
				} else if (statType === 2) {
					const echartsData = { benefitData: [], powerData: []};
					resultData.forEach(v => {
						if (v) {
							const obj1 = { name: v.date, y: v.benefit };
							const obj2 = { name: v.date, y: v.power };
							echartsData.benefitData.push(obj1);
							echartsData.powerData.push(obj2);
						}
					});
					this.drawLineEch('finchart2',  echartsData);
				}
				if (isbtn) this[isbtn] = false;
			}
		},
		// 获取当年详情数据
		async getMonthBenefitData(statType, year) {
      this.loadingOpen();
			const params = {
				stationId: this.stationId,
				statType,
				year
			};
			const { data: { code, data: { resultData } ={} } = {} } = await this.axios('/pvams/finance/getMonthBenefit', { params });
      this.loadingClose();
			if (code === 200) {
				if (statType === 3) {
					const echartsData = { benefitData: [], powerData: []};
					resultData.forEach(v => {
						if (v) {
							const obj1 = { name: v.date, y: v.benefit };
							const obj2 = { name: v.date, y: v.power };
							echartsData.benefitData.push(obj1);
							echartsData.powerData.push(obj2);
						}
					});
					this.drawLineEch('finchart1',  echartsData);
					this.btn1 = true;
				} else if (statType === 2) {
					const echartsData = { benefitData: [], powerData: []};
					resultData.forEach(v => {
						if (v) {
							const obj1 = { name: v.date, y: v.benefit };
							const obj2 = { name: v.date, y: v.power };
							echartsData.benefitData.push(obj1);
							echartsData.powerData.push(obj2);
						}
					});
					this.drawLineEch('finchart2',  echartsData);
					this.btn2 = true;
				}
			}
		},
		// 获取收益曲线图
		async getQueryProfit() {
			const params = {
				stationId: this.stationId,
			};
			const { data: { code, data } = {} } = await this.axios('/pvams/finance/profit', { params });
			if (code === 200) {
				// console.log(data);
				this.echartMethod(data);
			}
		},
		clickBack(id, btnid) {
			this.getYearBenefitData(id, btnid);
		},
		drawLineEch(id, dataItem) {
			Highcharts.chart(id, {
				chart: {
					type: 'column'
				},
				title: {
					text: id === 'finchart1' ? '实际发电量及收益' : '计划发电量及收益',
					align:'left',
					style:{
						color:'001529',
						fontSize:'18px'
					}
				},
				xAxis: {
					type: 'category'
				},
				yAxis: [{ // Primary yAxis
					labels: {
						format: '{value}Kw·h',
						style: {
							color: '#4A4A93'
						}
					},
					title: {
						text: '发电量（kw·h）',
						style: {
							color: '#4A4A93'
						}
					},
					opposite: true
				}, { // Secondary yAxis
					// gridLineWidth: 0,
					title: {
						text: '收益(元)',
						style: {
							color: '#2CDD00'
						}
					},
					labels: {
						format: '{value} 元',
						style: {
							color: '#2CDD00'
						}
					}
				}],
				credits: {
					enabled: false, 
				},
				exporting: {
					enabled:false
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series: {
						borderWidth: 0,
						dataLabels: {
							enabled: true,
							format: '{point.y:.1f}'
						}
					}
				},
				series: [{
					name: id === 'finchart1' ? '实际年收益' : '计划年收益',
					colorByPoint: true,
					yAxis: 1,
					data: dataItem.benefitData || [],
					events: {
						click: (e) => {
							const year = e.point.name;
							if (String(year).length > 3) {
								// console.log(e.point);
								const statType = id === 'finchart1' ? 3 : 2;
								this.getMonthBenefitData(statType, year);
							}
						}
					}
							// name: '2001',
							// y: 10, =>value
							// drilldown: '2001'
				},{
					name: id === 'finchart1' ?  '实际每年发电量' : '计划每年发电量',
					type: 'spline',
					colorByPoint: true,
					data: dataItem.powerData || [],
				}],
			});
		},
		echartMethod(dataItem) {
			// console.log(dataItem);
			this.dataJson1 = {
				chart: {
					zoomType: "xy"
				},
				title: {
					text: '贷款收益',
					align:'left',
					style:{
						color:'001529',
						fontSize:'18px'
					}
				},
				xAxis: [
					{
						categories: dataItem.name,
						crosshair: true
					}
				],
				exporting: {
					enabled:false
				},
				yAxis: [
					{
						// Primary yAxis
						labels: {
							// format: "{value}Kw·h",
							style: {
								color: "#001529"
							}
						},
						title: {
							text: "金额",
							style: {
								color: "#001529"
							}
						}
					},
					// {
					// 	// Secondary yAxis
					// 	title: {
					// 		text: "等效小时数",
					// 		style: {
					// 			color: "#836FFF"
					// 		}
					// 	},
					// 	labels: {
					// 		format: "{value} ",
					// 		style: {
					// 			color: "#836FFF"
					// 		}
					// 	},
					// 	opposite: true
					// }
				],
				tooltip: {
					shared: true
				},
				legend: {
					layout: "horizontal",
					align: "center",
					floating: false,
					enabled: true,
					x: 0
				},
				series: [
					{
						name: "贷款",
						type: "spline",
						data: dataItem.loan,
						tooltip: {
							// cocor: "#68228B"
						}
					},
					{
						name: "收入",
						type: "spline",
						data: dataItem.income,
						tooltip: {
							// valueSuffix: "h"
						}
					},
					{
						name: "收益",
						type: "spline",
						data: dataItem.profit,
						tooltip: {
							// valueSuffix: "h"
						}
					}
				],
				credits: {
					enabled: false, 
        }
			};
			Highcharts.chart('finchart3', this.dataJson1)
		},
    /* 上传成功 */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
				this.getTableList()
				this.getStatDataList();
				this.getDeviceStatDataList();
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
.finance {
	.nav {
		.col {
			.main {
				padding: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				align-content: center;
				border-radius: 8px;
				box-shadow: 0px 0px 27px 8px #E0E0E0;
				min-height: 95px;
				& > div:nth-of-type(1) {
					font-family: 'Microsoft YaHei UI';
					font-weight: 400;
					color: #8898AA;
					font-size: 12px;
					.num {
						font-size: 20px;
						font-weight: 500;
						color: #32325D;
					}
				}
				& > div:nth-of-type(2) {
					img {
						display: block;
						width: 40px;
						height: 40px;
					}
				}
			}
		}
	}
	.echarts {
		margin-top: 30px;
		& > div {
			height: 400px;
			position: relative;
			.btn {
				position: absolute;
				top: 0;
				right: 200px;
				z-index: 10;
			}
		}
	}
}
</style>
