<template>
    <div class="flex flex-row justify-between">
        <el-menu
            :default-active="dataset"
            class="el-menu-demo h-14 mt-2 w-100/100"
            mode="horizontal"
            @select="handleSelectSet"
        >
            <el-menu-item index="tantigen" class="text-lg">Tantigen</el-menu-item>
            <el-menu-item index="three_utr" class="text-lg">3'UTR</el-menu-item>
        </el-menu>
    </div>
    <div class="h-220 flex flex-col py-10 px-30">
        <div v-loading="loading" class="h-160 mb-2">
            <n-data-table
                :columns="columns"
                :data="tableList"
                :row-key="rowKey"
                :scroll-x="1000"
                :max-height="1000"
                @update:checked-row-keys="handleCheck"
                @update:sorter="handleSorterChange"
            />
        </div>
        <div class="flex flex-row justify-center mt-10 mb-2">
            <n-pagination
                class="mr-35"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="10"
                :page-sizes="[10, 20, 50]"
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
            <el-button size="large" type="primary" @click="clearSelection">Clear</el-button>
            <el-button size="large" type="primary" @click="confirmSelection">Confirm</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import { ref, defineEmits } from 'vue'

// const props = defineProps<{
//     selectionDialogVisible: boolean
//     inputBlocktoPass: { utr3: string; cds: string; utr5: string }
// }>()
// const { selectionDialogVisible, inputBlocktoPass } = toRefs(props)
const inputBlocktoPass = ref({ utr3: '', cds: '', utr5: '' })
const emit = defineEmits(['selectionDialogVisible', 'inputBlocktoPass'])

const loading = ref(false)
const url = ref('/tantigen/')
const dataset = ref('tantigen')

const pagevalue = ref(1)
const pageSize = ref(10)

const sorter_dict = ref('')

const tableData = ref()

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

type buttonClickedStatesType = {
    seq_3_rowid: number
    seq_3: string
    cds_rowid: number
    cds: string
    seq_5_rowid: number
    seq_5: string
}
const buttonClickedStates = ref<buttonClickedStatesType>({
    seq_3_rowid: 0,
    seq_3: '',
    cds_rowid: 0,
    cds: '',
    seq_5_rowid: 0,
    seq_5: '',
})

const clearSelection = () => {
    buttonClickedStates.value.seq_3_rowid = 0
    buttonClickedStates.value.seq_3 = ''
    buttonClickedStates.value.cds_rowid = 0
    buttonClickedStates.value.cds = ''
    buttonClickedStates.value.seq_5_rowid = 0
    buttonClickedStates.value.seq_5 = ''
}
const confirmSelection = () => {
    inputBlocktoPass.value.utr3 = buttonClickedStates.value.seq_3
    inputBlocktoPass.value.cds = buttonClickedStates.value.cds
    inputBlocktoPass.value.utr5 = buttonClickedStates.value.seq_5
    emit('selectionDialogVisible', false)
    emit('inputBlocktoPass', inputBlocktoPass.value)
}

const handleSelectSet = async (value: any) => {
    url.value = `/${value}/`

    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    tableData.value = data
    loading.value = false
}

type RowData = {
    id: number
    seq_5: string
    cds: string
    seq_3: string
}

const rowKey = (row: RowData) => {
    return row.id
}

onBeforeMount(async () => {
    loading.value = true
    console.log('url', url.value)
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value,
            pagesize: pageSize.value,
        },
    })
    const { data } = response
    tableData.value = data
    loading.value = false
})

const tableList = computed(() => {
    return tableData.value?.results
})

const column_width = {
    id: 25,
    seq_3: 100,
    cds: 100,
    seq_5: 100,
    tick: 20,
}

const select = (row: number, col: string, seq: string) => {
    console.log(row)
    if (col === 'seq_3') {
        inputBlocktoPass.value.utr3 = seq
    } else if (col === 'cds') {
        inputBlocktoPass.value.cds = seq
    } else if (col === 'seq_5') {
        inputBlocktoPass.value.utr5 = seq
    }
}

const render_button = (row: any, col: string) => {
    return h(
        'div',
        {
            style: {
                display: 'flex',
                justifyContent: 'center',
            },
        },
        [
            h(
                NButton,
                {
                    strong: true,
                    size: 'small',
                    style: {
                        backgroundColor:
                            buttonClickedStates.value[
                                `${col}_rowid` as keyof buttonClickedStatesType
                            ] === row.id
                                ? '#2196F3'
                                : '#d6d6d6',
                        color: '#FFFFFF',
                    },
                    onClick: () => {
                        buttonClickedStates.value[`${col}_rowid` as keyof buttonClickedStatesType] =
                            row.id
                        buttonClickedStates.value[col as keyof buttonClickedStatesType] = row[col]
                        select(row.id, col, row[col])
                    },
                },
                { default: () => '\u2713' }
            ),
        ]
    )
}

const createColumns = (): DataTableColumns<RowData> => [
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
            return renderTooltip(h('div', null, { default: () => "3'UTR" }), 'seq_3')
        },
        key: 'seq_3',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: column_width.seq_5,
    },
    {
        title: () => renderTooltip(h('div', null, ''), ''),
        key: 'seq_3',
        align: 'center',
        width: column_width.tick,
        render(row: any) {
            return render_button(row, 'seq_3')
        },
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
        title: () => renderTooltip(h('div', null, ''), ''),
        key: 'cds',
        align: 'center',
        width: column_width.tick,
        render(row: any) {
            return render_button(row, 'cds')
        },
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => "5'UTR" }), 'seq_5')
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
        title: () => renderTooltip(h('div', null, ''), ''),
        key: 'seq_5',
        align: 'center',
        width: column_width.tick,
        render(row: any) {
            return render_button(row, 'seq_5')
        },
    },
]
const columns = createColumns()

const axios_get_response = async (page_offset: number) => {
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + page_offset,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    tableData.value = data
}

const count = computed(() => tableData.value?.count)

const nextPage = async () => {
    loading.value = true
    await axios_get_response(1)
    loading.value = false
}
const prevPage = async () => {
    loading.value = true
    await axios_get_response(-1)
    loading.value = false
}

const pagechange = async () => {
    loading.value = true
    await axios_get_response(0)
    loading.value = false
}
const pagesizechange = async () => {
    loading.value = true
    await axios_get_response(0)
    loading.value = false
}

const handleSorterChange = async (sorter: string) => {
    loading.value = true
    sorter_dict.value = sorter
    await axios_get_response(0)
    loading.value = false
}
</script>
