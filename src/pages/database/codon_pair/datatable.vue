<template>
    <div v-loading="loading" class="h-200 mb-2">
        <n-data-table
            :columns="columns"
            :data="MainList"
            :row-key="rowKey"
            :scroll-x="300"
            :max-height="1000"
            @update:checked-row-keys="handleCheck"
            @update:sorter="handleSorterChange"
        />
    </div>
    <div>
        <n-pagination
            class="mt-10 ml-0 mb-2"
            v-model:page="pagevalue"
            v-model:pageSize="pageSize"
            show-size-picker
            :default-page-size="pageSize"
            :page-sizes="[pageSize, 50, 100]"
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
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'

import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import { h, ref } from 'vue'
import { CodonpairDictReversed } from '@/utils/type'

const loading = ref(false)

const props = defineProps<{
    calculation_type: string
    tissue: keyof typeof CodonpairDictReversed
}>()
const { calculation_type, tissue } = toRefs(props)

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

type RowData = {
    id: number
    Dinucleotide: string
    tissue: string
    calculation_type: string
    value: number
}

const pagevalue = ref(1)
const pageSize = ref(15)

const Maindata = ref()
const MainList = ref()
const columns = ref()

const columnWidth = {
    Dinucleotide: 30,
    value: 30,
}

const createColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Dinucleotide' }),
                'Junction Position'
            )
        },
        key: 'Dinucleotide',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.Dinucleotide,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => tissue.value }), tissue.value)
        },
        key: CodonpairDictReversed[tissue.value],
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.value,
        sorter: true,
    },
]

const main_get_response = async () => {
    loading.value = true
    const response = await axios.get(`/codon_pair/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            tissue: CodonpairDictReversed[tissue.value],
            calculation_type: calculation_type.value,
        },
    })
    const { data } = response
    Maindata.value = data
    MainList.value = data.results
    columns.value = createColumns()
    loading.value = false
}

onBeforeMount(async () => {
    main_get_response()
})

watch(tissue, () => {
    main_get_response()
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    main_get_response()
}
const prevPage = async () => {
    main_get_response()
}

const pagechange = async () => {
    main_get_response()
}
const pagesizechange = async () => {
    main_get_response()
}

const handleSorterChange = async (sorter: any) => {
    sorter_dict.value = sorter
    main_get_response()
}
const rowKey = (row: RowData) => {
    return row.id
}
</script>
