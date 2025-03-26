<template>
    <div class="w-270 h-180" ref="echartDom"></div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import { ref, onBeforeMount } from 'vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { CodonpairDictReversed } from '@/utils/type'

const props = defineProps<{
    calculation_type: string
    tissue: keyof typeof CodonpairDictReversed
}>()
const { calculation_type, tissue } = toRefs(props)

const echartDom = ref<HTMLElement | null>(null)

const xData = ref([])
const yData = ref([])
const Maindata = ref([])

const heatmapOption = {
    tooltip: {
        formatter(params: { value: any }) {
            const { value } = params
            return `${yData.value[value[1]]} - ${xData.value[value[0]]}<br>value: ${value[2]}`
        },
    },
    grid: {
        top: '0%',
        bottom: '10%',
    },
    xAxis: {
        type: 'category',
        data: xData.value,
        splitArea: {
            show: true,
        },
        axisLabel: {
            interval: 0,
            rotate: 45,
        },
    },
    yAxis: {
        type: 'category',
        data: yData.value,
        splitArea: {
            show: true,
        },
        axisLabel: {
            interval: 0,
            rotate: 0,
        },
    },
    visualMap: {
        min: 0,
        max: 1,
        calculable: true,
        realtime: false,
        inRange: {
            color: [
                '#313695',
                '#4575b4',
                '#74add1',
                '#abd9e9',
                '#e0f3f8',
                '#ffffbf',
                '#fee090',
                '#fdae61',
                '#f46d43',
                '#d73027',
                '#a50026',
            ],
        },
        right: '0%',
        top: '10%',
        formatter(value: number) {
            return value.toFixed(4)
        },
    },
    series: [
        {
            name: calculation_type.value,
            type: 'heatmap',
            data: Maindata.value,
            emphasis: {
                itemStyle: {
                    borderColor: '#333',
                    borderWidth: 1,
                },
            },
            progressive: 1000,
            animation: false,
        },
    ],
}

const main_get_response = async () => {
    const response = await axios.get(`/codon_pair/heatmap/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            calculation_type: calculation_type.value,
            tissue: CodonpairDictReversed[tissue.value],
        },
    })

    Maindata.value = response.data.mat
    yData.value = response.data.codons
    xData.value = response.data.codons

    heatmapOption.xAxis.data = xData.value
    heatmapOption.yAxis.data = yData.value
    heatmapOption.series[0].data = Maindata.value
    heatmapOption.visualMap.max = Math.max(...Maindata.value.map(item => item[2]))

    const myechart = echarts.init(echartDom.value as HTMLElement)
    myechart.clear()
    myechart.setOption(heatmapOption)
}

watch(tissue, () => {
    main_get_response()
})

onBeforeMount(async () => {
    await main_get_response()
})
</script>
