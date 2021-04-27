/*
 * @Author: lts
 * @Date: 2021-01-21 19:06:41
 * @LastEditTime: 2021-01-21 19:09:10
 * @FilePath: \active-center-clientc:\Users\天\Desktop\asdzxc.js
 */
var a = {

    grid: {
        left: '3%',
        right: '8%',
        bottom: '10%',
        height: 150,
        containLabel: true
    },
    color: ['#1685ff', '#f22222', '#09cb4e', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'],
    xAxis: {
        type: 'category',
        axisLabel: {
            interval: 0,
            fontSize: 9
        },
        axisTick: {
            alignWithLabel: true
        },
        axisLine: {
            onZero: false,
            lineStyle: {

            }
        },
        data: me.legend
    },
    yAxis: {
        type: 'time',
        splitLine: {
            lineStyle: {
                type: 'dashed',
                color: '#DDD'
            }
        },
        axisLine: {
            show: false,
            lineStyle: {
                color: '#333'
            }
        },
        nameTextStyle: {
            color: '#303133',
            fontSize: 10,
        },
        splitArea: {
            show: false
        },
        min: `${BASE_TIME} 0:00:00`,
        max: `${BASE_TIME} 23:59:59`,
        splitNumber: 5,
        axisLabel: {
            formatter: function (value) {
                return (moment(value).format('YYYY-MM-DD HH:mm')).substr(11, 20)
            }
        }
    },
    series: [
        {
            type: 'scatter',
            symbolSize: '6',
            data: me.offTime,
            markLine: {
                symbol: 'none',
                data: [
                    {
                        name: '下班',
                        yAxis: `${BASE_TIME} 17:30`
                    },
                ],
                label: {
                    formatter: '{b}',
                }
            }
        },
        {
            type: 'scatter',
            symbolSize: '6',
            data: me.onTime,
            markLine: {
                symbol: 'none',
                data: [
                    {
                        name: '上班',
                        yAxis: `${BASE_TIME} 08:30`
                    },
                ],
                label: {
                    formatter: '{b}',
                }
            }
        }
    ]
}