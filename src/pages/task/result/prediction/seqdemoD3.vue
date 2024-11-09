<template>
    <!-- <div class="seqarea"> -->
    <!-- <el-row>
            <el-col :span="25"> -->
    <!-- <div class="seq"> -->
    <div class="ml-10 mr-10 pt-10">
        <div id="regionArea" v-if="showtype === 'Main Region'">
            <el-text
                class="UTR5"
                type="primary"
                :class="{ textHover: isActive === 'main_region_1' }"
                @mouseenter="hoverTextR('main_region_1')"
                @mouseleave="leaveTextR"
            >
                {{ regionList[0] }}
            </el-text>

            <el-text
                class="CDS"
                tag="b"
                type="danger"
                :class="{ textHover: isActive === 'main_region_2' }"
                @mouseenter="hoverTextR('main_region_2')"
                @mouseleave="leaveTextR"
            >
                {{ regionList[1] }}
            </el-text>

            <el-text
                class="UTR3"
                type="success"
                :class="{ textHover: isActive === 'main_region_3' }"
                @mouseenter="hoverTextR('main_region_3')"
                @mouseleave="leaveTextR"
            >
                {{ regionList[2] }}
            </el-text>
            <svg></svg>
        </div>

        <div class="uorfArea" v-else-if="showtype === 'uORF' && render_info">
            <el-text v-for="(element, index) in render_info.uORF" :key="index">
                <!-- 
                            element[0] is node
                            element[1] is color
                            element[2] is belongings
                            element[3] is highlight_range -->
                <el-tooltip placement="right" effect="light" :content="getuORFTipCont(element[2])">
                    <el-text
                        class="uORF1NoOverlap"
                        type="primary"
                        :class="{ textHover: isTextHoverd(index) }"
                        @mouseenter="hoverText1(element[3])"
                        @mouseleave="leaveText1()"
                    >
                        <el-text
                            :tag="element[1] === 0 ? 'default' : 'int'"
                            :type="element[1] === 0 ? '' : type_list[element[1] % type_list.length]"
                        >
                            {{ element[0] }}
                        </el-text>
                    </el-text>
                </el-tooltip>
            </el-text>
        </div>

        <div class="resSitesArea" v-else-if="showtype === 'Restriction Sites'">
            <el-text v-for="(element, index) in render_info.restriction_sites" :key="index">
                <el-tooltip placement="top" effect="light" :content="getResTipCont(element[2])">
                    <el-text
                        :class="{ textHover: isTextHoverd(index) }"
                        @mouseenter="hoverText1(element[3])"
                        @mouseleave="leaveText1()"
                    >
                        <div v-if="element[1] !== 0" class="line"></div>
                        <el-text>{{ element[0] }}</el-text>
                    </el-text>
                </el-tooltip>
            </el-text>
        </div>
        <!-- </div> -->
        <!-- </el-col>
        </el-row> -->
        <!-- </div> -->
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */

import { ref } from 'vue'
import * as d3 from 'd3'
import axios from 'axios'

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
    showtype: string
}>()
const { taskid, protein_subtask_name, showtype } = toRefs(props)

const type_list = ['primary', 'danger', 'success', 'warning']

const componentsRegion = ref() // main_regions
const componentsUorf = ref() // uORF
const componentsResSites = ref() // restriction_sites

const regionList = ref([] as any[])

const seqData = ref()
const sequence = ref('')
const splitSeqData = ref()
const render_info = ref()
const process_primarystructure = async () => {
    const response = await axios.get('/task/result/primarystructure/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            protein_subtask_name: protein_subtask_name.value,
        },
    })
    const { data } = response
    seqData.value = data

    splitSeqData.value = seqData.value.splitSeqData
    sequence.value = seqData.value.sequence
    render_info.value = seqData.value.render_info
}

