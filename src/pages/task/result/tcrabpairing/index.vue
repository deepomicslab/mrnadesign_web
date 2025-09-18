<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">TCR Alpha-Beta Chain Pairing</div>
            <el-button class="ml-5" @click="downloadresult">
                <template #icon>
                    <n-icon>
                        <downicon />
                    </n-icon>
                </template>
                Download Analysis Result
            </el-button>
        </div>
        <div class="text-2xl font-400 mb-8 mt-6">Input</div>
        <div class="flex flex-row justify-between mt-6 ml-0 w-400">
            <div v-loading="loading" class="mb-20">
                <n-data-table
                    :columns="inputparamcolumns"
                    :data="inputparamlist"
                    :row-key="rowKey"
                    :scroll-x="700"
                    :max-height="2000"
                />
            </div>
        </div>
        <div class="text-2xl font-400 mb-8">Pairing Result</div>
        <div>
            <el-menu
                :default-active="flist"
                class="el-menu-demo"
                mode="horizontal"
                @select="change_flist_entry"
            >
                <el-menu-item v-for="t in flist" :key="t" :index="t">
                    {{ t }}
                </el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="mb-20">
            <n-data-table
                :columns="columns"
                :data="maindataList"
                :row-key="rowKey"
                :scroll-x="2600"
                :max-height="2000"
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

import { ref } from 'vue'
import axios from 'axios'
import type { DataTableColumns } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import { CloudDownloadOutline as downicon, ChevronBack, ChevronForward } from '@vicons/ionicons5'

import { decrypt } from '@/utils/crypto'

const maindata = ref()

const sorter_dict = ref('')
const filter_dict = ref('')
const activeTab = ref('second')

const cur_time = ref('')
const flist = ref<string[]>([])
const flist_entry = ref([] as string[])

const url = ref('/tasks/tcrabpairing_result/')

watch(activeTab, async () => {
    const today = new Date()
    cur_time.value = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
})

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})
type RowData = {
    id: string
}

const loading = ref(false)
const rowKey = (row: RowData) => {
    return row.id
}
const pagevalue = ref(1)
const pageSize = ref(20)

const get_response = async (page_offset: number) => {
    loading.value = true
    const response = await axios.get(url.value, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + page_offset,
            pagesize: pageSize.value,
            taskid: taskid.value,
            flist_entry: flist_entry.value[0] || '',
        },
    })
    const { data } = response
    maindata.value = data
    flist.value = data.flist
    loading.value = false
}

onBeforeMount(async () => {
    get_response(0)
})

const maindataList = computed(() => {
    return maindata.value?.results
})

const handleSorterChange = async (sorter: any) => {
    sorter_dict.value = sorter
    get_response(0)
}

const handleFilterChange = async (filter: any) => {
    filter_dict.value = filter
    get_response(0)
}

const downloadresult = () => {
    window.open(`/api/tasks/zip/?taskid=${taskid.value}`, '_blank')
}

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const inputparamlist = computed(() => {
    return maindata.value?.flist_details
})

const columnWidth = {
    long: 200,
    short: 100,
}

const blocks_for_control = [
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'source' }), 'source')
        },
        key: 'source',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'barcode' }), 'barcode')
        },
        key: 'barcode',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Alpha' }), 'Alpha')
        },
        key: 'Alpha',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Beta' }), 'Beta')
        },
        key: 'Beta',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'umisA' }), 'umisA')
        },
        key: 'umisA',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'umisB' }), 'umisB')
        },
        key: 'umisB',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'clonotype_freq' }),
                'clonotype_freq'
            )
        },
        key: 'clonotype_freq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRAV' }), 'TRAV')
        },
        key: 'TRAV',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRAJ' }), 'TRAJ')
        },
        key: 'TRAJ',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3A' }), 'cdr3A')
        },
        key: 'cdr3A',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3_ntA' }), 'cdr3_ntA')
        },
        key: 'cdr3_ntA',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'readsA' }), 'readsA')
        },
        key: 'readsA',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRBV' }), 'TRBV')
        },
        key: 'TRBV',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'TRBJ' }), 'TRBJ')
        },
        key: 'TRBJ',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3B' }), 'cdr3B')
        },
        key: 'cdr3B',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'cdr3_ntB' }), 'cdr3_ntB')
        },
        key: 'cdr3_ntB',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'readsB' }), 'readsB')
        },
        key: 'readsB',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'raw_clonotype_id' }),
                'raw_clonotype_id'
            )
        },
        key: 'raw_clonotype_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
        sorter: true,
    },
]
const columns = ref<DataTableColumns<RowData>>([])

columns.value = [...blocks_for_control]

const inputparamcolumns = ref<DataTableColumns<RowData>>([
    {
        title: 'seq_id',
        key: 'seq_id',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
    },
    {
        title: 'name',
        key: 'name',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
    },
    {
        title: 'chain',
        key: 'chain',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
    },
    {
        title: 'element',
        key: 'element',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.short,
    },

    {
        title: 'seq',
        key: 'seq',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.long,
    },
])

const change_flist_entry = async (key: any) => {
    flist_entry.value[0] = key
    get_response(0)
}
const count = computed(() => maindata.value?.count)

const nextPage = async () => {
    get_response(1)
}
const prevPage = async () => {
    get_response(-1)
}

const pagechange = async () => {
    get_response(0)
}
const pagesizechange = async () => {
    get_response(0)
}
</script>

<style scoped>
#myViewer {
    width: 100%;
    height: 600px;
    position: relative;
    overflow: scroll;
}
</style>
