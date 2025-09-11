<template>
    <div class="flex flex-col mx-1/20 justify-start">
        <div class="w-300 mt-18 ml-10">
            <div class="flex flex-row w-400">
                <div class="text-4xl font-500 mb-8">TCRanno Result Display</div>
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
            <div class="text-2xl font-400 mb-8">Setting</div>
            <div class="flex flex-row justify-between mt-6 ml-0 w-400">
                <div v-loading="loading" class="mb-20">
                    <n-data-table
                        :columns="columns"
                        :data="safetydataList"
                        :row-key="rowKey"
                        :scroll-x="1200"
                        :max-height="2000"
                    />
                </div>
            </div>
            <div class="text-2xl font-400 mb-8">Select a plot:</div>
            <div class="ml-25 mt-5 flex mb-5">
                <div class="ml-5">
                    <n-radio-group v-model:value="showtype">
                        <n-radio-button value="tcr2org">Plots tcr2org</n-radio-button>
                        <n-radio-button value="tcr2ag">Plots tcr2ag</n-radio-button>
                        <n-radio-button value="tcr2ept">Plots tcr2ept</n-radio-button>
                    </n-radio-group>
                </div>
            </div>
            <div v-if="showtype === 'tcr2org'">
                <img
                    v-if="taskid && imageName"
                    class="mt-6 mb-6"
                    id="myViewer"
                    :src="imageUrl1"
                    alt="Description of image"
                />
            </div>
            <div v-if="showtype === 'tcr2ag'">
                <img
                    v-if="taskid && imageName"
                    class="mt-6 mb-6"
                    id="myViewer"
                    :src="imageUrl2"
                    alt="Description of image"
                />
            </div>
            <div v-if="showtype === 'tcr2ept'">
                <img
                    v-if="taskid && imageName"
                    class="mt-6 mb-6"
                    id="myViewer"
                    :src="imageUrl3"
                    alt="Description of image"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue'
import axios from 'axios'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import { useRoute } from 'vue-router'
import { decrypt } from '@/utils/crypto'

interface SafetyData {
    parameters?: Record<string, any>
}

const safetydata = ref<SafetyData>({ parameters: {} }) // Initialize with an empty parameters object
const loading = ref(false)

const showtype = ref('tcr2org')

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})
const imageName = ref('result_tcr2org.png') // Replace with actual image name

// Construct the image URL based on taskid and imageName
const imageUrl1 = `https://mrnaapi.deepomics.org/tasks/image/serve_image/?taskid=${taskid.value}&imageName=result_tcr2org.png`
const imageUrl2 = `https://mrnaapi.deepomics.org/tasks/image/serve_image/?taskid=${taskid.value}&imageName=result_tcr2ag.png`
const imageUrl3 = `https://mrnaapi.deepomics.org/tasks/image/serve_image/?taskid=${taskid.value}&imageName=result_tcr2ept.png`

onBeforeMount(async () => {
    loading.value = true
    try {
        const response = await axios.get(`/tasks/tcranno_result/`, {
            baseURL: '/api',
            timeout: 10000,
            params: { taskid: taskid.value },
        })
        safetydata.value = response.data || { parameters: {} } // Default to an empty parameters object
    } catch (error) {
        console.error('Error fetching data:', error)
        safetydata.value = { parameters: {} } // Reset to default
    } finally {
        loading.value = false
    }
})

const dict = ref({
    k: { name: 'Output top k', prefix: '--k', default: '10' },
    ref_db: { name: 'Database', prefix: '--ref_db', default: 'IEDB' },
    anno_type: { name: 'Anno type', prefix: '--anno_type', default: 'all' },
    frequency_col: {
        name: 'Frequency / Count column',
        prefix: '--frequency_count_none',
        default: 'frequency',
    },
    tcrannoanalysistype: { name: 'TCRanno Analysis Type', prefix: 'N/A', default: 'qual_quant' },
})

const columns = [
    { title: 'Name', key: '_name', align: 'left' },
    { title: 'Prefix', key: '_prefix', align: 'left' },
    { title: 'Default', key: '_default', align: 'left' },
    { title: 'Value', key: '_value', align: 'left' },
]

const safetydataList = computed(() => {
    const parameters = safetydata.value.parameters || {} // Safely access parameters
    return Object.entries(parameters)
        .map(([key, value]) => {
            if (dict.value[key]) {
                return {
                    _name: dict.value[key].name,
                    _prefix: dict.value[key].prefix,
                    _default: dict.value[key].default,
                    _value: value,
                }
            }
            return null
        })
        .filter(Boolean)
})

const rowKey = (row: any) => row.k

const downloadresult = () => {
    window.open(`/api/tasks/zip/?taskid=${taskid.value}`, '_blank')
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
