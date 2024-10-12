<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Antigen Information</div>
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
                <el-menu-item index="phage_protein_RefSeq">Antigen</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="AntigenList"
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
import { NButton, NTooltip, NEllipsis } from 'naive-ui'

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
    Antigen_Name: string
    Antigen_Sequence: string
    Sequence: string
    Antigen_Type: string
    Model_Structure: string
    href2: string
    Surface_Access: string
    href3: string
    Protein_Class: string
    Database_Reference1: string
    href4: string
    Database_Reference2: string
    href5: string
    Database_Reference3: string
    href6: string
    Source_Organism: string
    href7: string
    Literature_Reference: string
    href8: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Antigendata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/antigen/`, {
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
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
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
    antigen_name: 300,
    sequence: 200,
    antigen_type: 150,
    model_structure: 120,
    surface_access: 120,
    protein_class: 200,
    database_reference1: 150,
    database_reference2: 150,
    database_reference3: 150,
    source_organism: 150,
    literature_reference: 150,
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
            return renderTooltip(h('div', null, { default: () => 'Antigen Name' }), 'Antigen Name')
        },
        key: 'antigen_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.antigen_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Sequence' }), 'Sequence')
        },
        key: 'sequence',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.sequence,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Antigen Type' }), 'Antigen Type')
        },
        key: 'antigen_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.antigen_type,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Model Structure' }),
                'Model Structure'
            )
        },
        key: 'model_structure',
        align: 'center',
        width: columnWidth.model_structure,
        render(row: RowData) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href2}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.model_structure
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Surface Access' }),
                'Surface Access'
            )
        },
        key: 'surface_access',
        align: 'center',
        width: columnWidth.surface_access,
        render(row: RowData) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href3}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.surface_access
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Protein Class' }),
                'Protein Class'
            )
        },
        key: 'protein_class',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.protein_class,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Database Reference1' }),
                'Database Reference1'
            )
        },
        key: 'database_reference1',
        align: 'center',
        width: columnWidth.database_reference1,
        render(row: any) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href4}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.database_reference1
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Database Reference2' }),
                'Database Reference2'
            )
        },
        key: 'database_reference2',
        align: 'center',
        width: columnWidth.database_reference2,
        render(row: any) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href5}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.database_reference2
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Database Reference3' }),
                'Database Reference3'
            )
        },
        key: 'database_reference3',
        align: 'center',
        width: columnWidth.database_reference3,
        render(row: any) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href6}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.database_reference3
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Source Organism' }),
                'Source Organism'
            )
        },
        key: 'source_organism',
        align: 'center',
        width: columnWidth.source_organism,
        render(row: any) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href7}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.source_organism
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Literature Reference' }),
                'Literature Reference'
            )
        },
        key: 'literature_reference',
        align: 'center',
        width: columnWidth.literature_reference,
        render(row: any) {
            return h('div', null, [
                h(
                    NButton,
                    {
                        type: 'info',
                        text: true,
                        size: 'small',
                        style: { width: '100px' },
                        onClick: () => {
                            window.open(`${row.href8}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.literature_reference
                            },
                        }),
                    ]
                ),
            ])
        },
    },
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/antigen/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    Antigendata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
