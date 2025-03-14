<template>
    <div class="flex flex-col mx-1/10 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">Isoform Information</div>
                <div class="mt-1.5 ml-10">
                    <el-button class="ml-5" @click="download">
                        <template #icon>
                            <n-icon>
                                <di />
                            </n-icon>
                        </template>
                        Download Isoform Data
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
        <!--   Here is the div tag for genome browser   -->
        <div class="w-330 mt-15 ml-10" v-loading="loadBrowser">
            <div class="flex flex-row w-350 border-b-2 border-gray-300">
                <div class="text-4xl font-500 mb-8">ViolinPlot</div>
            </div>
            <div>
                <Violinplot />
            </div>
        </div>
    </div>

    <!--  the following code is used to download isoform information -->
    <el-dialog
        v-model="downloadphagedialogVisible"
        title="Select download data type"
        width="30%"
        align-center
    >
        <div>
            <el-checkbox-group v-model="checkList" :max="1">
                <el-checkbox label="Download FASTA Data" />
                <el-checkbox label="Download GFF3 Data" />
                <el-checkbox label="Download Meta Data" />
            </el-checkbox-group>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="downloadphagedialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="downloadrequest">Download</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable camelcase */
import { CloudDownloadOutline as di } from '@vicons/ionicons5'
//
import axios from 'axios'
import { NTag } from 'naive-ui'
import { useIsoformStore } from '@/store/isoform'
import Violinplot from '../../../../components/ViolinPlot.vue'

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

const downloadphagedialogVisible = ref(false)

const downloadtype = ref('')
const checkList = ref([] as any[])
const checkedRowKeysRef = ref<DataTableRowKey[]>([])

const downloadrequest = async () => {
    if (checkList.value.length === 0) {
        window.$message.warning('Please select download data type', {
            closable: true,
            duration: 5000,
        })
    } else {
        if (checkList.value.includes('Download Meta Data')) {
            window.open(`/api/phage/meta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download FASTA Data')) {
            window.open(`/api/phage/fasta/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
        if (checkList.value.includes('Download GFF3 Data')) {
            window.open(`/api/phage/gff/?phageid=${checkedRowKeysRef.value[0]}`, '_blank')
        }
    }
}

const download = () => {
    downloadtype.value = 'single'
    downloadphagedialogVisible.value = true
    checkedRowKeysRef.value = [isoformid.value]
}

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
