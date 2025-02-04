<meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />
<!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> -->
<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Linear Design Result Display</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="downloadresult">
                        <template #icon>
                            <n-icon>
                                <downicon />
                            </n-icon>
                        </template>
                        Download Analysis Result
                    </el-button>
                </div>
            </div>

            <div class="mt-6 ml-8 w-350">
                <div v-loading="loading" class="mb-20">
                    <n-data-table
                        :columns="columns"
                        :data="rnadataList"
                        :row-key="rowKey"
                        :scroll-x="2600"
                        :max-height="200"
                        @update:sorter="handleSorterChange"
                    />
                </div>
            </div>
        </div>
        <div class="mt-5 ml-15">
            <div class="flex flex-row w-300">
                <div class="text-2xl font-500 mb-5">Structure Visualization</div>
                <div class="text-2xl font-500 mb-5 ml-10">
                    <n-space align="center">
                        <n-radio-group v-model:value="activeTab">
                            <n-radio-button value="second">Secondary Structure</n-radio-button>
                        </n-radio-group>
                    </n-space>
                </div>
            </div>
            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <div class="mb-2">
                    <div v-if="activeTab === 'second'">
                        <forna
                            :structure="forna_structure"
                            :sequence="forna_sequence"
                            :cur_time="cur_time"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { ref } from 'vue'
import axios from 'axios'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import _ from 'lodash'
import { decrypt } from '@/utils/crypto'
import forna from './forna.vue'
import { windowSuccessMessage } from '@/utils/windowFunctions'
import { useLinearDesign2PredictionTaskSunmissionStore } from '@/store/mrna'

const taskSubmissionStore = useLinearDesign2PredictionTaskSunmissionStore()

const router = useRouter()

const sorter_dict = ref('')
const activeTab = ref('second')

const forna_structure = ref('')
const forna_sequence = ref('')

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

type RowData = {
    seq_name: string
    utr3_seq: string
    utr3_structure: string
    sequence: string
    structure: string
    utr5_seq: string
    utr5_structure: string
    folding_free_energy: number
    cai: number
}
const loading = ref(false)
const rnadata = ref()
const rowKey = (row: RowData) => {
    return row.seq_name
}

const openView = (row: any) => {
    forna_structure.value = row.utr3_structure + row.structure + row.utr5_structure
    forna_sequence.value = row.utr3_seq + row.sequence + row.utr5_seq
}

const runPrediction = (row: any) => {
    taskSubmissionStore.name = row.seq_name
    taskSubmissionStore.utr3Sequence = row.utr3_seq
    taskSubmissionStore.cdsSequence = row.sequence
    taskSubmissionStore.utr5Sequence = row.utr5_seq
    windowSuccessMessage(
        "You will be directed to the Prediction task submission page. The CDS, 3'UTR and 5'UTR sequences will be used to do the analysis. You can do some modifications on it if needed."
    )
    router.push({
        path: '/analysis/prediction/index4lineardesign_cdsplus35utr',
    })
}

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tasks/lineardesign_result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    rnadata.value = data

    forna_structure.value =
        rnadata.value.results[0].utr3_structure +
        rnadata.value.results[0].structure +
        rnadata.value.results[0].utr5_structure
    forna_sequence.value =
        rnadata.value.results[0].utr3_seq +
        rnadata.value.results[0].sequence +
        rnadata.value.results[0].utr5_seq

    loading.value = false
})

const rnadataList = computed(() => {
    return _.map(rnadata.value?.results, (row: any) => {
        // eslint-disable-next-line
        return row
    })
})

const handleSorterChange = async (sorter: any) => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/tasks/lineardesign_result/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    rnadata.value = data
    loading.value = false
}

const downloadresult = () => {
    window.open(`/api/tasks/zip/?taskid=${taskid.value}`, '_blank')
}

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const columnWidth = {
    seq_name: 100,
    utr3_seq: 150,
    utr3_structure: 150,
    sequence: 150,
    utr5_seq: 150,
    utr5_structure: 150,
    structure: 150,
    folding_free_energy: 100,
    cai: 100,
    actions: 220,
}
const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Sequence Name' }),
                'Sequence Name'
            )
        },
        key: 'seq_name',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.seq_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => "3'UTR Sequence" }),
                "3'UTR Sequence (user input)"
            )
        },
        key: 'utr3_seq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.utr3_seq,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => "3'UTR Structure" }),
                "3'UTR Structure"
            )
        },
        key: 'utr3_structure',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.utr3_structure,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'CDS Sequence' }),
                'CDS Sequence (design by the platform)'
            )
        },
        key: 'sequence',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.sequence,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'CDS Structure' }),
                'CDS Structure'
            )
        },
        key: 'structure',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.structure,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => "5'UTR Sequence" }),
                "5'UTR Sequence (user input)"
            )
        },
        key: 'utr5_seq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.utr5_seq,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => "5'UTR Structure" }),
                "5'UTR Structure"
            )
        },
        key: 'utr5_structure',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.utr5_structure,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'mRNA Folding Free Energy' }),
                'mRNA Folding Free Energy'
            )
        },
        key: 'folding_free_energy',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.folding_free_energy,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'mRNA CAI' }), 'mRNA CAI')
        },
        key: 'cai',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.cai,
        sorter: true,
    },
    {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex', // center
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
                            onClick: () => openView(row),
                        },
                        { default: () => 'View Structure Visualization' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => runPrediction(row),
                        },
                        { default: () => 'Run Prediction Analysis' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>
