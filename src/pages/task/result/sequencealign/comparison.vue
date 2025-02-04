<template>
    <el-scrollbar style="border-color: #1a202c">
        <svg id="Viz_area" :height="height" :width="width" ref></svg>
    </el-scrollbar>
</template>
<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import * as d3 from 'd3'
import _ from 'lodash'
import { watch, ref, computed, defineProps } from 'vue'
import { coverageDict, identityDict } from '@/utils/annotation'

// 调用defineProps方法并获取父组件传递的数据

const width = ref(1280)
const height = ref(700)
const marginLeft = ref(60)
const lineHeight = ref(180)

// for draw arrow
const barareaMarginLeft = ref(70)
const barareaMarginRight = ref(70)
const triangleOffset = ref(15)
const arrowWeight = ref(7)
const barHeight = ref(30)

const props = defineProps(['alignmentData'])
const data = computed(() => {
    return props.alignmentData
})

function complink(ss, se, ts, te, y) {
    return `M ${ss} ${y} H ${se}  L ${te}  ${y + 123} H ${ts} Z`
}
function forwordtriangle(start, end, y) {
    if (end - start > triangleOffset.value) {
        return `M ${end} ${y + barHeight.value / 2} L ${end - triangleOffset.value} ${y} V ${y + arrowWeight.value
            }  H ${start} V ${y + barHeight.value - arrowWeight.value} H  ${end - triangleOffset.value
            } V ${y + barHeight.value} Z`
    }
    return `M ${end} ${y + barHeight.value / 2} L ${start} ${y}  V ${y + barHeight.value}  Z`
}
function backtriangle(start, end, y) {
    if (end - start > triangleOffset.value) {
        return `M ${end} ${y + arrowWeight.value} H ${start + triangleOffset.value
            } V ${y} L ${start} ${y + barHeight.value / 2}  L ${start + triangleOffset.value} ${y + barHeight.value
            } V  ${y + barHeight.value - arrowWeight.value}   H ${end} Z`
    }
    return `M ${end} ${y} V ${y + barHeight.value}  L ${start}  ${y + barHeight.value / 2}  Z`
}

