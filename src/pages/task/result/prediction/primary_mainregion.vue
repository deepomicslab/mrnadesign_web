<template>
    <div class="ml-10 mr-10 pt-10">
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
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */

import { ref } from 'vue'
import * as d3 from 'd3'
import axios from 'axios'

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
    cur_time: number | undefined
}>()
const { taskid, protein_subtask_name, cur_time } = toRefs(props)

const componentsRegion = ref() // main_regions

const regionList = ref([] as any[])

const seqData = ref()
const splitSeqData = ref()
const process_primarystructure = async () => {
    const response = await axios.get('/task/result/primarystructure_mainregion/', {
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
}

const process_svg = () => {
    componentsRegion.value = splitSeqData.value.main_regions
    regionList.value.length = 0
    for (let i = 0; i < componentsRegion.value.length; i += 1) {
        regionList.value.push(componentsRegion.value[i].sequence)
    }

    const regionSvg = d3.select('#regionArea')
    regionSvg.selectAll('svg').selectAll('*').remove()
    regionSvg
        .selectAll('svg')
        .data(regionList.value)
        .enter()
        .text(function (d, i) {
            return d + i
        })
}

watch(protein_subtask_name, async () => {
    process_primarystructure()
})
if (protein_subtask_name.value !== '' && cur_time.value !== Date.now()) {
    process_primarystructure()
}

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
</script>

<style scoped>
.el-row {
    margin-top: 50px;
}

.el-text {
    font-size: 20px;
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
</style>
