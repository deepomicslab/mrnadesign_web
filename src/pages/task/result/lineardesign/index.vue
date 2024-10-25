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

            <div class="flex flex-row justify-between mt-6 ml-8 w-350">
                <div v-loading="loading" class="mb-20">
                    <n-data-table
                        :columns="columns"
                        :data="rnadataList"
                        :row-key="rowKey"
                        :scroll-x="1000"
                        :max-height="200"
                        @update:sorter="handleSorterChange"
                    />
                </div>
            </div>
        </div>
        <div class="mt-5 ml-15">
            <div class="flex flex-row w-200">
                <div class="text-2xl font-500 mb-5">Annotation</div>
            </div>
            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <mrnaAnnotation />
            </div>
            <div class="flex flex-row w-300">
                <div class="text-2xl font-500 mb-5">Structure Visualization</div>
                <div class="text-2xl font-500 mb-5 ml-10">
                    <n-space align="center">
                        <n-radio-group v-model:value="activeTab">
                            <n-radio-button value="primary">Primary Structure</n-radio-button>
                            <n-radio-button value="second">Secondary Structure</n-radio-button>
                            <n-radio-button value="protein">Protein Structure</n-radio-button>
                        </n-radio-group>
                    </n-space>
                </div>
            </div>

            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <div class="mb-2">
                    <div v-if="activeTab === 'primary'">
                        <seqdemoD3 />
                    </div>
                    <div v-else-if="activeTab === 'second'">
                        <forna
                            :structure="forna_structure"
                            :sequence="forna_sequence"
                            :cur_time="cur_time"
                        />
                    </div>
                    <div v-else-if="activeTab === 'protein'">
                        <iframe
                            :src="protein_url"
                            scrolling="auto"
                            frameborder="no"
                            class="w-full h-130"
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
import seqdemoD3 from './seqdemoD3.vue'
import forna from './forna.vue'
import mrnaAnnotation from './mrna_annotation.vue'

// url.value = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${mrnaStore.proteinstructureList.type}&url=${mrnaStore.proteinstructureList.fileurl}`
const protein_url = ref('https://www.ncbi.nlm.nih.gov/Structure/icn3d/?mmdbid=1HHO&bu=1')
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
    id: number
    seq_name: string
    sequence: string
    structure: string
    folding_free_energy: number
    cai: number
}
const loading = ref(false)
const rnadata = ref()
const rowKey = (row: RowData) => {
    return row.id
}

const openView = (row: any) => {
    forna_structure.value = row.structure
    forna_sequence.value = row.sequence
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

    forna_structure.value = rnadata.value.results[0].structure
    forna_sequence.value = rnadata.value.results[0].sequence

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
    id: 70,
    seq_name: 100,
    sequence: 150,
    structure: 150,
    folding_free_energy: 100,
    cai: 100,
    actions: 100,
}
const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'ID' }), 'ID')
        },
        key: 'id',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.id,
        sorter: true,
    },
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
            return renderTooltip(h('div', null, { default: () => 'Sequence' }), 'Sequence')
        },
        key: 'sequence',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.sequence,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Structure' }), 'Structure')
        },
        key: 'structure',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.structure,
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
        fixed: 'left',
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
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.cai,
        sorter: true,
    },
    {
        title: 'Structure Visualization',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'center', // flex
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
                        { default: () => 'view' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>
