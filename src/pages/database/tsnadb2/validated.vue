<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">All Collected Experimentally Validated Neoantigens</div>
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
                <el-menu-item index="phage_protein_RefSeq">Main</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="MainList"
                :row-key="rowKey"
                :scroll-x="1600"
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
import { useRouter } from 'vue-router'

import { tsnadb2ValidRefOptions, tsnadb2ValidSNVRefOptions } from '@/utils/filteroption'

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
const filter_dict = ref('')

type RowData = {
    id: number
    level: string
    patient_id: string
    tumor_type: string
    tumor_type_detaile: string
    mutation_type: string
    gene: string
    mutation: string
    position: string
    mutant_peptide: string
    hla: string
    pubmed_id: string
    reference_name: string
    journal: string
    year: number
    doi: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
})

const MainList = computed(() => {
    return Maindata.value?.results
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}

const handleFilterChange = async filter => {
    loading.value = true
    filter_dict.value = filter
    const response = await axios.get(`/tsnadb2/validated/`, {
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
    Maindata.value = data
    loading.value = false
}

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/tsnadb2/validated/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
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
    level: 150,
    patient_id: 150,
    tumor_type: 150,
    tumor_type_detaile: 150,
    mutation_type: 150,
    gene: 150,
    mutation: 150,
    position: 150,
    mutant_peptide: 150,
    hla: 150,
    pubmed_id: 150,
    reference_name: 150,
    journal: 150,
    year: 150,
    doi: 150,
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
            return renderTooltip(h('div', null, { default: () => 'Level' }), 'Level')
        },
        key: 'level',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.level,
        filter: true,
        filterOptions: tsnadb2ValidRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Patient ID' }), 'Patient ID')
        },
        key: 'patient_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.patient_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Tumor Type' }), 'Tumor Type')
        },
        key: 'tumor_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.patient_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Tumor Type Detaile' }),
                'Tumor Type Detaile'
            )
        },
        key: 'tumor_type_detaile',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.tumor_type_detaile,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Mutation Type' }),
                'Mutation Type'
            )
        },
        key: 'mutation_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.mutation_type,
        filter: true,
        filterOptions: tsnadb2ValidSNVRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Gene' }), 'Gene')
        },
        key: 'gene',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.gene,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Mutation' }), 'Mutation')
        },
        key: 'mutation',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.mutation,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Position' }), 'Position')
        },
        key: 'position',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.position,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Mutant Peptide' }),
                'Mutant Peptide'
            )
        },
        key: 'mutant_peptide',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.mutant_peptide,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'HLA' }), 'HlA')
        },
        key: 'hla',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.hla,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Pubmed ID' }), 'Pubmed ID')
        },
        key: 'pubmed_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.pubmed_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Reference Name' }),
                'Reference Name'
            )
        },
        key: 'reference_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.reference_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Journal' }), 'Journal')
        },
        key: 'journal',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.journal,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Year' }), 'Year')
        },
        key: 'year',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.year,
    },
    {
        title: 'DOI',
        key: 'doi',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.doi,
        render: row => {
            return h(
                'a',
                {
                    href: row.doi, // URL from the data
                    target: '_blank', // Open the link in a new tab
                    style: {
                        textDecoration: 'underline', // Underline the link
                        color: '#1E90FF', // Blue color to indicate it's a link
                        fontWeight: 'bold', // Optional: make the text bold
                        cursor: 'pointer', // Change cursor to a pointer on hover
                        display: 'flex', // To align the icon next to the text
                        alignItems: 'center', // Align the icon vertically
                    },
                    onMouseover: e => {
                        e.target.style.color = '#4169E1'
                    },
                    onMouseout: e => {
                        e.target.style.color = '#1E90FF'
                    },
                },
                [
                    row.doi, // The URL text
                    h('span', { style: { marginLeft: '5px' } }, '🔗'), // Add a link icon
                ]
            )
        },
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
