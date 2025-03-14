<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Sample Information</div>
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
            <el-menu :default-active="dataset" class="el-menu-demo" mode="horizontal">
                <el-menu-item index="">Main</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="MainList"
                :row-key="rowKey"
                :scroll-x="1900"
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
import {
    isoformdbSamplesGenderRefOptions,
    isoformdbSamplesTissueTypeRefOptions,
} from '@/utils/filteroption'

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
    name: string
    tissue_type: string
    tissue_type_detail: string
    subject_id: string
    gender: number
    min_age: number
    max_age: number
    death_circumstances: string
    dataset_id: number
    dataset_name: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
    const response = await axios.get(`/isoformdb/samples/`, {
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
const detail = (row: any) => {
    router.push({
        path: '/database/isoformdb/samples/detail',
        query: {
            id: row.id,
        },
    })
}

const columnWidth = {
    id: 100,
    name: 200,
    tissue_type: 100,
    tissue_type_detail: 100,
    subject_id: 100,
    gender: 100,
    min_age: 100,
    max_age: 100,
    death_circumstances: 100,
    dataset_id: 100,
    dataset_name: 100,
    actions: 100,
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'ID' }), 'ID')
        },
        key: 'id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Name' }), 'Name')
        },
        key: 'name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Tissue Type' }), 'Tissue Type')
        },
        key: 'tissue_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.tissue_type,
        filter: true,
        filterOptions: isoformdbSamplesTissueTypeRefOptions,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Tissue Type Detail' }),
                'Tissue Type Detail'
            )
        },
        key: 'tissue_type_detail',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.tissue_type_detail,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Subject ID' }), 'Subject ID')
        },
        key: 'subject_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.subject_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Gender' }), 'Gender')
        },
        key: 'gender',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.gender,
        render: (row: RowData) => {
            if (row.gender === 1) {
                return 'Male' // 1
            }
            return 'Female' // 2
        },
        filter: true,
        filterOptions: isoformdbSamplesGenderRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Age' }), 'Age')
        },
        key: 'age',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: 95,
        render: (row: RowData) => {
            if (row.age == null) {
                return `${row.min_age}-${row.max_age}`
            }
            return row.age
        },
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Death Circumstances' }),
                'Death Circumstances'
            )
        },
        key: 'death_circumstances',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.death_circumstances,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Dataset ID' }), 'Dataset ID')
        },
        key: 'dataset_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.dataset_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Dataset Name' }), 'Dataset Name')
        },
        key: 'dataset_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.dataset_name,
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
