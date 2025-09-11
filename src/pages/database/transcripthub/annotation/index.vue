<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Transcript Annotation</div>
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
    <el-dialog v-model="sequenceVisible" :title="curSequenceId" width="90%">
        <div class="fasta-sequence">
            {{ fastaSequence.substring(0, seq_start) }}
            <span class="highlighted">{{ fastaSequence.substring(seq_start, seq_end) }}</span>
            {{ fastaSequence.substring(seq_end) }}
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTag, NTooltip } from 'naive-ui'

import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'

import {
    transcripthubOrganismRefOptions,
    transcripthubFeatureRefOptions,
    transcripthubSourceRefOptions,
} from '@/utils/filteroption'
import { transcripthubSourceColor, transcripthubFeatureColor } from '@/utils/color'

const router = useRouter()
const loading = ref(false)
const sequenceVisible = ref(false)

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
const fastaSequence = ref()
const seq_start = ref(0)
const seq_end = ref(0)
const curSequenceId = ref()

type RowData = {
    id: number
    organism: string
    record: string
    seqname: string
    source: string
    feature: string
    start: number
    end: number
    score: number
    strand: string
    frame: string
    attribute: string
}

const pagevalue = ref(1)
const pageSize = ref(20)

const Antigendata = ref()
const url = ref(`/transcripthub/annotation/`)

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

const show_sequence = async (row: any) => {
    try {
        const response = await axios.get('/transcripthub/annotation/sequence/', {
            baseURL: '/api',
            timeout: 100000,
            params: {
                id: row.id,
            },
        })
        const { data } = response
        fastaSequence.value = data.genome_sequence
        seq_start.value = data.start
        seq_end.value = data.end
    } catch (error) {
        fastaSequence.value = 'Not provided'
        console.error('Failed to load sequence:', error)
    }
    curSequenceId.value = row.seqname
    sequenceVisible.value = true
}

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
    Maindata.value = data
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
    organism: 100,
    record: 150,
    seqname: 100,
    source: 100,
    feature: 100,
    start: 100,
    end: 100,
    score: 100,
    strand: 100,
    frame: 100,
    attribute: 300,
    action: 100,
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Organism' }), 'Organism')
        },
        key: 'organism',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.organism,
        filter: true,
        filterOptions: transcripthubOrganismRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Record' }), 'Record')
        },
        key: 'record',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.record,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Seqname' }),
                'The name of the sequence where the feature is located.'
            )
        },
        key: 'seqname',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.seqname,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Source' }),
                'The algorithm or procedure that generated the feature. This is typically the name of a software or database.'
            )
        },
        key: 'source',
        align: 'center',
        width: columnWidth.source,
        filter: true,
        filterOptions: transcripthubSourceRefOptions,
        render(row: any) {
            return h('div', {}, [
                h(
                    NTag,
                    {
                        type: transcripthubSourceColor(row.source),
                        size: 'small',
                    },
                    {
                        default: () => row.source,
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Feature' }),
                'The feature type name, like “gene” or “exon”. In a well-structured GFF file, all the children’s features always follow their parents in a single block (so all exons of a transcript are put after their parent “transcript” feature line and before any other parent transcript line). In GFF3, all features and their relationships should be compatible with the standards released by the Sequence Ontology Project.'
            )
        },
        key: 'feature',
        align: 'center',
        width: columnWidth.feature,
        ellipsis: {
            tooltip: true,
        },
        filter: true,
        filterOptions: transcripthubFeatureRefOptions,
        render(row: any) {
            return h('div', {}, [
                h(
                    NTag,
                    {
                        type: transcripthubFeatureColor(row.feature),
                        size: 'small',
                    },
                    {
                        default: () => row.feature,
                    }
                ),
            ])
        },
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Start' }),
                'Genomic start of the feature, with a 1-base offset. This is in contrast with other 0-offset half-open sequence formats, like BED.'
            )
        },
        key: 'start',
        align: 'center',
        width: columnWidth.start,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'End' }),
                'Genomic end of the feature, with a 1-base offset. This is the same end coordinate as it is in 0-offset half-open sequence formats, like BED.'
            )
        },
        key: 'end',
        align: 'center',
        width: columnWidth.end,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Score' }),
                'Numeric value that generally indicates the confidence of the source in the annotated feature. A value of “.” (a dot) is used to define a null value.'
            )
        },
        key: 'score',
        align: 'center',
        width: columnWidth.score,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Strand' }),
                'A single character indicates the strand of the feature. This can be “+” (positive, or 5′->3′), “-“, (negative, or 3′->5′), “.” (undetermined), or “?” for features with relevant but unknown strands.'
            )
        },
        key: 'strand',
        align: 'center',
        width: columnWidth.strand,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Frame' }),
                'Phase of CDS features; it can be either one of 0, 1, 2 (for CDS features) or “.” (for everything else). See the section below for a detailed explanation.'
            )
        },
        key: 'frame',
        align: 'center',
        width: columnWidth.frame,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Attribute' }),
                'A list of tag-value pairs separated by a semicolon with additional information about the feature.'
            )
        },
        key: 'attribute',
        align: 'center',
        width: columnWidth.attribute,
    },
    {
        title: 'Action',
        key: 'action',
        align: 'center',
        width: columnWidth.action,
        fixed: 'right',
        render(row: any) {
            return h('div', [
                h(
                    NButton,
                    {
                        strong: true,
                        size: 'small',
                        type: 'info',
                        onClick: () => show_sequence(row),
                    },
                    { default: () => 'Show Sequence' }
                ),
            ])
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

<style scoped>
.fasta-sequence {
    font-family: monospace;
    white-space: pre-wrap;
    word-break: break-all;
    font-weight: bold;
}

.highlighted {
    color: blue;
    font-weight: bold;
}
</style>
