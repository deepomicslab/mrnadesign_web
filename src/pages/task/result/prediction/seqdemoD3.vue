<template>
    <div class="seqarea">
        <el-row>
            <el-col :span="5">
                <el-form :model="form">
                    <el-form-item label="">
                        <el-select v-model="form.component_type" placeholder="please select type">
                            <el-option
                                label="main regions"
                                value="Main regions"
                                @click="isShowRegion"
                            />
                            <el-option label="uORF" value="u_orf" @click="isShowUorf" />
                            <el-option
                                label="restriction_sites"
                                value="Restriction_sites"
                                @click="isShowResSites"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="25">
                <div class="seq">
                    <div id="regionArea" v-show="showregion">
                        <el-text
                            class="UTR5"
                            type="primary"
                            :class="{ textHover: isActiveR1 }"
                            @mouseenter="hoverTextR1"
                            @mouseleave="leaveTextR1"
                        >
                            AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                        </el-text>

                        <el-text
                            class="CDS"
                            tag="b"
                            type="danger"
                            :class="{ textHover: isActiveR2 }"
                            @mouseenter="hoverTextR2"
                            @mouseleave="leaveTextR2"
                        >
                            BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
                        </el-text>

                        <el-text
                            class="UTR3"
                            type="success"
                            :class="{ textHover: isActiveR3 }"
                            @mouseenter="hoverTextR3"
                            @mouseleave="leaveTextR3"
                        >
                            CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCc
                        </el-text>
                        <svg></svg>
                    </div>

                    <div class="uorfArea" v-show="showuorf" @mouseenter="getTipContentUorf">
                        <el-text>
                            <el-text class="notUORF">AAAAAAAAAAAAAAAA</el-text>
                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[0]">
                                <el-text
                                    class="uORF1NoOverlap"
                                    type="primary"
                                    :class="{ textHover: isActive1 }"
                                    @mouseenter="hoverText1"
                                    @mouseleave="leaveText1"
                                >
                                    <el-text tag="ins" type="primary">BBB</el-text>
                                    CCCCCCCCCCCCCCCCCCC
                                </el-text>
                            </el-tooltip>
                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[1]">
                                <el-text
                                    class="uORFOverlap1and2"
                                    type="danger"
                                    :class="{ textHover: isActive2 }"
                                    @mouseenter="hoverText2"
                                    @mouseleave="leaveText2"
                                >
                                    <el-text tag="ins" type="danger">DDD</el-text>
                                    EEEEEEEEEEEEEEEEEEEE
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[1]">
                                <el-text
                                    class="uORFNoOverlap2"
                                    type="danger"
                                    :class="{ textHover: isActive3 }"
                                    @mouseenter="hoverText2"
                                    @mouseleave="leaveText2"
                                >
                                    FFFFFFFFFFFFFFFF
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[2]">
                                <el-text
                                    class="uORFOverlap2and3"
                                    type="success"
                                    tag="b"
                                    :class="{ textHover: isActive4 }"
                                    @mouseenter="hoverText4"
                                    @mouseleave="leaveText4"
                                >
                                    <el-text tag="ins" type="success">GGGGGGGGGGG</el-text>
                                    HHHHHHHHHHHHHH
                                </el-text>
                            </el-tooltip>

                            <el-tooltip placement="top" effect="light" :content="uorfTipCont[3]">
                                <el-text
                                    class="uORFOverlap23and4"
                                    type="warning"
                                    tag="b"
                                    :class="{ textHover: isActive5 }"
                                    @mouseenter="hoverText5"
                                    @mouseleave="leaveText5"
                                >
                                    <el-text tag="ins" type="warning">IIIIIIIIIIIIII</el-text>
                                    JJJJJJJJJJJJJJJJJJJJ
                                </el-text>
                            </el-tooltip>
                            <el-text>
                                {{ componentsRegion && componentsRegion[2].sequence }}
                            </el-text>
                        </el-text>
                    </div>

                    <div class="resSitesArea" v-show="showresSites">
                        <el-text v-for="resSend in resSiteSends" :key="resSend.Start">
                            <el-text>
                                {{ sequence.slice(resSend.Start, resSend.End) }}
                            </el-text>
                            <el-tooltip
                                v-if="componentsResSites"
                                placement="top"
                                effect="light"
                                :content="
                                    'Start: 30  Seq: ' +
                                    componentsResSites[0].sequence +
                                    '  Enzynms: AluI, AluBI'
                                "
                            >
                                <div class="line"></div>
                            </el-tooltip>
                        </el-text>
                        <el-text>
                            {{ sequence.slice(resSiteSends[0].End) }}
                        </el-text>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */

import { ref, reactive } from 'vue'
import * as d3 from 'd3'
import _ from 'lodash'
import axios from 'axios'

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
}>()
const { taskid, protein_subtask_name } = toRefs(props)

const seqData = ref()

const process_sequencemarker = async () => {
    const response = await axios.get('/task/result/sequencemarker/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            protein_subtask_name: protein_subtask_name.value,
        },
    })
    const { data } = response
    seqData.value = data
}

