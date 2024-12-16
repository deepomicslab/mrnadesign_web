<meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />
<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-0">
            <div class="flex flex-row w-400 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Sequence Align Result Display</div>
                <div class="mt-1.5 ml-10">
                    <n-space horizontal>
                        <el-button class="ml-2" @click="selectSeqWinPosition">
                            <template #icon>
                                <n-icon>
                                    <selectIcon />
                                </n-icon>
                            </template>
                            Choose Window Position
                        </el-button>
                        <el-button class="ml-5" @click="downloadresult">
                            <template #icon>
                                <n-icon>
                                    <downicon />
                                </n-icon>
                            </template>
                            Download Analysis Result
                        </el-button>
                    </n-space>
                </div>
            </div>
        </div>

        <div class="flex flex-col mx-0 justify-start">
            <div class="w-400 mt-18 ml-0">
                <div v-loading="loading" class="mb-2">
                    <n-data-table
                        :columns="columns"
                        :data="alignmentData"
                        :row-key="rowKey"
                        :scroll-x="1600"
                        :max-height="500"
                    />
                </div>
            </div>
        </div>

        <div class="mt-5 ml-0">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Alignment Visualization</div>
            </div>
            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <comp :alignmentData="alignmentData" />
            </div>
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Protein Structure</div>
            </div>
            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <div id="myViewer">
                    <pdbe-molstar
                        :key="shownseq"
                        :custom-data-url="`/api/database/download_protein_cif/?protein_id=1&sequence=${shownseq}`"
                        custom-data-format="cif"
                        alphafold-view="true"
                        bg-color-r="255"
                        bg-color-g="255"
                        bg-color-b="255"
                        hide-selection-icon="true"
                        hide-animation-icon="true"
                    ></pdbe-molstar>
                </div>
            </div>
        </div>

        <!-- <el-button
            size="large"
            style="margin-left: 1055px; margin-top: 20px"
            @click="doSafetyCheck()"
        >
            Do Safety Check
        </el-button> -->
    </div>

    <el-dialog
        v-model="selectSeqWinPositionDialogVisible"
        title="Select Graph Type"
        width="40%"
        align-center
    >
        <n-grid :y-gap="8" :cols="3">
            <n-grid-item v-for="(item, index) in seqaligndata" :key="index">
                <el-button
                    size="large"
                    style="margin-left: 20px; margin-top: 10px"
                    @click="selectSeqWinPositionRequest(item)"
                >
                    {{ item.window_position }}
                </el-button>
            </n-grid-item>
        </n-grid>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import axios from 'axios'
import { CloudDownloadOutline as downicon, AddCircleOutline as selectIcon } from '@vicons/ionicons5'

import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import comp from './comparison.vue'
import { decrypt } from '@/utils/crypto'

onMounted(async () => {
    const script1 = document.createElement('script')
    script1.src = '/esm/js/polyfill.min.js' // 'https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js'
    document.body.appendChild(script1)
    const script2 = document.createElement('script')
    script2.src = '/esm/js/webcomponents-lite.js' // 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js'
    document.body.appendChild(script2)
    const script3 = document.createElement('script')
    script3.src = '/esm/js/custom-elements-es5-adapter.js' // 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
    document.body.appendChild(script3)
    const script4 = document.createElement('script')
    script4.src = '/esm/js/pdbe-molstar-component.js' // 'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar-component.js'
    document.body.appendChild(script4)

    const style = document.createElement('link')
    style.href = '/esm/css/pdbe-molstar.css' //  'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar.css'
    style.type = 'text/css'
    style.rel = 'stylesheet'
    document.body.appendChild(style)
})

type AlignmentType = {
    Hit: string
    Hsp_hit_from: number
    Hsp_hit_to: number
    Hsp_query_from: number
    Hsp_query_to: number
    Hsp_score: number
    Match: string
    NCBI: string
    Query: string
    align_len: number
    e_value: number
    gaps: number
    identity: number
    pdb: string
    sequence: string
}
type SeqAlignResType = {
    window_position: string
    alignments: AlignmentType[]
}

const selectSeqWinPositionDialogVisible = ref(false)
const selectRecord = ref('')

const alignmentData = ref([] as AlignmentType[])
const seqaligndata = ref([] as SeqAlignResType[])
const shownseq = ref('')

const activeTab = ref('second')
const cur_time = ref('')
watch(activeTab, async () => {
    const today = new Date()
    cur_time.value = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
})

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})

const rowKey = (row: AlignmentType) => {
    return row.Hit
}

const loading = ref(false)

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tasks/sequencealign_result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    seqaligndata.value = data.results
    loading.value = false

    if (seqaligndata.value.length > 0) {
        selectRecord.value = seqaligndata.value[0].window_position
        alignmentData.value = seqaligndata.value[0].alignments
        shownseq.value = alignmentData.value[0].Hit
    }
})

const downloadresult = () => {
    window.open(`/api/tasks/zip/?taskid=${taskid.value}`, '_blank')
}

const selectSeqWinPosition = () => {
    selectSeqWinPositionDialogVisible.value = true
}

const selectSeqWinPositionRequest = (item: SeqAlignResType) => {
    selectRecord.value = item.window_position
    alignmentData.value = item.alignments
    shownseq.value = alignmentData.value[0].Hit
    // console.log(selectRecord.value, alignmentData.value[0].sequence, alignmentData.value[0].Hit)
    selectSeqWinPositionDialogVisible.value = false
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const columnWidth = {
    selection: 150,
    sequence: 100,
    e_value: 100,
    Hsp_score: 100,
    Query: 100,
    Match: 100,
    Hit: 100,
    actions: 200,
}

const createColumns = (): DataTableColumns<AlignmentType> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Selection' }), 'Selection')
        },
        key: 'selection', // Use a custom key
        align: 'center',
        render: () => {
            return selectRecord.value
        },
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.selection, // Define a width for your new column
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Sequence' }), 'Sequence')
        },
        key: 'sequence',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.sequence,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'e Value' }), 'e_value')
        },
        key: 'e_value',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.e_value,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Hsp Score' }), 'Hsp_score')
        },
        key: 'Hsp_score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Hsp_score,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Query' }), 'Query')
        },
        key: 'Query',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Query,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Match' }), 'Match')
        },
        key: 'Match',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Match,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Hit' }), 'Hit')
        },
        key: 'Hit',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Hit,
    },
    {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'center', // center | flex
                        justifyContent: 'space-between',
                    },
                },
                [
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => {
                                // console.log(row.sequence, row.Hit)
                                shownseq.value = row.Hit
                            },
                        },
                        { default: () => 'View Structure Visualization' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>

<style scoped>
#myViewer {
    width: 100%;
    height: 600px;
    position: relative;
    overflow: scroll;
    /* margin: 20px; */
}
</style>
