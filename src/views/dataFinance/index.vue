/**
* 数据分析
*/
<template>
  <div class="data-finance">
		<div class="main-content-between">
			<div>
				<!-- <el-button size="small" :type="isBtnActive ? 'primary' : ''" @click="clickType(1), isBtnActive = true">按年</el-button>
				<el-button size="small" :type="(!isBtnActive && isBtnActive !== 0) ? 'primary' : ''" @click="clickType(0), isBtnActive = false">按月</el-button> -->
				<el-date-picker
				    size="small"
					v-model="selDate"
					type="daterange"
					range-separator="至"
					value-format="yyyy-MM-dd"
					start-placeholder="开始日期"
					@change="changeTime"
					end-placeholder="结束日期">
            	</el-date-picker>

					<el-input type="number" :style="{width: '120px', marginLeft: '10px'}" size="small" v-model="num" placeholder="数量"></el-input>
					<el-input :style="{width: '120px', marginLeft: '10px'}" size="small" v-model="deviceName" placeholder="名称"></el-input>
					<el-button type="primary" :style="{marginLeft: '10px'}" size="small" @click="clickQuery">查询</el-button>
					
			</div>
			<div class="main-content-end">
				<a href="/pvams/data/template">
					<el-button size="small" type="">下载模板</el-button>
				</a>
				<el-upload
				  :style="{marginLeft: '20px'}"
          :action="`/pvams/data/import/${stationId}`"
          :on-success="(res) => uploadSuccess(res)"
					:show-file-list="false"
          :before-upload="(info) => beforeAvatarUpload(info, 1)">
          <el-button size="small" type="primary">导入数据</el-button>
        </el-upload>
			</div>
		</div>
    <div :style="{marginTop: '30px'}" class="echart">
      <div :style="{height: '400px'}" id="datachart1"></div>
    </div>
		<div class="table" :style="{marginTop: '20px'}">
			<el-table :default-sort="{prop: '', order: 'descending'}" header-cell-class-name="table-th" :data="tableList1" border stripe>
        		<el-table-column align="center" fixed="left" width="160px" prop="statName" label="日期"></el-table-column>
				<el-table-column
					v-for="(item, index) in columns" :key="index" align="center" :label="item.dayName"
					:width="type === 1 ? '' : '100px'"
					:prop="item.prop">
					<template slot-scope="scope">
						<span>{{scope.row.stats && scope.row.stats.length !==0 && scope.row.stats[item.day] && scope.row.stats[item.day].statVal }}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-row :style="{marginTop: '30px'}">
				<el-col :span="4" align="left">
					<el-select @change="changeStatType" size="small" v-model="statType" placeholder="">
						<el-option label="发电量 " :value="3"></el-option>
						<el-option label="等效小时数" :value="6"></el-option>
					</el-select>
				</el-col>
			</el-row>
			
			<el-table
				height="600"
				header-cell-class-name="table-th"
				:data="tableList2" border stripe>
				<el-table-column fixed="left" align="center" width="160px" prop="deviceName" label="设备名称"></el-table-column>
				<el-table-column
					:sortable="true"
					v-for="(item, index) in columns" :key="index" align="center" :label="item.dayName"
					:sort-method="(v1, v2) => sortByDate(v1, v2, item)"
					:prop="item.prop">
					<template slot-scope="scope">
						<span>{{scope.row.stats && scope.row.stats.length !==0 && scope.row.stats[item.day] }}</span>
					</template>
				</el-table-column>
			</el-table>
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
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock';
import HeatMap from 'highcharts/modules/heatmap';
import TreeMap from 'highcharts/modules/treemap';
import jurisdiction from "@/mixin/jurisdictionMixin";
import moment from "moment";

