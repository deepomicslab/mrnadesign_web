<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Isoform Information</div>
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
                        <div class="cell-item">Isoform ID</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ isoformdetail.isoform_id }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Gene ID</div>
                    </template>
                    {{ isoformdetail.gene_id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Gene Name</div>
                    </template>
                    {{ isoformdetail.gene_name }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Chromosome</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ isoformdetail.chromosome }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Start Position</div>
                    </template>
                    {{ isoformdetail.start_pos }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">End Position</div>
                    </template>
                    {{ isoformdetail.end_pos }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Isoform Type</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ isoformdetail.isoform_type }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Exon Count</div>
                    </template>
                    {{ isoformdetail.exon_count }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Strandness</div>
                    </template>
                    <n-tag type="primary" size="small">
                        {{ isoformdetail.strand }}
                    </n-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Junction position</div>
                    </template>
                    {{ isoformdetail.junction_position }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Create Time</div>
                    </template>
                    {{ isoformdetail.create_time }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Update Time</div>
                    </template>
                    {{ isoformdetail.update_time }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
//
import axios from 'axios'
import { NTag } from 'naive-ui'
import { useIsoformStore } from '@/store/isoform'

const isoformStore = useIsoformStore()
const loaddata = ref(false)
const route = useRoute()
const isoformid = computed(() => route.query?.isoformid as number)

const isoformdata = ref({
    id: 1,
    isoform_id: '',
    gene_id: '',
    gene_name: '',
    chromosome: '',
    start_pos: 0,
    end_pos: 0,
    junction_position: '',
    strand: '',
    isoform_type: '',
    exon_count: 0,
    create_time: '',
    update_time: '',
})

onBeforeMount(async () => {
    loaddata.value = true
    isoformStore.isoformdataloaded = false
    isoformStore.isoformid = isoformid.value
    const response = await axios.get(`/isoformdb/isoforms/detail/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: isoformid.value,
        },
    })
    const { data } = response
    isoformdata.value = data
    loaddata.value = false

    const response1 = await axios.get(`/isoformdb/isoforms/sequences/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            id: isoformid.value,
        },
    })

    isoformStore.isoformfastadata = response1.data
    isoformStore.isoformdataloaded = true
})

const isoformdetail = computed(() => isoformdata.value)

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
