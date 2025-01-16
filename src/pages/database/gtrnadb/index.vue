<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">GtRNAdb Genome</div>
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

import { gtrnadbDomainRefOptions } from '@/utils/filteroption'

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
    domain: string
    genome: string
    genomeid: string
    gtrnadb_url: string
    tax_id: string
    genbank_common_name: string
    scientific_name: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/`, {
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

const detail = (row: any) => {
    router.push({
        path: 'gtrnadb/detail',
        query: { genomeid: row.genomeid },
    })
}

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    const response = await axios.get(`/gtrnadb/`, {
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
    domain: 150,
    genome: 150,
    genomeid: 150,
    gtrnadb_url: 150,
    tax_id: 150,
    genbank_common_name: 150,
    scientific_name: 150,
    actions: 100,
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
            return renderTooltip(h('div', null, { default: () => 'Domain' }), 'Domain')
        },
        key: 'domain',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.domain,
        filter: true,
        filterOptions: gtrnadbDomainRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Genome' }), 'Genome')
        },
        key: 'genome',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.genome,
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
        title: 'GtRNAdb URL',
        key: 'gtrnadb_url',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.gtrnadb_url,
        render: row => {
            return h(
                'a',
                {
                    href: row.gtrnadb_url, // URL from the data
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
                    row.gtrnadb_url, // The URL text
                    h('span', { style: { marginLeft: '5px' } }, '🔗'), // Add a link icon
                ]
            )
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Tax ID' }), 'Tax ID')
        },
        key: 'tax_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.tax_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Genbank Common Name' }),
                'Genbank Common Name'
            )
        },
        key: 'genbank_common_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.genbank_common_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Scientific Names' }),
                'Scientific Name'
            )
        },
        key: 'scientific_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.scientific_name,
        sorter: true,
    },
    {
        title: 'Action',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'center',
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
                            onClick: () => detail(row),
                        },
                        { default: () => 'Detail' }
                    ),
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
