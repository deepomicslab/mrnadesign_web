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

const props = defineProps(['alignmentData'])
const data = computed(() => {
    return props.alignmentData
})

function complink(ss, se, ts, te, y) {
    return `M ${ss} ${y} H ${se}  L ${te}  ${y + 123} H ${ts} Z`
}

watch(
    data,
    () => {
        d3.select('#Viz_area').selectAll('*').remove()
        height.value = 200 * data.value.length
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

        svg.selectAll('identitylegend')
            .data(_.values(identityDict))
            .enter()
            .append('rect')
            .attr('x', 945)
            .attr('y', function (d, k) {
                return k * 16 + 38
            })
            .attr('width', 50)
            .attr('height', 16)
            .style('fill', function (d) {
                return d.color
            })
            .attr('stroke', '#969696')
            .attr('stroke-width', '1px')

        svg.selectAll('legendTxt')
            .data(_.values(identityDict))
            .enter()
            .append('text')
            .attr('x', 1000)
            .attr('y', function (d, k) {
                return k * 16 + 51
            })
            .text(function (d) {
                return d.text
            })
            .style('fill', '#969696')

        svg.append('text')
            .attr('x', 945)
            .attr('y', 30)
            .text('Identity')
            .style('fill', '#424242')
            .style('font-weight', 600)

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
            svg.selectAll('.compline').style('opacity', 0.2)
            d3.select(this).style('opacity', 1)

            const toolTextPositions = []
            const textCount = 15
            const posGap = 21
            for (let i = 0; i < textCount; i += 1) {
                toolTextPositions.push((i + 1) * posGap)
            }
            const toolX = md.layerX + 10
            const toolY = md.layerY + 10
            toolArea.style('opacity', 1).attr('x', toolX).attr('y', toolY)

            const textContent = [
                `Sequence: ${mv.sequence}`,
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
        const end = Number(
            _.maxBy(data.value, o => {
                return Number(o.Hsp_hit_to)
            })?.Hsp_hit_to
        )

        // Control the reasonable width of the Graph
        const fold = Number(1000 / end)
        const groupData = _.groupBy(data.value, 'sequence')
        for (const item in groupData) {
            bararea
                .selectAll('geneline')
                .data(_.values(groupData[item]))
                .enter()
                .append('rect')
                .attr('x', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([
                            0,
                            end * fold,
                        ])(Number(i.Hsp_query_from) * fold)
                })
                .attr('y', index * lineHeight.value + 90)
                .attr('width', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([
                            0,
                            end * fold,
                        ])(Number(i.Hsp_query_to - i.Hsp_query_from) * fold)
                })
                .attr('height', 10)
                .style('fill', coverageDict[4].color)
                .attr('stroke', '#343434')
                .attr('stroke-width', '1px')

            bararea
                .append('rect')
                .attr('x', 0)
                .attr('y', (index + 1) * lineHeight.value + 45)
                .attr(
                    'width',
                    end * fold
                )
                .attr('height', 10)
                .style('fill', 'None')
                .attr('stroke', '#424242')
                .attr('stroke-width', '1px')

            bararea
                .selectAll('compbar')
                .data(_.values(groupData[item]))
                .enter()
                .append('rect')
                .attr('x', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([
                            0,
                            end * fold,
                        ])(Number(i.Hsp_hit_from) * fold)
                })
                .attr('y', (index + 1) * lineHeight.value + 45)
                .attr('width', function (i) {
                    return d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([
                            0,
                            end * fold,
                        ])(Number(i.Hsp_hit_to - i.Hsp_hit_from) * fold)
                })
                .attr('height', 10)
                .style('fill', function (i) {
                    console.log(i)
                    return coverageDict[4].color
                })
                .attr('stroke', '#343434')
                .attr('stroke-width', '1px')
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
                        .range([
                            0,
                            end * fold,
                        ])
                    const sacleTX = d3
                        .scaleLinear()
                        .domain([0, end * fold])
                        .range([
                            0,
                            end * fold,
                        ])
                    const sstart = sacleSX(i.Hsp_query_from * fold)
                    const send = sacleSX(i.Hsp_query_to * fold)
                    const tstart = sacleTX(i.Hsp_hit_from * fold)
                    const tend = sacleTX(i.Hsp_hit_to * fold)
                    return complink(sstart, send, tstart, tend, index * lineHeight.value + 101)
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
