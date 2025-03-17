<meta http-equiv="Permissions-Policy" content="xr-spatial-tracking=(self)" />

<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
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

        <div class="w-330 mt-15 ml-10" v-loading="loadBrowser">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Browse Assembled Transcripts</div>
            </div>
            <div>
                <JBrowse />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
//
import axios from 'axios'
import { NTag } from 'naive-ui'
import JBrowse from '../../../../components/JBrowse.vue'

const loaddata = ref(false)
const loadBrowser = ref(false)
const route = useRoute()
const sample_id = computed(() => route.query?.id as number)

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

    loaddata.value = false
    loadBrowser.value = false
})

const sampleDetail = computed(() => sample_data.value)

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
