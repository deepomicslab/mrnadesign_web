<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">GtRNAdb Genome Details</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="mt-1.5 ml-1"></div>
            <div class="flex flex-row">
                <div class="mt-2 text-base">Search:</div>
                <el-input class="w-50 ml-3" size="small" v-model="searchinput">
                    <template #append>
                        <el-button :icon="Search" @click="filtersearch" />
                    </template>
                </el-input>
                <el-button class="mt-1 ml-2" :icon="RefreshRight" circle @click="resetsearch" />
            </div>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <el-descriptions
                class="w-500 text-xl mt-10"
                :column="2"
                size="large"
                border
                v-loading="loading"
            >
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Domain</div>
                    </template>
                    {{ CommonList && CommonList.domain }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Genome</div>
                    </template>
                    {{ CommonList && CommonList.genome }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Genome ID</div>
                    </template>
                    {{ CommonList && CommonList.genomeid }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Tax ID</div>
                    </template>
                    {{ CommonList && CommonList.tax_id }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Genbank Common Name</div>
                    </template>
                    {{ CommonList && CommonList.genbank_common_name }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Scientific Name</div>
                    </template>
                    {{ CommonList && CommonList.scientific_name }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">GtRNAdb URL</div>
                    </template>
                    <template v-if="CommonList && CommonList.gtrnadb_url">
                        <a
                            :href="CommonList.gtrnadb_url"
                            target="_blank"
                            style="
                                text-decoration: underline;
                                color: #1e90ff;
                                font-weight: bold;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                            "
                        >
                            {{ CommonList.gtrnadb_url }}
                        </a>
                    </template>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div>
            <el-menu
                :default-active="dataset"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="phage_protein_RefSeq">Main</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="MainList"
                :row-key="rowKey"
                :scroll-x="2600"
                :max-height="1000"
                @update:checked-row-keys="handleCheck"
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
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'

import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'
import { useRouter } from 'vue-router'

import { gtrnadbDetailStrandRefOptions, gtrnadbDetailIsotypeRefOptions } from '@/utils/filteroption'

const loading = ref(false)

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}
const dataset = ref('phage_protein_RefSeq')

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const sorter_dict = ref('')
const filter_dict = ref('')

type RowData = {
    id: number
    genomeid: string
    gtrnadb_id: string
    trna_scan_id: string
    trna_scan_id_code: string
    chr: string
    start: string
    end: string
    strand: string
    isotype: string
    anticodon: string
    intron_count: number
    mismatches: number
    score: number
    pseudogene: number
    ids: string
    length: number
    len_mature: number
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()
const Commondata = ref()

const router = useRouter()
const genomeid = computed(() => router.currentRoute.value.query.genomeid as string)

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
        },
    })
    const { data } = response
    Maindata.value = data

    const response2 = await axios.get(`/gtrnadb/detail/common/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
        },
    })

    Commondata.value = response2.data
    loading.value = false
})

const MainList = computed(() => {
    return Maindata.value?.results
})
const CommonList = computed(() => {
    return Commondata.value?.results
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

const handleFilterChange = async filter => {
    loading.value = true
    filter_dict.value = filter
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/gtrnadb/detail/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            genomeid: genomeid.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = Maindata.value.results

    Maindata.value.results = _.filter(Maindata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        Maindata.value.results = templatedata.value
    }
}

const columnWidth = {
    id: 100,
    genomeid: 150,
    gtrnadb_id: 150,
    trna_scan_id: 150,
    trna_scan_id_code: 150,
    chr: 150,
    start: 150,
    end: 150,
    strand: 150,
    isotype: 150,
    anticodon: 150,
    intron_count: 150,
    mismatches: 150,
    score: 150,
    pseudogene: 150,
    ids: 150,
    length: 150,
    len_mature: 150,
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        type: 'selection',
    },
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
            return renderTooltip(h('div', null, { default: () => 'Genome ID' }), 'Genome ID')
        },
        key: 'genomeid',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.genomeid,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'GtRNAdb ID' }), 'GtRNAdb ID')
        },
        key: 'gtrnadb_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.gtrnadb_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'tRNA Scan ID' }), 'tRNA Scan ID')
        },
        key: 'trna_scan_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.trna_scan_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'tRNA Scan ID Code' }),
                'tRNA Scan ID Code'
            )
        },
        key: 'trna_scan_id_code',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.trna_scan_id_code,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Chr' }), 'Chr')
        },
        key: 'chr',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.chr,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Start' }), 'Start')
        },
        key: 'start',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.start,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'End' }), 'End')
        },
        key: 'end',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.end,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Strand' }), 'Strand')
        },
        key: 'strand',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.strand,
        filter: true,
        filterOptions: gtrnadbDetailStrandRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Isotype' }), 'Isotype')
        },
        key: 'isotype',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.isotype,
        filter: true,
        filterOptions: gtrnadbDetailIsotypeRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Anticodon' }), 'Anticodon')
        },
        key: 'anticodon',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.anticodon,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Intron Count' }), 'Intron Count')
        },
        key: 'intron_count',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.intron_count,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Mismatches' }), 'Mismatches')
        },
        key: 'mismatches',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.mismatches,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Score' }), 'Score')
        },
        key: 'score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.score,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Pseudogene' }), 'Pseudogene')
        },
        key: 'pseudogene',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.pseudogene,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'IDs' }), 'IDs')
        },
        key: 'ids',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.ids,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Length' }), 'Length')
        },
        key: 'length',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.length,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Length of Mature' }),
                'Length of Mature'
            )
        },
        key: 'len_mature',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.len_mature,
        sorter: true,
    },
]
const columns = createColumns()

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
