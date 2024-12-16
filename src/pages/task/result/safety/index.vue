<!-- <meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" /> -->
<!-- <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" /> -->
<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-400 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Safety Result Display</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="downloadresult">
                        <template #icon>
                            <n-icon>
                                <downicon />
                            </n-icon>
                        </template>
                        Download Analysis Result
                    </el-button>
                </div>
            </div>

            <div class="flex flex-row justify-between mt-6 ml-0 w-400">
                <div v-loading="loading" class="mb-20">
                    <n-data-table
                        :columns="columns"
                        :data="safetydataList"
                        :row-key="rowKey"
                        :scroll-x="1200"
                        :max-height="2000"
                        @update:sorter="handleSorterChange"
                        @update:filters="handleFilterChange"
                    />
                </div>
            </div>
        </div>
        <div class="mt-5 ml-15">
            <div class="flex flex-row w-300">
                <div class="text-2xl font-500 mb-5">Protein Structure</div>
            </div>
            <div style="box-shadow: 0 0 64px #cfd5db" class="w-310 h-140 mt-5 ml-10 mb-20">
                <div id="myViewer">
                    <pdbe-molstar
                        :key="shownseq"
                        :custom-data-url="`/api/database/download_protein_cif/?protein_id=1&sequence=${shownseq}`"
                        custom-data-format="cif"
                        alphafold-view="true"
                        bg-color-r="255"
                        bg-color-g="255"
                        bg-color-b="255"
                        hide-selection-icon="true"
                        hide-animation-icon="true"
                    ></pdbe-molstar>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { ref } from 'vue'
import axios from 'axios'
import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import { decrypt } from '@/utils/crypto'

onMounted(async () => {
    const script1 = document.createElement('script')
    script1.src = '/esm/js/polyfill.min.js' // 'https://cdn.jsdelivr.net/npm/babel-polyfill/dist/polyfill.min.js'
    document.body.appendChild(script1)
    const script2 = document.createElement('script')
    script2.src = '/esm/js/webcomponents-lite.js' // 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-lite.js'
    document.body.appendChild(script2)
    const script3 = document.createElement('script')
    script3.src = '/esm/js/custom-elements-es5-adapter.js' // 'https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'
    document.body.appendChild(script3)
    const script4 = document.createElement('script')
    script4.src = '/esm/js/pdbe-molstar-component.js' // 'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar-component.js'
    document.body.appendChild(script4)

    const style = document.createElement('link')
    style.href = '/esm/css/pdbe-molstar.css' //  'https://cdn.jsdelivr.net/npm/pdbe-molstar@3.2.0/build/pdbe-molstar.css'
    style.type = 'text/css'
    style.rel = 'stylesheet'
    document.body.appendChild(style)
})

const safetydata = ref()
const shownseq = ref('')

const sorter_dict = ref('')
const filter_dict = ref('')
const activeTab = ref('second')

const cur_time = ref('')

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
    sequence: string
    toxicity_score: number
    toxicity: string
    allergenicity_score: number
    allergenicity: number
    antigenicity_score: number
    antigenicity: string
    s3_url: string
}
const loading = ref(false)
const rowKey = (row: RowData) => {
    return row.id
}

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tasks/safety_result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    safetydata.value = data
    loading.value = false

    shownseq.value = safetydata.value.results[0].sequence
})

const safetydataList = computed(() => {
    return safetydata.value?.results
})

const handleSorterChange = async (sorter: any) => {
    loading.value = true
    sorter_dict.value = sorter
    const response = await axios.get(`/tasks/safety_result/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
            sorter: sorter_dict.value,
        },
    })
    const { data } = response
    safetydata.value = data
    loading.value = false
}

const handleFilterChange = async (filter: any) => {
    loading.value = true
    filter_dict.value = filter
    const response = await axios.get(`/tasks/safety_result/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
            filter: filter_dict.value,
        },
    })
    const { data } = response
    safetydata.value = data
    loading.value = false
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

const columnWidth = {
    id: 100,
    sequence: 200,
    toxicity_score: 150,
    toxicity: 150,
    allergenicity_score: 150,
    allergenicity: 150,
    antigenicity_score: 150,
    antigenicity: 150,
    // s3_url: 100,
    actions: 200,
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
        width: columnWidth.id,
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
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Toxicity' }), 'toxicity')
        },
        key: 'toxicity',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.toxicity,
        filter: true,
        filterOptions: [
            {
                label: 'Toxin',
                value: 'Toxin',
            },
            {
                label: 'Non-Toxin',
                value: 'Non-Toxin',
            },
        ],
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Toxicity Score' }),
                'toxicity_score'
            )
        },
        key: 'toxicity_score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.toxicity_score,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Allergenicity' }),
                'allergenicity'
            )
        },
        key: 'allergenicity',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.allergenicity,
        filter: true,
        filterOptions: [
            {
                label: 'Allergen',
                value: 'Allergen',
            },
            {
                label: 'Non-Allergen',
                value: 'Non-Allergen',
            },
        ],
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Allergenicity Score' }),
                'allergenicity_score'
            )
        },
        key: 'allergenicity_score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.allergenicity_score,
        sorter: true,
    },
    {
        title() {
            return renderTooltip(h('div', null, { default: () => 'Antigenicity' }), 'antigenicity')
        },
        key: 'antigenicity',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.antigenicity,
        filter: true,
        filterOptions: [
            {
                label: 'Antigenic',
                value: 'Antigenic',
            },
            {
                label: 'Non-Antigenic',
                value: 'Non-Antigenic',
            },
        ],
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Antigenicity Score' }),
                'antigenicity_score'
            )
        },
        key: 'antigenicity_score',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.antigenicity_score,
        sorter: true,
    },
    {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        fixed: 'right',
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'flex', // center
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
                            onClick: () => {
                                shownseq.value = row.sequence
                            },
                        },
                        { default: () => 'View Structure Visualization' }
                    ),
                ]
            )
        },
    },
]
const columns = createColumns()
</script>

<style scoped>
#myViewer {
    width: 100%;
    height: 600px;
    position: relative;
    overflow: scroll;
}
</style>
