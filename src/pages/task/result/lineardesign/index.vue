<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="text-4xl ml-1 font-600">Linear Design Result Display</div>
        <div class="mt-7 flex flex-row justify-start items-center ml-5">
            <el-button @click="downloadresult">
                <template #icon>
                    <n-icon>
                        <downicon />
                    </n-icon>
                </template>
                DownLoad Analysis Result
            </el-button>
        </div>
        <div class="mt-0 flex flex-row justify-start items-center ml-5">
            <el-tabs v-model="activeTab" type="card">
                <div v-loading="loading">
                    <div>
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
                        <div v-loading="loading" class="mb-2">
                            <div v-if="activeTab === 'primary'">
                                <seqdemoD3 />
                            </div>
                            <div v-else-if="activeTab === 'second'">
                                <forna :structure="forna_structure" :sequence="forna_sequence" />
                            </div>
                            <div v-else-if="activeTab === 'protein'">
                                <iframe
                                    :src="url"
                                    scrolling="auto"
                                    frameborder="no"
                                    class="w-full h-106"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </el-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { watchEffect, ref } from 'vue'
import axios from 'axios'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import _ from 'lodash'
import { decrypt } from '@/utils/crypto'
import seqdemoD3 from './seqdemoD3.vue'
import forna from './forna.vue'

const url = ref('')
const sorter_dict = ref('')
const activeTab = ref('second')

const forna_structure = ref('')
const forna_sequence = ref('')

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

const openPrimaryStructure = (row: any) => {
    activeTab.value = 'primary'
    console.log(row)
}

const openSecondaryStructure = (row: any) => {
    activeTab.value = 'second'
    forna_structure.value = row.structure
    forna_sequence.value = row.sequence
    // watchEffect(() => {
    //     // url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=${row.structure}&sequence=${row.sequence}`
    //     url.value = `https://mrnadesign.deepomics.org/vis?id=url/name&structure=${row.structure}&sequence=${row.sequence}`
    //     // url.value = `http://nibiru.tbi.univie.ac.at/forna/forna.html?id=url/name&structure=.().&sequence=ACCA`
    // })
}

const openProteinStructure = (row: any) => {
    activeTab.value = 'protein'
    console.log(row)
    watchEffect(() => {
        // url.value = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${mrnaStore.proteinstructureList.type}&url=${mrnaStore.proteinstructureList.fileurl}`
        url.value = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?mmdbid=1HHO&bu=1`
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

    if (activeTab.value === 'primary') {
        openPrimaryStructure(rnadata.value.results[0])
    } else if (activeTab.value === 'second') {
        openSecondaryStructure(rnadata.value.results[0])
    } else if (activeTab.value === 'protein') {
        openProteinStructure(rnadata.value.results[0])
    }

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
    actions: 150,
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
                        display: 'flex',
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
                            onClick: () => openPrimaryStructure(row),
                        },
                        { default: () => 'Primary' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => openSecondaryStructure(row),
                        },
                        { default: () => 'Secondary' }
                    ),
                    h(
                        NButton,
                        {
                            strong: true,
                            size: 'small',
                            type: 'info',
                            onClick: () => openProteinStructure(row),
                        },
                        {
                            default: () => 'Protein',
                        }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>
