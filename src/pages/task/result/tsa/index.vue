<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">TSA Annotation Results</div>
            <el-button class="ml-5" @click="downloadresult">
                <template #icon>
                    <n-icon>
                        <downicon />
                    </n-icon>
                </template>
                Download Analysis Result
            </el-button>
        </div>
        <div>
            <el-menu
                :default-active="mutation_type"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item v-for="t in mutation_types" :key="t" :index="t">
                    {{ t }}
                </el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="mb-20">
            <n-data-table
                :columns="columns"
                :data="safetydataList"
                :row-key="rowKey"
                :scroll-x="2600"
                :max-height="2000"
                @update:sorter="handleSorterChange"
                @update:filters="handleFilterChange"
            />
        </div>
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-2"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="20"
                :page-sizes="[20, 50, 100]"
                show-quick-jumper
                :item-count="count"
                @update:page="pagechange"
                @update:page-size="pagesizechange"
            >
                <template #prev>
                    <n-button @click="prevPage" v-bind:disabled="pagevalue === 1" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronBack />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronForward />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { ref } from 'vue'
import axios from 'axios'
import type { DataTableColumns } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import { CloudDownloadOutline as downicon, ChevronBack, ChevronForward } from '@vicons/ionicons5'

import { decrypt } from '@/utils/crypto'

const safetydata = ref()

const sorter_dict = ref('')
const filter_dict = ref('')
const activeTab = ref('second')

const cur_time = ref('')

const url = ref('/tasks/tsa_result/')
const mutation_type = ref('control')

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
    id: string
}

const loading = ref(false)
const rowKey = (row: RowData) => {
    return row.id
}
const pagevalue = ref(1)
const pageSize = ref(20)

const get_response = async (page_offset: number) => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + page_offset,
            pagesize: pageSize.value,
            taskid: taskid.value,
            mutation_type: mutation_type.value,
        },
    })
    const { data } = response
    safetydata.value = data
    loading.value = false
}

onBeforeMount(async () => {
    get_response(0)
})

const safetydataList = computed(() => {
    return safetydata.value?.results
})
const mutation_types = computed(() => {
    return safetydata.value?.mutation_types
})

const handleSorterChange = async (sorter: any) => {
    sorter_dict.value = sorter
    get_response(0)
}

const handleFilterChange = async (filter: any) => {
    filter_dict.value = filter
    get_response(0)
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
    long: 200,
    short: 200,
}

const blocks_for_control = [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'ID' }), 'ID')
        },
        key: 'ID',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => '#' }), '#')
        },
        key: '#',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Title' }), 'Title')
        },
        key: 'Title',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Charge' }), 'Charge')
        },
        key: 'Charge',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Sq' }), 'Sq')
        },
        key: 'Sq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Mod_Sites' }), 'Mod_Sites')
        },
        key: 'Mod_Sites',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Score' }), 'Score')
        },
        key: 'Score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Spectra_Mass' }), 'Spectra_Mass')
        },
        key: 'Spectra_Mass',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Q_value' }), 'Q_value')
        },
        key: 'Q_value',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Theory_Sq_Mass' }),
                'Theory_Sq_Mass'
            )
        },
        key: 'Theory_Sq_Mass',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Delta_Mass' }), 'Delta_Mass')
        },
        key: 'Delta_Mass',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Delta_Mass_(PPM)' }),
                'Delta_Mass_(PPM)'
            )
        },
        key: 'Delta_Mass_(PPM)',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Specific_Flag' }),
                'Specific_Flag'
            )
        },
        key: 'Specific_Flag',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Label_Flag' }), 'Label_Flag')
        },
        key: 'Label_Flag',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Target_Decoy' }), 'Target_Decoy')
        },
        key: 'Target_Decoy',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Protein_AC' }), 'Protein_AC')
        },
        key: 'Protein_AC',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Peptide' }), 'Peptide')
        },
        key: 'Peptide',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'HLA_A_aff' }), 'HLA_A_aff')
        },
        key: 'HLA_A_aff',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'HLA_B_aff' }), 'HLA_B_aff')
        },
        key: 'HLA_B_aff',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'HLA_C_aff' }), 'HLA_C_aff')
        },
        key: 'HLA_C_aff',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Min_aff' }), 'Min_aff')
        },
        key: 'Min_aff',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Min_aff_allele' }),
                'Min_aff_allele'
            )
        },
        key: 'Min_aff_allele',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Min_rank' }), 'Min_rank')
        },
        key: 'Min_rank',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Min_rank_allele' }),
                'Min_rank_allele'
            )
        },
        key: 'Min_rank_allele',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
]
const blocks_for_others = [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Matched_DNA' }), 'Matched_DNA')
        },
        key: 'Matched_DNA',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Matched_in_Control_JF' }),
                'Matched_in_Control_JF'
            )
        },
        key: 'Matched_in_Control_JF',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Matched_in_Cancer_JF' }),
                'Matched_in_Cancer_JF'
            )
        },
        key: 'Matched_in_Cancer_JF',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'nFreq' }), 'nFreq')
        },
        key: 'nFreq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cFreq' }), 'cFreq')
        },
        key: 'cFreq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TSA' }), 'TSA')
        },
        key: 'TSA',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
]
const columns = ref<DataTableColumns<RowData>>([])

if (mutation_type.value !== 'control') {
    columns.value = [...blocks_for_control, ...blocks_for_others]
} else {
    columns.value = [...blocks_for_control]
}

watch(
    mutation_type,
    () => {
        console.log('=======================================', mutation_type.value)
        if (mutation_type.value !== 'control') {
            columns.value = [...blocks_for_control, ...blocks_for_others]
        } else {
            columns.value = [...blocks_for_control]
        }
    },
    { immediate: true }
)

const handleSelectSet = async (key: any) => {
    mutation_type.value = key
    get_response(0)
}
const count = computed(() => safetydata.value?.count)

const nextPage = async () => {
    get_response(1)
}
const prevPage = async () => {
    get_response(-1)
}

const pagechange = async () => {
    get_response(0)
}
const pagesizechange = async () => {
    get_response(0)
}
</script>

<style scoped>
#myViewer {
    width: 100%;
    height: 600px;
    position: relative;
    overflow: scroll;
}
</style>
