<template>
  <div class="echarts" :id="id"></div>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsDrilldown from 'highcharts/modules/drilldown'
import Highcharts3D from 'highcharts/highcharts-3d'
import HeatMap from 'highcharts/modules/heatmap'
import Exporting from 'highcharts/modules/exporting'
import TreeMap from 'highcharts/modules/treemap'
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts)
Highcharts3D(Highcharts)
HeatMap(Highcharts)
Exporting(Highcharts)
TreeMap(Highcharts)
export default {
  props: {
    id: {
      default: "",
      type: String,
    },
    option: {
      default: {},
      type: Object,
    },
  },
  name: "charts",
  mounted() {
    Highcharts.chart(this.id, this.option)
  },
}
</script>

<style>

</style>
