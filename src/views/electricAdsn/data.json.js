// 柱状图默认数据格式
const columnar = {
  title: { text: "" },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    }
  },
  legend: {
    // bottom: 1,
    // data: []
  },
  dataset: {
    dimensions: [],
    source: []
  },
  xAxis: { type: "category" },
  yAxis: {},
  // { type: "bar" }
  series: []
};
// 深拷贝数据
const deepData = () => { };
// 发电量表格数据
export { columnar };