watch(protein_subtask_name, async () => {
    process_sequencemarker()
})

const sequence = ref('')
const componentsRegion = ref() // main_regions
const componentsUorf = ref() // uORF
const componentsResSites = ref() // restriction_sites
// const resSiteSends = ref()

const uorfTipCont = ref([] as string[])

function getTipContentUorf() {
    uorfTipCont.value.length = 0
    for (let i = 0; i < componentsUorf.value.length; i += 1) {
        uorfTipCont.value.push(
            `start:` +
                `\xa0${componentsUorf.value[i].start}\xa0` +
                `end:` +
                `\xa0${componentsUorf.value[i].end}\xa0` +
                `length:` +
                `\xa0${componentsUorf.value[i].length}\xa0` +
                `type:` +
                `\xa0${componentsUorf.value[i].component_class1},\xa0${componentsUorf.value[i].component_class2}`
        )
    }
}

watch(seqData, () => {
    // console.log('======================== seqData', seqData.value)
    sequence.value = seqData.value.sequence
    const splitSeqData = _.groupBy(seqData.value.result, 'component_type')
    // console.log('=-----------------------splitSeqData', splitSeqData)

    componentsRegion.value = splitSeqData.main_regions
    const regionList = ref([] as any[])
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
    componentsUorf.value = splitSeqData.uORF
    getTipContentUorf()
    // const iresData = splitSeqData.IRES
    // const loopstructureData = splitSeqData['stem-loop_structure']
    componentsResSites.value = splitSeqData.restriction_sites

    // const groupedData = [
    //     componentsRegion.value,
    //     uORFData,
    //     iresData,
    //     componentsResSites.value,
    //     loopstructureData,
    // ]
    // const TypeLabel = [
    //     'mainRegionsData',
    //     'uORFData',
    //     'iresData',
    //     'restrictionSitesData',
    //     'loopstructureData',
    // ]
    // console.log('groupedData', groupedData)
})

const resSiteSends = ref([
    {
        Start: 190,
        End: 192,
    },
    {
        Start: 192,
        End: 195,
    },
    {
        Start: 195,
        End: 203,
    },
    {
        Start: 203,
        End: 208,
    },
    {
        Start: 208,
        End: 209,
    },
    {
        Start: 209,
        End: 212,
    },
    {
        Start: 212,
        End: 213,
    },
    {
        Start: 213,
        End: 214,
    },
    {
        Start: 214,
        End: 217,
    },
    {
        Start: 217,
        End: 222,
    },
    {
        Start: 222,
        End: 233,
    },
])

const form = reactive({
    component_type: '',
})

const showregion = ref(true)
const showuorf = ref(false)
const showresSites = ref(false)

function isShowRegion() {
    showregion.value = true
    showuorf.value = false
    showresSites.value = false
}
function isShowUorf() {
    showregion.value = false
    showuorf.value = true
    showresSites.value = false
}
function isShowResSites() {
    showregion.value = false
    showuorf.value = false
    showresSites.value = true
}

// const regionList = ref(['a', 'a', 'a'])
// regionList.value[0] = componentsRegion.value[0].sequence
// regionList.value[1] = componentsRegion.value[1].sequence
// regionList.value[2] = componentsRegion.value[2].sequence
// console.log(regionList)

// const regionSvg = d3.select('#regionArea')
// regionSvg
//     .selectAll('svg')
//     .data(regionList.value)
//     .enter()
//     .text(function (d, i) {
//         return d + i
//     })

const isActiveR1 = ref(false)
function hoverTextR1() {
    isActiveR1.value = true
}
function leaveTextR1() {
    isActiveR1.value = false
}

const isActiveR2 = ref(false)
function hoverTextR2() {
    isActiveR2.value = true
}
function leaveTextR2() {
    isActiveR2.value = false
}

const isActiveR3 = ref(false)
function hoverTextR3() {
    isActiveR3.value = true
}
function leaveTextR3() {
    isActiveR3.value = false
}

const isActive1 = ref(false)
const isActive2 = ref(false)
const isActive3 = ref(false)
const isActive4 = ref(false)
const isActive5 = ref(false)

function hoverText1() {
    isActive1.value = true
    isActive2.value = true
}
function leaveText1() {
    isActive1.value = false
    isActive2.value = false
}
function hoverText2() {
    isActive2.value = true
    isActive3.value = true
    isActive4.value = true
    isActive5.value = true
}
function leaveText2() {
    isActive2.value = false
    isActive3.value = false
    isActive4.value = true
    isActive5.value = true
}

function hoverText4() {
    isActive4.value = true
    isActive4.value = true
}
function leaveText4() {
    isActive4.value = false
    isActive4.value = false
}
function hoverText5() {
    isActive5.value = true
}
function leaveText5() {
    isActive5.value = false
}
</script>

<style scoped>
.seqarea {
    width: 1290px;
    height: 400px;
}

.el-row {
    margin-top: 50px;
}

.seq {
    width: 600px;
    height: 200px;
    border: 1px solid var(--el-border-color);
    border-radius: 4px;
    margin-top: 5px;
    margin-left: 5px;
    margin-right: 5px;
}

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
