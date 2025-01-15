<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">MicroRNA Target Sites String Evidence</div>
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

import {
    mirtarbaseSpeciesMiRNARefOptions,
    mirtarbaseSpeciesTargetGeneRefOptions,
    mirtarbaseSupportTypeRefOptions,
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
    mirtarbase_id: string
    mirna: string
    species_mirna: string
    target_gene: string
    target_gene_entrez_gene_id: string
    species_target_gene: string
    target_site: string
    experiments: string
    support_type: string
    references_pmid: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/mirtarbase/`, {
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

const AntigenList = computed(() => {
    return Maindata.value?.results
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    const response = await axios.get(`/mirtarbase/`, {
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
    mirtarbase_id: 150,
    mirna: 150,
    species_mirna: 150,
    target_gene: 150,
    target_gene_entrez_gene_id: 150,
    species_target_gene: 150,
    target_site: 150,
    experiments: 150,
    support_type: 150,
    references_pmid: 150,
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
            return renderTooltip(h('div', null, { default: () => 'miRNA' }), 'miRNA')
        },
        key: 'mirna',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.mirna,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Species (miRNA)' }),
                'Species (miRNA)'
            )
        },
        key: 'species_mirna',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.species_mirna,
        filter: true,
        filterOptions: mirtarbaseSpeciesMiRNARefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Target Gene' }), 'Target Gene')
        },
        key: 'target_gene',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.target_gene,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Target Gene (Entrez Gene ID)' }),
                'Target Gene (Entrez Gene ID)'
            )
        },
        key: 'target_gene_entrez_gene_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.target_gene_entrez_gene_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Species (Target Gene)' }),
                'Species (Target Gene)'
            )
        },
        key: 'species_target_gene',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.species_target_gene,
        filter: true,
        filterOptions: mirtarbaseSpeciesTargetGeneRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Target Site' }), 'Target Site')
        },
        key: 'target_site',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.target_site,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Experiments' }), 'Experiments')
        },
        key: 'experiments',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.experiments,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Support Type' }), 'Support Type')
        },
        key: 'support_type',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.support_type,
        filter: true,
        filterOptions: mirtarbaseSupportTypeRefOptions,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'References (PMID)' }),
                'References (PMID)'
            )
        },
        key: 'references_pmid',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.references_pmid,
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