const process_svg = () => {
    componentsRegion.value = splitSeqData.value.main_regions
    for (let i = 0; i < componentsRegion.value.length; i += 1) {
        regionList.value.push(componentsRegion.value[i].sequence)
    }

    const regionSvg = d3.select('#regionArea')
    regionSvg
        .selectAll('svg')
        .data(regionList.value)
        .enter()
        .text(function (d, i) {
            return d + i
        })
    componentsUorf.value = splitSeqData.value.uORF
    componentsResSites.value = splitSeqData.value.restriction_sites
}

watch(protein_subtask_name, async () => {
    process_primarystructure()
})
watch(seqData, () => {
    process_svg()
})

const isActive = ref('')

function hoverTextR(args: any) {
    isActive.value = args
}
function leaveTextR() {
    isActive.value = ''
}

const highlight_start = ref(-1)
const highlight_end = ref(-1)
const isTextHoverd = (_index: any) => {
    const index = parseInt(_index, 10)
    return index >= highlight_start.value - 1 && index <= highlight_end.value - 1
}
function hoverText1(range: any[]) {
    const [_highlight_start, _highlight_end] = range
    highlight_start.value = parseInt(_highlight_start, 10)
    highlight_end.value = parseInt(_highlight_end, 10)
}
function leaveText1() {
    highlight_start.value = -1
    highlight_end.value = -1
}

const uorfTipCont = ref('')
const getuORFTipCont = (belongings: any[]) => {
    uorfTipCont.value = ''
    if (belongings.length > 0) {
        for (let i = 0; i < belongings.length; i += 1) {
            const idx = belongings[i]
            uorfTipCont.value +=
                `start:` +
                `\xa0${componentsUorf.value[idx].start}\xa0` +
                `end:` +
                `\xa0${componentsUorf.value[idx].end}\xa0` +
                `length:` +
                `\xa0${componentsUorf.value[idx].length}\xa0` +
                `type:` +
                `\xa0${componentsUorf.value[idx].component_class1},\xa0${componentsUorf.value[i].component_class2}` +
                ` | `
        }
        uorfTipCont.value = uorfTipCont.value.slice(0, -3)
    } else {
        uorfTipCont.value = 'This node is not in a uORF'
    }
    return uorfTipCont.value
}

const resTipCont = ref('')
const getResTipCont = (belongings: any[]) => {
    resTipCont.value = ''
    if (belongings.length > 0) {
        for (let i = 0; i < belongings.length; i += 1) {
            const idx = belongings[i]
            resTipCont.value +=
                `start:` +
                `\xa0${componentsResSites.value[idx].start}\xa0` +
                `end:` +
                `\xa0${componentsResSites.value[idx].end}\xa0` +
                `length:` +
                `\xa0${componentsResSites.value[idx].sequence}\xa0` +
                `type:` +
                `\xa0${componentsResSites.value[idx].description.split('[')[1].split(']')[0]}` +
                ` | `
        }
        resTipCont.value = resTipCont.value.slice(0, -3)
    } else {
        resTipCont.value = 'This node is not in a restriction site'
    }
    return resTipCont.value
}
</script>

<style scoped>
/* .seqarea {
    width: 1290px;
    height: 400px;
} */

.el-row {
    margin-top: 50px;
}

.el-text {
    font-size: 20px;
}

/* .seq {
    width: 600px;
    height: 200px;
    border: 0px solid var(--el-border-color);
    border-radius: 4px;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 15px;
} */

.tooltip {
    width: 150px;
    height: 50px;
    margin-left: 300px;
    background-color: aliceblue;
    padding: 5px;
    border: 1px solid var(--el-border-color);
}

.textHover {
    transform: scale(1.2, 1.2);
    transition: 0.3s;
    background-color: rgb(203, 200, 200);
}
</style>

<style lang="scss">
.el-row {
    margin-top: 20px;
    margin-left: 20px;
}

.line {
    position: absolute;
    margin-top: 4px;
    margin-right: 2px;
    width: 2px;
    height: 12px;
    background: red;
    vertical-align: bottom;
    display: inline-block;
}
</style>