HeatMap(Highcharts)
TreeMap(Highcharts)
export default {
  mixins: [jurisdiction],
  data() {
    return {
			month: "",
			selDate:"",
			startDate: "",
			endDate: "",
			num: 10,
			deviceName: '',
			time2: "",
			statType: 3,
			type: 0,
			options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			dataJson1: {},
			isBtnActive: false,
			stationId: "",
			tableList1: [],
			tableList2: [],
			pageNo: 1,
			total: 0,
			columns: [],
    };
  },
  async created() {
		const stime = moment(new Date()).format('YYYY-MM');
		this.time1 = stime;
    const treeData = this.$store.state.getTreeId.treeId;
    if (treeData.id  && treeData.id.includes("s")) {
      this.stationId = treeData.id.slice(1, treeData.id.length);
			if (this.stationId) {
				this.getTableList();
				await this.getStatDataList();
				this.getDeviceStatDataList(this.pageNo);
			}
    }
	},
	watch: {
    async getStateData(v) {
      const treeData = this.$store.state.getTreeId.treeId;
      if (treeData.id && treeData.id.includes("s")) {
        this.stationId = treeData.id.slice(1, treeData.id.length);
        if (this.stationId) {
					this.getTableList();
					await this.getStatDataList();
					this.getDeviceStatDataList(this.pageNo);
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
		clickType(v) {
			this.type = v;
			this.query();
		},
		changeTime(v) {
			if(v){
				this.startDate = v[0];
				this.endDate = v[1];
			}
			this.query();
		},
		clickQuery() {
			this.query();
		},
		async changeStatType() {
			this.getDeviceStatDataList(this.pageNo);
		},
		async query() {
			this.getTableList();
			await this.getStatDataList();
			this.getDeviceStatDataList(this.pageNo);
		},
		// 获取电站发电量及等效小时数
		async getTableList() {
			const params = {
				stationId: this.stationId,
				type: this.type || 0,
				num: this.num,
				deviceName: this.deviceName,
				startDate: this.startDate,
				endDate:this.endDate
			};
			const { data: { code, data: { resultData = [], resultDataNew: { hourData = [], powerData = [], deviceList = [] } = {} } = {} } = {} } = await this.axios("/pvams/data/getDeviceStat", { params });
			if (code === 200) {
				const echartData = { deviceNameData: deviceList, realPowerData: powerData, realHourData: hourData };
				// resultData.forEach(v => {
				// 	echartData.deviceNameData.push(v.deviceName);
				// 	echartData.realPowerData.push(v.realPower);
				// 	echartData.realHourData.push(v.realHour);
				// });
				this.echartMethod(echartData);
			}
		},
		sortByDate(v, t, d) {
			let val1 = v.stats && v.stats.length !==0 && v.stats[d.day].val
			let val2 = t.stats && t.stats.length !==0 && t.stats[d.day].val
      return val1 - val2
		},
		// 获取统计数据
		async getStatDataList() {
      this.loadingOpen();
			const params = {
				statType: this.statType,
				stationId: this.stationId,
				type: this.type || 0,
				startDate: this.startDate,
				endDate:this.endDate
			};
			const { data: { code, data: { resultData = [], dateLen = 0 } = {} } } = await this.axios("/pvams/data/getStatData", { params });
      this.loadingClose();
			if (code === 200) {
				this.columns = [];
				for (let i = 1; i<=Number(dateLen); i++) {
					const obj = {
						dayName: `${i}${this.type == 0 ? '日' : '月'}`,
						day: i-1,
					};
					this.columns.push(obj);
				}
				console.log(this.columns);
				this.tableList1 = resultData;
			}
		},
		// 获取设备发电量和等效小时数详细数据
		async getDeviceStatDataList(pageNo) {
      this.loadingOpen();
			const params = {
				pageNo,
				pageSize: 10,
				stationId: this.stationId,
				statType: this.statType,
				type: this.type || 0,
				startDate: this.startDate,
				endDate:this.endDate
			};
			const { data: { code, data: { resultData = [], page: { count = 0 } = {} } = {} } } = await this.axios("/pvams/data/getDeviceStatDetail", { params });
      this.loadingClose();
			if (code === 200) {
				this.total = count || 0;
				this.tableList2 = resultData;
			}
		},
    handleCurrentChange(val) {
			this.pageNo = val;
      this.getDeviceStatDataList(val);
    },
    /* 上传成功 */
    uploadSuccess(res) {
      if (res.code === 200) {
        this.$message({type: "success", message: "上传成功"});
				this.getTableList()
				this.getStatDataList();
				this.getDeviceStatDataList(this.pageNo);
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
		// echart
		echartMethod(dataItem) {
			// console.log(dataItem);
			this.dataJson1 = {
				chart: {
					zoomType: "xy"
				},
				title: {
					text: "电站发电量及等效小时数"
				},
				xAxis: [
					{
						categories: dataItem.deviceNameData,
						crosshair: true
					}
				],
				yAxis: [
					{
						// Primary yAxis
						labels: {
							format: "{value}Kw·h",
							style: {
								color: "#001529"
							}
						},
						title: {
							text: "发电量",
							style: {
								color: "#001529"
							}
						}
					},
					{
						// Secondary yAxis
						title: {
							text: "等效小时数",
							style: {
								color: "#836FFF"
							}
						},
						labels: {
							format: "{value} h",
							style: {
								color: "#836FFF"
							}
						},
						opposite: true
					}
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
						name: "发电量",
						type: "column",
						color: "001529",
						yAxis: 1,
						data: dataItem.realPowerData,
						tooltip: {
							valueSuffix: " Kw·h",
							cocor: "#68228B"
						}
					},
					{
						name: "等效小时数",
						type: "spline",
						color: "#836FFF",
						data: dataItem.realHourData,
						tooltip: {
							valueSuffix: "h"
						}
					}
				],
				credits: {
					enabled: false, 
				},
				exporting: {
					enabled:false
				}
			};
			Highcharts.chart('datachart1', this.dataJson1)
		},
	},
};
</script>

<style lang="less" scoped>
</style>
<style lang="less">
.data-finance {
	input::-webkit-outer-spin-button,
		input::-webkit-inner-spin-button {
				-webkit-appearance: none;
		}
		input[type="number"]{
				-moz-appearance: textfield;
		}
}
</style>
