<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">REBASE</div>
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

import { rebaseEnzymeTypeRefOptions } from '@/utils/filteroption'

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
    accession_number: string
    recognition_seq_w_cleavage_site: string
    recognition_site: string
    enzyme_name_list: Array
    enzyme_type: string
    suppliers: string
    prototype: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()
const LinkMapping = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/rebase/data/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Maindata.value = data

    const response2 = await axios.get(`/rebase/link/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {},
    })
    LinkMapping.value = response2.data.results
    console.log(LinkMapping.value, LinkMapping.value.AanI)
    loading.value = false
})

const MainList = computed(() => {
    return Maindata.value?.results
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    const response = await axios.get(`/rebase/data/`, {
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
    accession_number: 150,
    recognition_seq_w_cleavage_site: 150,
    recognition_site: 150,
    // enzyme_name_list: Array
    enzyme_name: 100,
    enzyme_type: 150,
    suppliers: 150,
    prototype: 150,
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
            return renderTooltip(
                h('div', null, { default: () => 'Accession Number' }),
                'Accession Number'
            )
        },
        key: 'accession_number',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.accession_number,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Recognition Sequence With Cleavage Site' }),
                'Recognition Sequence With Cleavage Site'
            )
        },
        key: 'recognition_seq_w_cleavage_site',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.recognition_seq_w_cleavage_site,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Recognition Site' }),
                'Recognition Site'
            )
        },
        key: 'recognition_site',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.recognition_site,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Enzyme Name' }), 'Enzyme Name')
        },
        key: 'enzyme_name_list',
        align: 'center',
        fixed: 'left',
        width: '200px',
        ellipsis: {
            tooltip: true,
        },
        render: row => {
            return h(
                'div',
                {
                    style: { overflow: 'auto', 'text-overflow': 'ellipsis' },
                },
                row.enzyme_name_list.map(enzymeName => {
                    let this_href = '#'
                    if (LinkMapping.value) this_href = LinkMapping.value[enzymeName]
                    return h(
                        'a',
                        {
                            href: this_href,
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
                            enzymeName, // The URL text
                            h('span', { style: { marginLeft: '5px' } }, ''),
                        ]
                    )
                })
            )
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Enzyme Type' }), 'Enzyme Type')
        },
        key: 'enzyme_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.enzyme_type,
        filter: true,
        filterOptions: rebaseEnzymeTypeRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Suppliers' }), 'Suppliers')
        },
        key: 'suppliers',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.suppliers,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'prototype' }), 'Prototype')
        },
        key: 'prototype',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.prototype,
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
