export default [
  {
    background: '#000',
    name: '头部',
    componentName: 'HeaderV1',
    componentOption: {
      color: '#fff',
      size: 50,
      title: '汕头市应急管理综合应用平台'
    },
    utilOption: {
      color: 'input',
      size: {
        type: 'number',
        min: 20,
        max: 80
      }
    },
    editOption: {
      w: '100%',
      h: 77,
      y: 0,
      x: 0
    }
  }, {
    width: '100%',
    height: 200,
    background: '#000',
    name: '应急维稳保障',
    componentName: 'echart-template',
    componentOption: {
      options: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '17%',
          right: '3%',
          left: '8%',
          bottom: '10%'
        },
        xAxis: [
          {
            type: 'category',
            data: ['全市', '濠江区', '潮阳区', '潮南区', '澄海区', '龙湖区', '金平区', '南澳县'],
            axisLine: {
              show: true,
              lineStyle: {
                color: '#027DB3',
                width: 2,
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              margin: 10,
              color: '#e2e9ff',
              textStyle: {
                fontSize: 12
              }
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: '{value}',
              color: '#e2e9ff',
              textStyle: {
                fontSize: 14
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#027DB3',
                width: 2,
              }
            },
            splitLine: {
              lineStyle: {
                color: '#027DB3',
                type: 'dashed'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: [170, 220, 180, 210, 169, 230, 170, 210],
            barWidth: '15px',
            itemStyle: {
              normal: {
                color: function (params) {
                  let colorList = ['#0ED6F4', '#FFB56C', '#02A1FD', '#5AE7AE', '#0ED6F4', '#FFB56C', '#02A1FD', '#5AE7AE']
                  return colorList[params.dataIndex]
                },
                barBorderRadius: [30, 30, 0, 0],
                // shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                position: 'outside'
              }
            }
          }
        ]
      }
    },
    utilOption: {
      color: 'input',
      size: {
        type: 'number',
        min: 20,
        max: 80
      }
    },
    editOption: {
      w: 520,
      h: 250,
      y: 77,
      x: 0
    }
  }, {
    background: '#000',
    name: '3d云标签',
    componentName: 'threed-tags',
    componentOption: {
      color: '#fff',
      list: [
        '新冠病毒',
        '社会环境',
        '地摊',
        '谨防诈骗',
        '大前端',
        'JavaScript',
        'CSS',
        'HTML',
        'Vue',
        'less',
        'webpack'
      ]
    },
    utilOption: {
      color: 'input',
      size: {
        type: 'number',
        min: 20,
        max: 80
      }
    },
    editOption: {
      w: 400,
      h: 400,
      y: 0,
      x: 520
    }
  }
]