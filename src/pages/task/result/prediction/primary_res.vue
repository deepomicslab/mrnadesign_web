<template>
    <div class="ml-10 mr-10 pt-10">
        <el-text v-for="(element, index) in resList" :key="index">
            <!-- 
                            element[0] is node
                            element[1] is color
                            element[2] is belongings
                            element[3] is highlight_range -->
            <el-tooltip placement="bottom" effect="light" :content="getResTipCont(element[2])">
                <el-text
                    :class="{ textHover: isTextHoverd(index) }"
                    @mouseenter="hoverText1(element[3])"
                    @mouseleave="leaveText1()"
                >
                    <div v-if="element[1] !== 0" class="line"></div>
                    <el-text>
                        {{ element[0] }}
                    </el-text>
                </el-text>
            </el-tooltip>
        </el-text>
    </div>
</template>

<script lang="ts" setup>
/* eslint-disable camelcase */

import { ref } from 'vue'
import axios from 'axios'

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
}>()
const { taskid, protein_subtask_name } = toRefs(props)

const componentsData = ref()
const componentsRender = ref()

const regionList = ref([] as any[])
const resList = ref([] as any[])

const seqData = ref()
const process_primarystructure = async () => {
    const response = await axios.get('/task/result/primarystructure_res/', {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            protein_subtask_name: protein_subtask_name.value,
        },
    })
    const { data } = response
    seqData.value = data

    componentsData.value = seqData.value.splitSeqData.IRES // IRES
    regionList.value = toRaw(componentsData.value)

    componentsRender.value = seqData.value.render_info.IRES
    resList.value = toRaw(componentsRender.value)
}

watch(protein_subtask_name, async () => {
    process_primarystructure()
})

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

const getResTipCont = (belongings: any[]) => {
    let resTipCont = ''
    if (belongings.length > 0) {
        for (let i = 0; i < belongings.length; i += 1) {
            const idx = belongings[i]
            if (regionList.value[idx].start)
                resTipCont += `start: ${regionList.value[idx].start}\xa0`
            if (regionList.value[idx].end) resTipCont += `end: ${regionList.value[idx].end}\xa0`
            if (regionList.value[idx].length)
                resTipCont += `length: ${regionList.value[idx].length}\xa0`
            if (regionList.value[idx].component_class1 || regionList.value[idx].component_class2) {
                resTipCont += `type:`
                if (regionList.value[idx].component_class1)
                    resTipCont += `\xa0${regionList.value[idx].component_class1}, \xa0`
                if (regionList.value[idx].component_class2)
                    resTipCont += `\xa0${regionList.value[idx].component_class2}\xa0`
            }
            resTipCont += ` | `
        }
        if (resTipCont.length >= 3) resTipCont = resTipCont.slice(0, -3)
    } else {
        resTipCont = 'This node is not in a restriction site'
    }
    return resTipCont
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

.line {
    position: relative;
    margin-top: 0px;
    margin-right: 0px;
    width: 3px;
    height: 20px;
    background: red;
    vertical-align: center;
    display: inline-block;
}
</style>
