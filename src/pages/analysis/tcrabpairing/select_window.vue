<template>
    <div class="flex flex-row justify-between">
        <el-menu class="el-menu-demo h-14 mt-2 w-100/100" mode="horizontal">
            <el-menu-item index="tcrabpairing" class="text-lg">
                TCR Alpha-Beta Chain Pairing
            </el-menu-item>
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
                :default-page-size="5"
                :page-sizes="[5, 20, 50]"
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

const props = defineProps({
    chain: String,
    element: String,
})

const inputBlocktoPass = ref({ seq: '' })
const emit = defineEmits(['selectionDialogVisible', 'inputBlocktoPass'])

const loading = ref(false)
const url = ref('/tcrabpairing/')

const pagevalue = ref(1)
const pageSize = ref(10)

const sorter_dict = ref('')

const tableData = ref()

const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const columns = ref()

type buttonClickedStatesType = {
    [key: string]: string | number
    chain: string
    chain_rowid: number
    element: string
    element_rowid: number
}
const buttonClickedStates = ref<buttonClickedStatesType>({
    chain: '',
    chain_rowid: 0,
    element: '',
    element_rowid: 0,
})

function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}
const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const clearSelection = () => {
    buttonClickedStates.value = {
        chain: '',
        chain_rowid: 0,
        element: '',
        element_rowid: 0,
    }
}
const confirmSelection = () => {
    emit('selectionDialogVisible', false)
    emit('inputBlocktoPass', inputBlocktoPass.value)
}

type RowData = {
    id: number
    source: string
    barcode: string
    Alpha: string
    Beta: string
    umisA: number
    umisB: number
    clonotype_freq: number
    TRAV: string
    TRAJ: string
    cdr3A: string
    cdr3_ntA: string
    readsA: number
    TRBV: string
    TRBJ: string
    cdr3B: string
    cdr3_ntB: string
    readsB: number
    raw_clonotype_id: string
}

const rowKey = (row: { id: any }) => {
    return row.id
}

const tableList = computed(() => {
    return tableData.value?.results
})

const columnWidth = {
    long: 100,
    short: 50,
    mini: 20,
}

const select = (row: number, col: string, seq: string) => {
    console.log(row, col, seq)
    inputBlocktoPass.value.seq = seq
}

const render_button = (row: any, col: string, data_col: string) => {
    // 把数据里的 data_col 赋值给 button 里的 col
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
                        buttonClickedStates.value[col as keyof buttonClickedStatesType] =
                            row[data_col]
                        select(row.id, col, row[col])
                    },
                },
                { default: () => '\u2713' }
            ),
        ]
    )
}

const createTantigenColumns = (): DataTableColumns<RowData> => [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Source' }), 'Source')
        },
        key: 'source',
        align: 'center',
        fixed: 'left',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Barcode' }), 'Barcode')
        },
        key: 'barcode',
        align: 'center',
        sorter: 'default',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
    },
]

const updateColumns = () => {
    columns.value = createTantigenColumns()
    if (props.chain === 'Alpha') {
        columns.value.push(
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'TRAV' }), 'TRAV')
                },
                key: 'TRAV',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
            },
            ...(props.chain === 'Alpha' && props.element === 'V Gene'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'TRAV',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'TRAV', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'TRAJ' }), 'TRAJ')
                },
                key: 'TRAJ',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
            },
            ...(props.chain === 'Alpha' && props.element === 'J Gene'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'TRAJ',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'TRAJ', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'cdr3A' }), 'cdr3A')
                },
                key: 'cdr3A',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
                ellipsis: {
                    tooltip: true,
                },
            },
            ...(props.chain === 'Alpha' && props.element === 'CDR3'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'cdr3A',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'cdr3A', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'cdr3_ntA' }), 'cdr3_ntA')
                },
                key: 'cdr3_ntA',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
                ellipsis: {
                    tooltip: true,
                },
            },
            ...(props.chain === 'Alpha' && props.element === 'CDR3nt'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'cdr3_ntA',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'cdr3_ntA', 'seq')
                          },
                      },
                  ]
                : [])
        )
    } else {
        columns.value.push(
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'TRBV' }), 'TRBV')
                },
                key: 'TRBV',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
            },
            ...(props.chain === 'Beta' && props.element === 'V Gene'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'TRBV',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'TRBV', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'TRBJ' }), 'TRBJ')
                },
                key: 'TRBJ',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
            },
            ...(props.chain === 'Beta' && props.element === 'J Gene'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'TRBJ',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'TRBJ', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'cdr3B' }), 'cdr3B')
                },
                key: 'cdr3B',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
                ellipsis: {
                    tooltip: true,
                },
            },
            ...(props.chain === 'Beta' && props.element === 'CDR3'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'cdr3B',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'cdr3B', 'seq')
                          },
                      },
                  ]
                : []),
            {
                title() {
                    return renderTooltip(h('div', null, { default: () => 'cdr3_ntB' }), 'cdr3_ntB')
                },
                key: 'cdr3_ntB',
                align: 'center',
                width: columnWidth.short,
                sorter: true,
                ellipsis: {
                    tooltip: true,
                },
            },
            ...(props.chain === 'Beta' && props.element === 'CDR3nt'
                ? [
                      {
                          title() {
                              return renderTooltip(
                                  h('div', null, { default: () => 'Action' }),
                                  'Action'
                              ) // Added proper title
                          },
                          key: 'cdr3_ntB',
                          align: 'center',
                          width: columnWidth.mini,
                          render(row: any) {
                              return render_button(row, 'cdr3_ntB', 'seq')
                          },
                      },
                  ]
                : [])
        )
    }
}

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
    tableData.value = data
    updateColumns()
    loading.value = false
})

watch(props, () => {
    updateColumns()
    console.log('>>>>>>>>>>>>>>>>>>>> Props changed:', props.value)
})

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
