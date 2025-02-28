<meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />
<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-0">
            <div class="flex flex-row w-400 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Antigen Screening Result Display</div>
                <div class="mt-1.5 ml-10">
                    <n-space horizontal>
                        <el-button class="ml-5" @click="downloadresult">
                            <template #icon>
                                <n-icon>
                                    <downicon />
                                </n-icon>
                            </template>
                            Download Analysis Result
                        </el-button>
                    </n-space>
                </div>
            </div>
        </div>

        <div class="flex flex-col mx-0 justify-start">
            <el-descriptions
                class="w-400 text-xl mt-10"
                :column="2"
                size="large"
                border
                v-loading="loading"
            >
                <el-descriptions-item :width="80">
                    <template #label>
                        <div class="cell-item">min length</div>
                    </template>
                    {{ infoData && infoData.peptide_len_min }}
                </el-descriptions-item>
                <el-descriptions-item :width="80">
                    <template #label>
                        <div class="cell-item">max length</div>
                    </template>
                    {{ infoData && infoData.peptide_len_max }}
                </el-descriptions-item>
                <el-descriptions-item :width="165">
                    <template #label>
                        <div class="cell-item">Input Protein Sequence</div>
                    </template>
                    {{ infoData && infoData.input_fasta }}
                </el-descriptions-item>
            </el-descriptions>

            <div class="w-400 mt-10 ml-0">
                <div v-loading="loading" class="mb-2">
                    <n-data-table
                        :columns="columns"
                        :data="mainData"
                        :row-key="rowKey"
                        :scroll-x="1600"
                        :max-height="500"
                    />
                </div>
            </div>
        </div>

        <div class="mt-5 ml-0">
            <div class="flex flex-row w-200">
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
import axios from 'axios'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'

import type { DataTableColumns } from 'naive-ui'
import { NButton, NTooltip } from 'naive-ui'
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

type MainType = {
    start: number
    len: number
    peptide: string
    probability: number
    label: number
}

type InfoType = {
    input_fasta: string
    peptide_len_min: number
    peptide_len_max: number
}

const mainData = ref([] as MainType[])
const infoData = ref<InfoType>({})
const shownseq = ref('')

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

const rowKey = (row: MainType) => {
    return `${row.start}_${row.len}`
}

const loading = ref(false)

onBeforeMount(async () => {
    loading.value = true
    const response = await axios.get(`/tasks/antigenscreening_result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    mainData.value = data.results
    infoData.value = data.info
    loading.value = false

    if (mainData.value.length > 0) {
        shownseq.value = mainData.value[0].peptide
    }
})

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
    start: 100,
    len: 100,
    peptide: 200,
    probability: 100,
    label: 100,
    actions: 200,
}

const createColumns = (): DataTableColumns<MainType> => [
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Start Index' }),
                'Start Index of the Input Protein Sequence'
            )
        },
        key: 'start',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.start,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Peptide Length' }),
                'Length of the Peptide'
            )
        },
        key: 'len',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.len,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Peptide Sequence' }),
                'Peptide Sequence of a window'
            )
        },
        key: 'peptide',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.peptide,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Probability' }),
                'Probability of being an epitope'
            )
        },
        key: 'probability',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.probability,
    },
    {
        title() {
            return renderTooltip(
                h('div', null, { default: () => 'Label' }),
                '1 for epitope, 0 for non-epitope'
            )
        },
        key: 'label',
        align: 'center',
        ellipsis: {
            tooltip: true,
        },
        width: columnWidth.label,
    },
    {
        title: 'Actions',
        key: 'actions',
        align: 'center',
        width: columnWidth.actions,
        render(row: any) {
            return h(
                'div',
                {
                    style: {
                        display: 'center', // center | flex
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
                                shownseq.value = row.peptide
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
