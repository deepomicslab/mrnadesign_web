<template>
    <div class="outer-container mt-10 mb-10">
        <div class="h-15" ref="echartHeaderDom" id="chart-header"></div>
        <div
            v-for="(dom, index) in echartDomList"
            :key="index"
            :ref="el => (dom.value = el as HTMLElement)"
            class="h-10"
            :id="'chart-' + index"
        />
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import * as echarts from 'echarts'
// import { ArrowUp } from '@vicons/ionicons5'
// import { NButton, NEllipsis } from 'naive-ui'

const ROOT_PATH = 'https://echarts.apache.org/examples'
const weatherIcons = {
    Sunny: `${ROOT_PATH}/data/asset/img/arrow-up.png`,
    Cloudy: `${ROOT_PATH}/data/asset/img/weather/cloudy_128.png`,
    Showers: `${ROOT_PATH}/data/asset/img/weather/showers_128.png`,
}
const demodata = [
    [0.1, 0.2, 0.3, 0.4, 0.5],
    [0.9, 0.7, 0.5, 0.3, 0.1],
    [0.1, 0.9, 0.5, 0.3, 0.9],
    [0.4, 0.3, 0.2, 0.9, 0.3],
    [0.2, 0.7, 0.1, 0.9, 0.5],
    [0.2, 0.4, 0.1, 0.5, 0.2],
    [0.3, 0.5, 0.8, 0.9, 0.8],
    [0.5, 0.1, 0.8, 0.4, 0.7],
    [0.4, 0.3, 0.4, 0.8, 0.1],
    [0.3, 0.7, 0.5, 0.3, 0.9],
]

const days = [
    'Translation Score',
    'Half-Life',
    'Protein Score',
    'RNA  Secondary Structure Metrics',
    'Autoimmune Score',
    'Motif Risk',
    'MHC Affinity',
    'T-Cell Score',
    'B-Cell Score',
    'Enzyme Sites',
]

const hours = ['col1', 'col2', 'col3', 'col4', 'col5']

const data: any[] = []
for (let i = 0; i < demodata.length; i += 1) {
    const tmp_arr = []
    for (let j = 0; j < demodata[0].length; j += 1) {
        tmp_arr.push([j, 0, demodata[i][j]])
    }
    data.push(tmp_arr)
}

const N = demodata.length
// const N = 1

const getEchartOptions = (idx: number, cm: string[]) => {
    return {
        tooltip: {
            position: 'top',
        },
        grid: {
            // height: '50%',
            height: '100%',
            top: '0%',
            left: '20%',
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLabel: {
                show: true,
                fontSize: 20,
            },
        },
        yAxis: {
            type: 'category',
            data: [days[idx]],
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1,
            calculable: true,
            orient: 'vertical',
            left: 'right',
            bottom: '50%',
            inRange: {
                color: cm,
            },
        },
        series: [
            {
                name: 'score',
                type: 'heatmap',
                data: data[idx],
                label: {
                    show: true,
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
        label: {
            show: true,
        },
    }
}
const getEchartHeaderOption = () => {
    const this_data: { value: number[]; label: { formatter: string } }[] = []
    hours.forEach((element, index) => {
        this_data.push({
            value: [index, 0],
            label: {
                formatter: [`{fragment1|${element}} {sunny} {cloudy}`].join('\n'),
            },
        })
    })
    return {
        grid: {
            height: '100%',
            top: '0%',
            left: '20%',
        },
        series: [
            {
                type: 'scatter',
                data: this_data,
                symbolSize: 1,
                label: {
                    show: true,
                    borderColor: '#555',
                    borderWidth: 1,
                    color: '#000',
                    fontSize: 14,
                    rich: {
                        sunny: {
                            height: 30,
                            align: 'left',
                            backgroundColor: {
                                image: weatherIcons.Sunny,
                            },
                            margin: [10, 10, 10, 10],
                        },
                        cloudy: {
                            height: 30,
                            align: 'left',
                            backgroundColor: {
                                image: weatherIcons.Cloudy,
                            },
                            margin: [10, 10, 10, 10],
                        },
                        fragment1: {
                            // backgroundColor: '#000',
                            fontSize: 20,
                            color: 'black',
                            padding: [20, 20, 20, 20],
                            onclick() {
                                alert('Sunny weather clicked!')
                            },
                        },
                        clickable: true, // You can add a custom flag to identify which rich text is clickable
                    },
                },
            },
        ],
        xAxis: {
            type: 'category',
            data: hours,
            show: false,
        },
        yAxis: {
            type: 'category',
            show: false,
        },
    }
}

const colormap = [
    ['#A0CBE1', '#1F77B4'], // Light Blue, Deep Blue
    ['#FFB74D', '#FF7F0E'], // Light Orange, Deep Orange
    ['#B2E2B2', '#2CA02C'], // Light Green, Deep Green
    ['#FF9999', '#D62728'], // Light Red, Deep Red
    ['#C2A7DB', '#9467BD'], // Light Purple, Deep Purple
    ['#D9BBAA', '#8C564B'], // Light Brown, Deep Brown
    ['#F1B2D9', '#E377C2'], // Light Pink, Deep Pink
    ['#D2D300', '#BCBD22'], // Light Olive, Deep Olive
    ['#A1DBE0', '#17BECF'], // Light Cyan, Deep Cyan
]

const echartDomList = ref(Array.from({ length: N }, () => ref<HTMLElement | null>(null)))
const echartHeaderDom = ref<HTMLElement | null>(null)
onMounted(async () => {
    await nextTick() // Wait for the DOM to be updated
    const myEchartList = echartDomList.value.map(dom => {
        return dom.value ? echarts.init(dom.value as HTMLElement) : null
    })
    myEchartList.forEach((chart, idx) => {
        if (chart) {
            chart.setOption(getEchartOptions(idx, colormap[idx % colormap.length]))
        }
    })

    const myEchartHeader = echarts.init(echartHeaderDom.value as HTMLElement)
    myEchartHeader.setOption(getEchartHeaderOption())
    myEchartHeader.on('click', function (params) {
        console.log('------------------------', params)
    })
})
</script>

<style lang="scss" scoped>
.outer-container {
    display: flex;
    flex-direction: column;
    /* Stack children vertically */
    padding: 20px;
    /* Optional padding */
    background-color: #f9f9f9;
    /* Optional background color */
    border-radius: 8px;
    /* Optional rounded corners */
}
</style>
