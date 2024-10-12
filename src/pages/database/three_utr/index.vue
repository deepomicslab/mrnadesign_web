<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">3' UTR Information</div>
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
        <div>
            <el-menu
                :default-active="dataset"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="phage_protein_RefSeq">3' UTR</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="threeUTRList"
                :row-key="rowKey"
                :scroll-x="1900"
                :max-height="1000"
                @update:checked-row-keys="handleCheck"
                @update:sorter="handleSorterChange"
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

const router = useRouter()
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

type RowData = {
    ID: number
    gene_name: string
    ensembl_gene_id: string
    ensembl_transcript_id: string
    description: string
    start_position: int
    end_position: int
    pattern: string
    cluster: int
    chromosome: string
    aliases: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const threeUTRdata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
})

const threeUTRList = computed(() => {
    return threeUTRdata.value?.results
})

const count = computed(() => threeUTRdata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = threeUTRdata.value.results

    threeUTRdata.value.results = _.filter(threeUTRdata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        threeUTRdata.value.results = templatedata.value
    }
}

const columnWidth = {
    id: 100,
    gene_name: 100,
    ensembl_gene_id: 150,
    ensembl_transcript_id: 150,
    description: 200,
    start_position: 100,
    end_position: 100,
    pattern: 100,
    cluster: 100,
    chromosome: 100,
    aliases: 200,
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
            return renderTooltip(h('div', null, { default: () => 'Gene Name' }), 'Gene Name')
        },
        key: 'gene_name',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.gene_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Ensembl Gene ID' }),
                'Ensembl Gene ID'
            )
        },
        key: 'ensembl_gene_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.ensembl_gene_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Ensembl Transcript ID' }),
                'Ensembl Transcript ID'
            )
        },
        key: 'ensembl_transcript_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.ensembl_transcript_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Description' }), 'Description')
        },
        key: 'description',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.description,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Start Position' }),
                'Start Position'
            )
        },
        key: 'start_position',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.start_position,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'End Position' }), 'End Position')
        },
        key: 'end_position',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.end_position,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Pattern' }), 'Pattern')
        },
        key: 'pattern',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.pattern,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Cluster' }), 'Cluster')
        },
        key: 'cluster',
        align: 'center',
        width: columnWidth.cluster,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Chromosome' }), 'Chromosome')
        },
        key: 'chromosome',
        align: 'center',
        width: columnWidth.chromosome,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Aliases' }), 'Aliases')
        },
        key: 'aliases',
        align: 'center',
        width: columnWidth.aliases,
    },
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/three_utr/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    threeUTRdata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
