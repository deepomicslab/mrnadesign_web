<template>
    <div class="outer-container mt-10 mb-10">
        <!-- <svg id="Viz_area" :height="Height" :width="Width"></svg> -->
        <div
            v-for="(dom, index) in echartDomList"
            :key="index"
            :ref="el => (dom.value = el as HTMLElement)"
            :class="index === echartDomList.length - 1 ? 'h-24' : 'h-12'"
            :id="'chart-' + index"
        />
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import * as echarts from 'echarts'

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

const hours = ['12a', '1a', '2a', '3a', '4a']

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
    const grid_height = idx === N - 1 ? '50%' : '100%'
    return {
        tooltip: {
            position: 'top',
        },
        grid: {
            // height: '50%',
            // 最后一行 占50%， 为了流出位置给 x axis label；dom 好嘟也必为其他行 dom 的两倍
            height: grid_height,
            top: '0%',
            left: '20%',
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLabel: {
                show: true, // Ensure this is set to true
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
            },
        ],
        label: {
            show: true,
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
    ['#D9D9D9', '#7F7F7F'], // Light Gray, Deep Gray
    ['#D2D300', '#BCBD22'], // Light Olive, Deep Olive
    ['#A1DBE0', '#17BECF'], // Light Cyan, Deep Cyan
]

const echartDomList = ref(Array.from({ length: N }, () => ref<HTMLElement | null>(null)))
onMounted(async () => {
    await nextTick() // Wait for the DOM to be updated
    const myEchartList = echartDomList.value.map(dom => {
        return dom.value ? echarts.init(dom.value as HTMLElement) : null
    })
    myEchartList.forEach((chart, idx) => {
        if (chart) {
            chart.setOption(getEchartOptions(idx, colormap[idx % 10]))
        }
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
