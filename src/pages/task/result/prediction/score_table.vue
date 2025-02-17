<template>
    <div class="h-220 flex flex-col py-10 px-30">
        <div v-loading="loading" class="h-160 mb-2">
            <n-data-table
                :columns="columns"
                :data="tableList"
                :row-key="rowKey"
                :scroll-x="1500"
                :max-height="700"
                @update:sorter="handleSorterChange"
                @update:filters="handleFilterChange"
            />
        </div>
        <div class="flex flex-row justify-center mt-10 mb-2">
            <n-pagination
                class="mr-35"
                show-size-picker
                :default-page-size="10"
                show-quick-jumper
                :item-count="count"
            ></n-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import axios from 'axios'
import { ref } from 'vue'

import {
    predictionScoreTableSrcTableRefOptions,
    predictionScoreTableSrcFieldRefOptions,
} from '@/utils/filteroption'

const props = defineProps<{
    score_subtask_name: string
    taskid: string
}>()
const { score_subtask_name, taskid } = toRefs(props)

const loading = ref(false)
const url = ref('/analyze/get_str_similarity/')

const sorter_dict = ref('')
const filter_dict = ref('')

const tableData = ref()

const columns = ref()

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

type RowData = {
    src_id: string
    src_table: number
    src_field: string
    seq: string
    similarity: number
    overall_gc: number
    codon_usage_efficiency_index: number
    tis: number
    rna_interference: number
    rna_structure: number
    ires_number: number
    degscore: number
}

const rowKey = (row: RowData) => {
    return row.src_id + row.src_table + row.src_field
}

const tableList = computed(() => {
    return tableData.value?.results
})

const column_width = {
    src_id: 25,
    src_table: 25,
    src_field: 25,
    seq: 25,
    similarity: 25,
    overall_gc: 25,
    codon_usage_efficiency_index: 25,
    tis: 25,
    rna_interference: 25,
    rna_structure: 25,
    ires_number: 25,
    degscore: 25,
}

const createTantigenColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Src Table ID' }),
                'Source Table ID'
            )
        },
        key: 'src_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.src_id,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Src Table' }), 'Source Table')
        },
        key: 'src_table',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.src_table,
        filter: true,
        filterOptions: predictionScoreTableSrcTableRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Src Field' }), 'Source Field')
        },
        key: 'src_field',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.src_field,
        filter: true,
        filterOptions: predictionScoreTableSrcFieldRefOptions,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Sequence' }), 'Sequence')
        },
        key: 'seq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.seq,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Similarity' }), 'Similarity')
        },
        key: 'similarity',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.similarity,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Overall GC' }), 'Overall GC')
        },
        key: 'overall_gc',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.overall_gc,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Codon Usage Efficiency Index' }),
                'Codon Usage Efficiency Index'
            )
        },
        key: 'codon_usage_efficiency_index',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.codon_usage_efficiency_index,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TIS' }), 'TIS')
        },
        key: 'tis',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.tis,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'RNA Interference' }),
                'RNA Interference'
            )
        },
        key: 'rna_interference',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.rna_interference,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'RNA Structure' }),
                'RNA Structure'
            )
        },
        key: 'rna_structure',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.rna_interference,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'IRES Number' }), 'IRES Number')
        },
        key: 'ires_number',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.ires_number,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Degscore' }), 'Degscore')
        },
        key: 'degscore',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.degscore,
        sorter: true,
    },
]

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            score_subtask_name: score_subtask_name.value,
            taskid: taskid.value,
        },
    })
    const { data } = response
    tableData.value = data
    console.log('tableData', tableData.value)
    loading.value = false
})

columns.value = createTantigenColumns()

const axios_get_response = async () => {
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            score_subtask_name: score_subtask_name.value,
            taskid: taskid.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    tableData.value = data
}

const count = computed(() => tableData.value?.count)

const handleSorterChange = async (sorter: string) => {
    loading.value = true
    sorter_dict.value = sorter
    await axios_get_response()
    loading.value = false
}
const handleFilterChange = async (filter: string) => {
    loading.value = true
    filter_dict.value = filter
    await axios_get_response()
    loading.value = false
}
</script>
