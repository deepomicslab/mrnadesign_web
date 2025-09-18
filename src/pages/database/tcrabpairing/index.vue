<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">TCR Alpha-Beta Chain Pairing</div>
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
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="AntigenList"
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
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'

import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'

import { tcrabpairingSourceRefOptions } from '@/utils/filteroption'

const router = useRouter()
const loading = ref(false)

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}

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
    source: string
    barcode: string
    Alpha: string
    Beta: string
    umisA: number
    umisB: number
    clonotype_freq: number
    TRAV: string
    TRAJ: string
    cdr3A: string
    cdr3_ntA: string
    readsA: number
    TRBV: string
    TRBJ: string
    cdr3B: string
    cdr3_ntB: string
    readsB: number
    raw_clonotype_id: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Antigendata = ref()
const url = ref(`/tcrabpairing/`)

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
})

const AntigenList = computed(() => {
    return Antigendata.value?.results
})

const count = computed(() => Antigendata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const handleFilterChange = async filter => {
    loading.value = true
    filter_dict.value = filter
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = Antigendata.value.results

    Antigendata.value.results = _.filter(Antigendata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        Antigendata.value.results = templatedata.value
    }
}

const columnWidth = {
    id: 100,
    source: 150,
    barcode: 150,
    Alpha: 200,
    Beta: 200,
    umisA: 100,
    umisB: 100,
    clonotype_freq: 150,
    TRAV: 150,
    TRAJ: 150,
    cdr3A: 150,
    cdr3_ntA: 200,
    readsA: 100,
    TRBV: 150,
    TRBJ: 150,
    cdr3B: 150,
    cdr3_ntB: 200,
    readsB: 100,
    raw_clonotype_id: 200,
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Source' }), 'source')
        },
        key: 'source',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.source,
        filter: true,
        filterOptions: tcrabpairingSourceRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Barcode' }), 'Barcode')
        },
        key: 'barcode',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.barcode,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Alpha' }), 'Alpha')
        },
        key: 'Alpha',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Alpha,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Beta' }), 'Beta')
        },
        key: 'Beta',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Beta,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'umisA' }), 'umisA')
        },
        key: 'umisA',
        align: 'center',
        width: columnWidth.umisA,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'umisB' }), 'umisB')
        },
        key: 'umisB',
        align: 'center',
        width: columnWidth.umisB,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Clonotype Frequency' }),
                'Clonotype Frequency'
            )
        },
        key: 'clonotype_freq',
        align: 'center',
        width: columnWidth.clonotype_freq,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRAV' }), 'TRAV')
        },
        key: 'TRAV',
        align: 'center',
        width: columnWidth.TRAV,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRAJ' }), 'TRAJ')
        },
        key: 'TRAJ',
        align: 'center',
        width: columnWidth.TRAJ,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3A' }), 'cdr3A')
        },
        key: 'cdr3A',
        align: 'center',
        width: columnWidth.cdr3A,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3_ntA' }), 'cdr3_ntA')
        },
        key: 'cdr3_ntA',
        align: 'center',
        width: columnWidth.cdr3_ntA,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'readsA' }), 'readsA')
        },
        key: 'readsA',
        align: 'center',
        width: columnWidth.readsA,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRBV' }), 'TRBV')
        },
        key: 'TRBV',
        align: 'center',
        width: columnWidth.TRBV,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRBJ' }), 'TRBJ')
        },
        key: 'TRBJ',
        align: 'center',
        width: columnWidth.TRBJ,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3B' }), 'cdr3B')
        },
        key: 'cdr3B',
        align: 'center',
        width: columnWidth.cdr3B,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3_ntB' }), 'cdr3_ntB')
        },
        key: 'cdr3_ntB',
        align: 'center',
        width: columnWidth.cdr3_ntB,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'readsB' }), 'readsB')
        },
        key: 'readsB',
        align: 'center',
        width: columnWidth.readsB,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Raw Clonotype ID' }),
                'Raw Clonotype ID'
            )
        },
        key: 'raw_clonotype_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.raw_clonotype_id,
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
