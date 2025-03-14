<template>
    <div id="my_dataviz"></div>
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import * as d3 from 'd3'
import axios from 'axios'

// 定义图表的边距和尺寸
const margin = { top: 10, right: 30, bottom: 30, left: 40 }
const width = 460 - margin.left - margin.right
const height = 400 - margin.top - margin.bottom
const expressionUrl = ref(`/isoform/expression/gene_expression_csv/`)

// 定义数据类型
interface BackendData {
    gene_id: string
    skin_part1: Record<string, number>
    skin_part2: Record<string, number>
}

const backendData = ref({} as BackendData)

interface ViolinData {
    skinPart: string
    values: number[]
}

// 计算统计量函数
function calculateBoxPlotStats(data: number[]) {
    const sorted = [...data].sort((a, b) => a - b)
    const min = d3.min(sorted) || 0
    const max = d3.max(sorted) || 0
    const q1 = d3.quantile(sorted, 0.25) || 0
    const median = d3.quantile(sorted, 0.5) || 0
    const q3 = d3.quantile(sorted, 0.75) || 0
    return { min, q1, median, q3, max }
}

// 在组件挂载时创建图表
onMounted(async () => {
    // 创建 SVG 容器
    const svg = d3
        .select('#my_dataviz')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`)

    try {
        // 从 Django 后台获取数据
        const response = await axios.get<BackendData>(expressionUrl.value, {
            baseURL: '/api',
            timeout: 100000,
        })
        const { data } = response
        backendData.value = data

        // 将数据转换为小提琴图需要的格式
        const violinData: ViolinData[] = [
            {
                skinPart: 'skin_part1',
                values: Object.values(backendData.value.skin_part1),
            },
            {
                skinPart: 'skin_part2',
                values: Object.values(backendData.value.skin_part2),
            },
        ]

        // 创建 Y 轴比例尺
        const y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(violinData.flatMap(d => d.values)) || 0, // 动态计算最大值
            ])
            .range([height, 0])
        svg.append('g').call(d3.axisLeft(y))

        // 创建 X 轴比例尺
        const x = d3
            .scaleBand()
            .range([0, width])
            .domain(violinData.map(d => d.skinPart)) // 使用 skin_part1 和 skin_part2 作为 domain
            .padding(0.1)
        svg.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))

        // 定义直方图的特性
        const histogram = d3
            .histogram()
            .domain(y.domain() as [number, number]) // 设置直方图的范围
            .thresholds(y.ticks(20)) // 设置分箱数量
            .value(d => d)

        // 计算每组数据的直方图
        const sumstat = violinData.map(d => {
            const bins = histogram(d.values)
            return { skin_part: d.skinPart, bins }
        })

        // 找到某个分箱中最大的值（用于确定小提琴图宽度）
        let maxNum = 0
        sumstat.forEach(({ bins }) => {
            const lengths = bins.map(a => a.length)
            const longest = d3.max(lengths)
            if (longest && longest > maxNum) maxNum = longest
        })

        // 定义小提琴图的宽度比例尺
        const xNum = d3.scaleLinear().range([0, x.bandwidth()!]).domain([-maxNum, maxNum])

        // 为每个分组添加小提琴图
        svg.selectAll('myViolin')
            .data(sumstat)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${x(d.skin_part)!},0)`) // 按组平移
            .append('path')
            .datum(d => d.bins) // 处理每组的分箱数据
            .style('stroke', 'none')
            .style('fill', '#69b3a2')
            .attr(
                'd',
                d3
                    .area()
                    .x0(d => xNum(-d.length)) // 左边界
                    .x1(d => xNum(d.length)) // 右边界
                    .y(d => y(d.x0 as number)) // Y 轴位置
                    .curve(d3.curveCatmullRom) // 平滑曲线
            )

        // 计算每组的箱线图统计量
        const boxPlotStats = violinData.map(d => ({
            skinPart: d.skinPart,
            stats: calculateBoxPlotStats(d.values),
        }))

        // 在小提琴图上添加箱线图
        svg.selectAll('myBoxPlot')
            .data(boxPlotStats)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${x(d.skinPart)! + x.bandwidth()! / 2},0)`)
            .each(function (d) {
                const { stats } = d
                const g = d3.select(this)

                // 垂直线（从 min 到 max）
                g.append('line')
                    .attr('x1', 0)
                    .attr('x2', 0)
                    .attr('y1', y(stats.min))
                    .attr('y2', y(stats.max))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 0.5)

                // 矩形（从 Q1 到 Q3）
                g.append('rect')
                    .attr('x', -x.bandwidth()! / 16)
                    .attr('y', y(stats.q3))
                    .attr('width', x.bandwidth()! / 8)
                    .attr('height', y(stats.q1) - y(stats.q3))
                    .attr('stroke', 'black')
                    .attr('fill', 'white')

                // 中位数线
                g.append('line')
                    .attr('x1', -x.bandwidth()! / 16)
                    .attr('x2', x.bandwidth()! / 16)
                    .attr('y1', y(stats.median))
                    .attr('y2', y(stats.median))
                    .attr('stroke', 'black')
                    .attr('stroke-width', 1.5)
            })
    } catch (error) {
        console.error('Error fetching data:', error)
    }
})
</script>

<style scoped>
#my_dataviz {
    margin: 20px auto;
    max-width: 500px;
}
</style>
