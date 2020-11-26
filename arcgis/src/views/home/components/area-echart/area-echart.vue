<template>
  <echart-template ref="echart" :options="options" width="100%" height="100%" @click="handleClick"></echart-template>
</template>

<script>
export default {
  name: 'areaEchart',
  data() {
    return {
      options: {}
    }
  },
  methods: {
    handleClick(params) {
      if (params.componentSubType === 'map') {
        let area = '昌平区'
        if (this.area !== params.name) {
          area = params.name
        } else {
        }
        this.setArea(area)
        localStorage.setItem('area', area)
      }
    },
    // 地图初始化
    initEchart(isInit) {
      this.$echarts.registerMap('changping', require('@/assets/json/昌平区各镇街边界.json'))
      this.options = this.getBaseOptions()
      if (this.area != '昌平区') {
        this.$nextTick(() => {
          this.$refs.echart.myChart.dispatchAction({
            type: 'geoSelect',
            name: this.area
          })
        })
      }
    },
    // 获取地图基本配置
    getBaseOptions() {
      let options = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
          formatter: params => {
            if (params.seriesType == 'scatter') return `${params.seriesName}：${params.data.value}`
          }
        },
        // 此图例组件不可删除，通过触发action控制图层
        legend: {
          show: false,
          orient: 'vertical',
          id: 1,
          right: '25%',
          bottom: '2%',
          itemWidth: 15,
          textStyle: {
            color: '#fff'
          }
        },
        geo: {
          map: 'changping',
          selectedMode: 'single',
          label: {
            show: true,
            textStyle: {
              color: '#fff',
              fontSize: this.fontSize(0.12)
            }
          },
          zoom: 1.075,
          showLegendSymbol: false, // 存在legend时显示
          z: 2,
          emphasis: {
            label: {
              show: false,
              color: '#fff',
              textStyle: {
                // fontWeight: 'bold',
                fontSize: this.fontSize(0.14)
              }
            },
            itemStyle: {
              areaColor: 'rgba(26, 255, 236, 0.3)'
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#4dcfff', // 边框
              borderWidth: 1,
              color: 'transparent',
              areaColor: {
                type: 'radial',
                x: 0.5,
                y: 0.5,
                r: 0.8,
                colorStops: [
                  {
                    offset: 0,
                    color: 'rgba(23, 118, 178, 0.3)', // 0% 处的颜色
                    color: 'rgba(0, 42, 69, 0.6)' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: 'rgba(124, 238, 255, 0.4)', // 100% 处的颜色
                    color: 'rgba(0, 136, 187, 0.5)' // 100% 处的颜色
                  }
                ],
                globalCoord: true // 缺省为 false
              }
            }
          }
        },
        series: [
          {
            name: 'map',
            type: 'map',
            label: {
              show: false
            },
            geoIndex: 0,
            showLegendSymbol: false, // 存在legend时显示
            roam: false
          }
        ]
      }
      return options
    }
  },
  mounted() {
    this.initEchart(true)
  }
}
</script>

<style lang="less" scoped>
.echart-template {
  transform: translateX(-0.5rem);
}
</style>
