<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">TAntigen Information</div>
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
                <el-menu-item index="phage_protein_RefSeq">TAntigen</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="TAntigenList"
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
    AgACC: string
    AntigenName: string
    FullName: string
    Synonym: string
    UniProtID: string
    href1: string
    NCBIGeneID: string
    href2: string
    GeneCardID: string
    href3: string
    RNAorProteinexpressionprofile: string
    href4: string
    Antigensequence: string
    seq_5: string
    cds: string
    seq_3: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const TAntigendata = ref()
onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
})

const TAntigenList = computed(() => {
    return TAntigendata.value?.results
})

const count = computed(() => TAntigendata.value?.count)

const nextPage = async () => {
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value - 1,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}

const handleSorterChange = async sorter => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = TAntigendata.value.results

    TAntigendata.value.results = _.filter(TAntigendata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        TAntigendata.value.results = templatedata.value
    }
}

const column_width = {
    id: 100,
    agacc: 100,
    antigen_name: 100,
    full_name: 200,
    synonym: 200,
    uniprot_id: 100,
    ncbi_gene_id: 100,
    gene_card_id: 100,
    rna_or_protein_expression_profile: 200,
    antigen_sequence: 100,
    seq_3: 100,
    cds: 100,
    seq_5: 100,
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
        width: column_width.id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'AgACC' }), 'AgACC')
        },
        key: 'agacc',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.agacc,
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
        width: column_width.antigen_name,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Full Name' }), 'Full Name')
        },
        key: 'full_name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.full_name,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Synonym' }), 'Synonym')
        },
        key: 'synonym',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.synonym,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Uni Prot ID' }), 'Uni Prot ID')
        },
        key: 'uniprot_id',
        align: 'center',
        width: column_width.uniprot_id,
        sorter: true,
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
                            window.open(`${row.href1}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.uniprot_id
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'NCBI Gene ID' }), 'NCBI Gene ID')
        },
        key: 'ncbi_gene_id',
        align: 'center',
        width: column_width.ncbi_gene_id,
        sorter: true,
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
                            window.open(`${row.href2}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.ncbi_gene_id
                            },
                        }),
                    ]
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Gene Card ID' }), 'Gene Card ID')
        },
        key: 'gene_card_id',
        align: 'center',
        width: column_width.gene_card_id,
        sorter: true,
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
                            window.open(`${row.href3}`)
                        },
                    },
                    [
                        h(NEllipsis, null, {
                            default: () => {
                                return row.gene_card_id
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
                h('div', null, { default: () => 'RNA / Protein expression profile' }),
                'RNA / Protein expression profile'
            )
        },
        key: 'rna_or_protein_expression_profile',
        align: 'center',
        width: column_width.rna_or_protein_expression_profile,
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
                                return row.rna_or_protein_expression_profile
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
                h('div', null, { default: () => 'Antigen sequence' }),
                'Antigen sequence'
            )
        },
        key: 'antigen_sequence',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.antigen_sequence,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'seq_5' }), 'seq_5')
        },
        key: 'seq_5',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.seq_5,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'CDS' }), 'CDS')
        },
        key: 'cds',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.cds,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'seq_3' }), 'seq_3')
        },
        key: 'seq_3',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.seq_3,
    },
]
const columns = createColumns()

const handleSelectSet = async (key: any) => {
    dataset.value = key
    loading.value = true
    const response = await axios.get(`/tantigen/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    TAntigendata.value = data
    loading.value = false
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>