const matching_idx = ref(-1)
watch(
    data,
    () => {
        d3.select('#Viz_area').selectAll('*').remove()
        // height.value = 200 * data.value.length
        height.value = 400
        const maxEnd = ref(
            Number(
                _.maxBy(data.value, o => {
                    return Number(o.Hsp_hit_to)
                })?.Hsp_hit_to
            )
        )

        if (maxEnd.value > 10000) {
            width.value = maxEnd.value / 20
        }

        const svg = d3.select('#Viz_area').attr('transform', `translate(${marginLeft.value}, 0)`)
        // 主体部分
        const bararea = svg
            .append('svg')
            .attr('height', height.value)
            .attr('width', width.value - (barareaMarginLeft.value + barareaMarginRight.value))
            .attr('x', barareaMarginLeft.value)
            .attr('y', 120)
        // 上方Coverage Identity

        // svg.selectAll('identitylegend')
        //     .data(_.values(identityDict))
        //     .enter()
        //     .append('rect')
        //     .attr('x', 945)
        //     .attr('y', function (d, k) {
        //         return k * 16 + 38
        //     })
        //     .attr('width', 50)
        //     .attr('height', 16)
        //     .style('fill', function (d) {
        //         return d.color
        //     })
        //     .attr('stroke', '#969696')
        //     .attr('stroke-width', '1px')

        // svg.selectAll('legendTxt')
        //     .data(_.values(identityDict))
        //     .enter()
        //     .append('text')
        //     .attr('x', 1000)
        //     .attr('y', function (d, k) {
        //         return k * 16 + 51
        //     })
        //     .text(function (d) {
        //         return d.text
        //     })
        //     .style('fill', '#969696')

        // svg.append('text')
        //     .attr('x', 945)
        //     .attr('y', 30)
        //     .text('Identity')
        //     .style('fill', '#424242')
        //     .style('font-weight', 600)

        const areaW = 220
        const areaH = 330

        const toolArea = svg
            .append('svg')
            .attr('width', areaW)
            .attr('height', areaH)
            .style('opacity', 0)

        toolArea
            .append('rect')
            .attr('x', 0)
            .attr('width', areaW)
            .attr('height', areaH)
            .style('fill', 'black')
            .style('opacity', 0.6)

        const mouseenter = function (md, mv) {
            d3.selectAll(".arrow_query")
                .style('opacity', 0.2)
            d3.selectAll(".arrow_query")
                .filter((d, i) => {
                    console.log("d, i", d, i)
                    return i === mv.matching_idx
                })
                .style('opacity', 1)

            console.log("md, mv: ", md, mv)
            svg.selectAll('.compline').style('opacity', 0.2)
            d3.select(this).style('opacity', 1)

            const toolTextPositions = []
            const textCount = 15
            const posGap = 21
            for (let i = 0; i < textCount; i += 1) {
                toolTextPositions.push((i + 1) * posGap)
            }
            const toolX = md.layerX + 10
            const toolY = md.layerY - 250
            toolArea.style('opacity', 1).attr('x', toolX).attr('y', toolY)

            const textContent = [
                // `Sequence: ${mv.sequence}`,
                `e_Value: ${mv.e_value}`,
                `Hsp_score: ${mv.Hsp_score}`,
                `align_Len: ${mv.align_len}`,
                `Identity: ${mv.identity}`,
                `Gaps: ${mv.gaps}`,
                '',
                `Start Position of Subject: ${mv.Hsp_query_from}`,
                `End Position of Subject: ${mv.Hsp_query_to}`,
                `Start Position of Object: ${mv.Hsp_hit_from}`,
                `End Position of Object: ${mv.Hsp_hit_to}`,
                '',
                `Query: ${mv.Query}`,
                `Match: ${mv.Match}`,
                `Hit: ${mv.Hit}`,
            ]
            toolArea
                .selectAll('text')
                .data(toolTextPositions)
                .join('text')
                .style('fill', 'white')
                .attr('transform', e => `translate(10,${e})`)
                .text((e, i) => {
                    return textContent[i]
                })
                .style('font-size', 12)
        }
        const mouseleave = function () {
            svg.selectAll('.compline').style('opacity', 0.7)
            toolArea.style('opacity', 0).attr('x', 0).attr('y', 0)
        }

        let index = 0
        const end_query = Number(
            _.maxBy(data.value, o => {
                return Number(o.Hsp_query_to)
            })?.Hsp_query_to
        )
        const end = Number(
            _.maxBy(data.value, o => {
                return Number(o.Hsp_hit_to)
            })?.Hsp_hit_to
        )

        // Control the reasonable width of the Graph
        const fold = Number(1000 / end)
        const groupData = _.groupBy(data.value, 'sequence')
        for (const item in groupData) {

            // query & hit empty seq rect
            bararea
                .append('rect')
                .attr('x', 0)
                .attr('y', 0 * lineHeight.value + 90)
                .attr('width', end_query * fold)
                .attr('height', 10)
                .style('fill', 'None')
                .attr('stroke', '#424242')
                .attr('stroke-width', '1px')
            bararea
                .append('rect')
                .attr('x', 0)
                .attr('y', (0 + 1) * lineHeight.value + 45)
                .attr('width', end * fold)
                .attr('height', 10)
                .style('fill', 'None')
                .attr('stroke', '#424242')
                .attr('stroke-width', '1px')

            // query & hit matching seq rect
            bararea
                .selectAll('compbar_query')
                .data(_.values(groupData[item]))
                .enter()
                .append('rect')
                .attr('x', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])(Number(i.Hsp_query_from) * fold)
                })
                // .attr('y', index * lineHeight.value + 90)
                .attr('y', 0 * lineHeight.value + 90)
                .attr('width', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])(Number(i.Hsp_query_to - i.Hsp_query_from) * fold)
                })
                .attr('height', 10)
                .style('fill', coverageDict[4].color)
                .attr('stroke', '#343434')
                .attr('stroke-width', '1px')
            bararea
                .selectAll('compbar_hit')
                .data(_.values(groupData[item]))
                .enter()
                .append('rect')
                .attr('x', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])(Number(i.Hsp_hit_from) * fold)
                })
                .attr('y', (0 + 1) * lineHeight.value + 45)
                .attr('width', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])(Number(i.Hsp_hit_to - i.Hsp_hit_from) * fold)
                })
                .attr('height', 10)
                .style('fill', function (i) {
                    console.log(i)
                    return coverageDict[4].color
                })
                .attr('stroke', '#343434')
                .attr('stroke-width', '1px')

            // query & hit arrows
            bararea
                .selectAll('arrow_query')
                .data(_.orderBy(_.values(groupData[item], 'identity', 'asc')))
                .enter()
                .append('path')
                .attr('class', 'arrow_query')
                .attr('d', function (i) {
                    const sacleTX = d3
                        .scaleLinear()
                        .domain([0, end_query * fold])
                        .range([0, end_query * fold])
                    const tstart = sacleTX(i.Hsp_query_from * fold)
                    const tend = sacleTX(i.Hsp_query_to * fold)
                    return i.Hsp_query_from <= i.Hsp_query_to
                        ? forwordtriangle(tstart, tend, 0 * lineHeight.value + 20)
                        : backtriangle(tstart, tend, index * lineHeight.value + 20)
                })
                .attr('fill', function (i) {
                    return '#68534d'
                })
                .style('opacity', '0.7')
                .attr('stroke', '#5b5b5b')
                .attr('stroke-width', '1px')
            bararea
                .selectAll('arrow_hit')
                .data(_.orderBy(_.values(groupData[item], 'identity', 'asc')))
                .enter()
                .append('path')
                .attr('class', 'arrow_hit')
                .attr('d', function (i) {
                    const sacleTX = d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])
                    const tstart = sacleTX(i.Hsp_hit_from * fold)
                    const tend = sacleTX(i.Hsp_hit_to * fold)
                    return i.Hsp_hit_from <= i.Hsp_hit_to
                        ? forwordtriangle(tstart, tend, 0 * lineHeight.value + 250)
                        : backtriangle(tstart, tend, index * lineHeight.value + 250)
                })
                .attr('fill', function (i) {
                    return '#68534d'
                })
                .style('opacity', '0.7')
                .attr('stroke', '#5b5b5b')
                .attr('stroke-width', '1px')

            // matchings
            bararea
                .selectAll('compline')
                .data(_.orderBy(_.values(groupData[item], 'identity', 'asc')))
                .enter()
                .append('path')
                .attr('class', 'compline')
                .attr('d', function (i) {
                    const sacleSX = d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])
                    const sacleTX = d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([0, end * fold])
                    const sstart = sacleSX(i.Hsp_query_from * fold)
                    const send = sacleSX(i.Hsp_query_to * fold)
                    const tstart = sacleTX(i.Hsp_hit_from * fold)
                    const tend = sacleTX(i.Hsp_hit_to * fold)
                    return complink(sstart, send, tstart, tend, 0 * lineHeight.value + 101)
                })
                .style('fill', function (i) {
                    if ((i.identity / i.align_len) * 100 < 100) {
                        return (i.identity / i.align_len) * 100 < 50
                            ? identityDict[4].color
                            : // eslint-disable-next-line no-bitwise
                            identityDict[(((i.identity / i.align_len) * 100) / 10) | 0].color
                    }
                    return identityDict[9].color
                })
                .attr('stroke', '#db095b')
                .attr('stroke-width', '1px')
                .style('opacity', '0.7')
                .on('mouseenter', mouseenter)
                .on('mouseleave', mouseleave)

            index += 1
        }
    },
    { deep: true, immediate: true }
)
</script>
