
export const townRanking = (() => {
  const data = [
    [290, 270, 250, 230, 210, 180, 150, 130, 100],
    [270, 250, 230, 210, 190, 160, 140, 120, 100],
    [170, 150, 130, 110, 100, 90, 80, 70, 60],
  ]
  return {
    legend: {
      top: '2%',
      right: '5%',
      textStyle: {
        color: '#fff'
      },
      itemWidth: $fontSize(.23),
      itemHeight: $fontSize(.1),
      icon: 'roundRect'
    },
    grid: {
      left: '3%',
      top: '7%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      show: false,
    },
    yAxis: [{
      inverse: true,
      type: 'category',
      data: ['南口镇', '流村镇', '长陵镇', '兴寿镇', '崔村镇', '阳坊镇', '南邵镇', '百善镇', '沙河镇'],
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#a4a8b4',
        textStyle: {
          color: '#ffffff',
          fontSize: $fontSize(.16)
        },
      }
    }, {
      inverse: true,
      type: 'category',
      splitLine: {
        show: false
      },
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: '#ffffff',
          fontSize: $fontSize(.16)
        },
      },
      data: data[0].map((num, i) => num + data[1][i] + data[2][i])
    }],
    color: [
      'rgba(0,102,133,.8)', 'rgba(100,208,255,.8)', 'rgba(0,159,205,.8)'
    ],
    series: [{
      name: '在建',
      type: 'bar',
      stack: 'Tik Tok',
      barWidth: 10,
      data: [290, 270, 250, 230, 210, 180, 150, 130, 100],
      itemStyle: {
        barBorderRadius: [5, 0, 0, 5]
      },
      animationDelay: function (idx) {
        return idx * 100;
      }
    },
    {
      name: '已建',
      type: 'bar',
      stack: 'Tik Tok',
      barWidth: 10,
      data: [270, 250, 230, 210, 190, 160, 140, 120, 100],
      animationDelay: function (idx) {
        return idx * 100;
      }
    },
    {
      name: '汇聚',
      type: 'bar',
      stack: 'Tik Tok',
      barWidth: 10,
      data: [170, 150, 130, 110, 100, 90, 80, 70, 60],
      animationDelay: function (idx) {
        return idx * 100;
      },
      itemStyle: {
        barBorderRadius: [0, 5, 5, 0]
      }
    },
    ],
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5;
    }
  };
})()