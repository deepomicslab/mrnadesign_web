<meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />

<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Sample Detail Information</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="download">
                        <template #icon>
                            <n-icon>
                                <di />
                            </n-icon>
                        </template>
                        Download Sample Data
                    </el-button>
                </div>
            </div>
            <el-descriptions
                class="w-350 text-xl mt-8"
                :column="2"
                size="large"
                border
                v-loading="loaddata"
            >
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Sample ID</div>
                    </template>
                    {{ sampleDetail.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Tissue Type</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ sampleDetail.tissue_type }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Tissue Type Detail</div>
                    </template>

                    {{ sampleDetail.tissue_type_detail }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Subject ID</div>
                    </template>
                    {{ sampleDetail.subject_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Gender</div>
                    </template>
                    {{ sampleDetail.gender }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Age</div>
                    </template>
                    {{ sampleDetail.min_age - sampleDetail.max_age }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Death Circumstances</div>
                    </template>
                    {{ sampleDetail.death_circumstances }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Dataset ID</div>
                    </template>
                    {{ sampleDetail.dataset_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Dataset Name</div>
                    </template>
                    {{ sampleDetail.dataset_name }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <!--   Here is the div tag for genome browser   -->
        <div class="w-330 mt-15 ml-10" v-loading="loadBrowser">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Browse Assembled Transcripts</div>
            </div>
            <div>
                <JBrowse />
            </div>
        </div>
        <div class="w-330 mt-15 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Related Expression Records</div>
            </div>
            <div class="w-350" v-loading="loaddata">
                <n-data-table
                    :data="expressionRecordList"
                    :columns="expressionRecordColumns"
                    :pagination="pagination"
                    :max-height="250"
                    :row-key="sampleRowKey"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { CloudDownloadOutline as di } from '@vicons/ionicons5'
//
import axios from 'axios'
import { NTag } from 'naive-ui'
import JBrowse from '../../../../components/JBrowse.vue'

const loaddata = ref(false)
const loadBrowser = ref(false)
const route = useRoute()
const sample_id = computed(() => route.query?.id as number)
// const tracks = ref(tracks_config)

const sample_data = ref({
    id: 1,
    name: '',
    tissue_type: '',
    tissue_type_detail: '',
    subject_id: '',
    gender: '',
    min_age: '',
    max_age: '',
    death_circumstances: '',
    dataset_id: '',
    dataset_name: '',
})
const expressionRecordData = ref([] as any[])
const expressionRecordList = computed(() => expressionRecordData.value)

const downloadphagedialogVisible = ref(false)

const downloadtype = ref('')
const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const download = () => {
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [sample_id.value]
}

onBeforeMount(async () => {
    loaddata.value = true
    loadBrowser.value = true
    const response = await axios.get(`/isoformdb/samples/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: sample_id.value,
        },
    })
    const { data } = response
    sample_data.value = data

    const response1 = await axios.get(`/isoformdb/expression/search/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            sample_id: sample_id.value,
        },
    })

    expressionRecordData.value = response1.data
    loaddata.value = false
    loadBrowser.value = false
})

const sampleDetail = computed(() => sample_data.value)

type ExpressionRecordRowData = {
    id: number
    gene_id: number
    gene_id_str: string
    transcript_id: number
    transcript_id_str: string
    sample_id: number
    sample_id_str: string
    cov: number
    fpkm: number
    tpm: number
}

const sampleRowKey = (row: RowData) => {
    return row.id
}

const createExpressionRecordColumns = (): DataTableColumns<ExpressionRecordRowData> => [
    {
        type: 'selection',
    },

    {
        title: 'Gene ID',
        key: 'gene_id_str',
        align: 'center',
        width: '120px',
    },
    {
        title: 'Transcript ID',
        key: 'transcript_id_str',
        align: 'center',
        width: '120px',
    },
    {
        title: 'Coverage',
        key: 'cov',
        align: 'center',
        width: '120px',
    },
    {
        title: 'FPKM',
        key: 'fpkm',
        align: 'center',
        width: '120px',
    },
    {
        title: 'TPM',
        key: 'tpm',
        align: 'center',
        width: '120px',
    },
]
const expressionRecordColumns = createExpressionRecordColumns()

const pagination = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    pageSizes: [30, 50, 100],
    onChange: (page: number) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize: number) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    },
})
</script>
