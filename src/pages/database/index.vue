mt-10 mr-10 w-40 mt-10 mr-10 w-40
<template>
    <div class="mx-30 my-10 h-full pb-10 flex flex-col justify-start">
        <div class="flex felx-row justify-start mt-8">
            <h1 class="text-5xl m-4 font-700">Database Overview</h1>

            <div class="flex flex-row ml-1 my-6">
                <el-button round color="#34498E" class="ml-5" @click="godatalist">
                    Total Data
                </el-button>
                <el-button round color="#34498E" class="ml-5" @click="godatahelper">
                    Database Helper
                </el-button>
            </div>
        </div>
        <div class="mb-4 mt-12 ml-15 p-1">
            <div class="flex flex-row">
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="antigen_stats.num"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">Antigens</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="antigen_stats.num_type"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">Antigen Types</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="antigen_stats.num_source_organism"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">Antigen Organisms</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="tantigen_stats.num"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">Tantigens</h1>
                        </template>
                    </n-statistic>
                </div>
                <!-- <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="tantigen_stats.num_antigen_name"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">
                                Antigens (as the source of tantigens)
                            </h1>
                        </template>
                    </n-statistic>
                </div> -->
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="tantigen_stats.num_gene_card"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">Tantigen Gene Cards</h1>
                        </template>
                    </n-statistic>
                </div>
            </div>
            <div class="flex flex-row mt-12">
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="threeutr_stats.num"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">3'UTRs</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="threeutr_stats.num_gene_name"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">3'UTR Genes</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="threeutr_stats.num_transcript"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">3'UTR Transcripts</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="threeutr_stats.num_cluster"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">3'UTR CLusters</h1>
                        </template>
                    </n-statistic>
                </div>
                <div class="w-65">
                    <n-statistic>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="0"
                            :to="threeutr_stats.num_chromosome"
                            show-separator
                        />
                        <template #label>
                            <h1 class="text-[#212529] text-lg font-700">3'UTR Chromosomes</h1>
                        </template>
                    </n-statistic>
                </div>
            </div>
        </div>
        <div class="mt-12 m-3">
            <div class="border-t-2"></div>
            <h1 class="text-4xl mt-8 ml-6 font-500">Data Source</h1>
            <div class="flex flex-row justify-start w-375 flex-wrap items-start ml-5 mt-6 mb-6">
                <n-button
                    v-for="index in 15"
                    :key="index"
                    class="mt-10 mr-10 w-115 text-[#34498e] text-xl h-11"
                    tertiary
                >
                    {{ sourceorganism[index] && sourceorganism[index].source_organism }}
                </n-button>
            </div>
        </div>
        <div class="mt-23 m-3">
            <div class="border-t-2"></div>
            <div class="flex felx-row justify-start">
                <h1 class="text-3xl mt-8 ml-6 font-600">Database overview visualization</h1>
                <n-button round type="default" class="mt-9 ml-8" size="small" v-show="false">
                    <template #icon>
                        <n-icon>
                            <downicon />
                        </n-icon>
                    </template>
                    Download all charts
                </n-button>
            </div>
            <div>
                <div>
                    <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Bar Plot</h1>
                </div>
                <div class="flex flex-row">
                    <div class="w-200 h-20 mb-2 mt-5 p-5 ml-3">
                        <n-form-item label="Please choose plot type" class="w-75">
                            <n-select
                                v-model:value="barchartvalue1"
                                :options="barchartoptions1"
                                @update:value="barcharthandleUpdateValue1"
                            ></n-select>
                        </n-form-item>
                    </div>
                    <div class="w-200 h-20 mb-2 mt-5 ml-10 p-5">
                        <n-form-item label="Please choose plot type" class="w-75">
                            <n-select
                                v-model:value="barchartvalue2"
                                :options="barchartoptions2"
                                @update:value="barcharthandleUpdateValue2"
                            ></n-select>
                        </n-form-item>
                    </div>
                </div>
                <div class="flex flex-row">
                    <div
                        class="w-200 h-140 mb-10 mt-5 p-5 ml-8"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="myEcharts" class="h-130" ref="echartbarDom1"></div>
                    </div>
                    <div
                        class="w-200 h-140 mb-10 mt-5 ml-10 p-5"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="myEcharts" class="h-130" ref="echartbarDom2"></div>
                    </div>
                </div>
            </div>
            <div class="mt-10">
                <div>
                    <h1 class="text-3xl mt-9 ml-7 font-500 text-[#3262a8]">Pie Chart</h1>
                </div>
                <div class="w-410 flex flex-row justify-between mt-6 ml-8">
                    <n-form-item label="Please choose chart type" class="w-75">
                        <n-select
                            v-model:value="piechartvalue1"
                            :options="piechartoptions1"
                            @update:value="piecharthandleUpdateValue1"
                        ></n-select>
                    </n-form-item>
                </div>

                <div class="flex flex-row">
                    <div
                        class="w-420 h-140 mb-10 mt-5 p-5 ml-8"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div id="mypieEcharts1" class="w-410 h-130" ref="echartpieDom1"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import * as echarts from 'echarts'
import axios from 'axios'

import { datasetsOption, QualityOption, Hostnumber, datasetspieOption } from '@/utils/overview'

/* eslint-disable camelcase */

const router = useRouter()
const godatalist = () => router.push({ path: '/database/antigen' })

const barchartvalue1 = ref('Data Distribution')
const barchartvalue2 = ref('Data Distribution')
const barchartoptions1 = [
    {
        label: 'Data Distribution',
        value: 'Data Distribution',
    },
]
const barchartoptions2 = [
    {
        label: 'Data Distribution',
        value: 'Data Distribution',
    },
]
const piechartvalue1 = ref('Data Distribution')
const piechartoptions1 = [
    {
        label: 'Data Distribution',
        value: 'Data Distribution',
    },
]

const echartbarDom1 = ref<HTMLElement | null>(null)
const echartbarDom2 = ref<HTMLElement | null>(null)
const echartpieDom1 = ref<HTMLElement | null>(null)

const sourceorganism = ref([])
const antigen_stats = ref({
    num: 0,
    num_source_organism: 0,
    num_type: 0,
})
const tantigen_stats = ref({
    num: 0,
    num_antigen_name: 0,
    num_gene_card: 0,
})
const threeutr_stats = ref({
    num: 0,
    num_gene_name: 0,
    num_transcript: 0,
    num_cluster: 0,
    num_chromosome: 0,
})

const axios_get1 = async () => {
    const response = await axios.get(`/overview/antigensourceorganism/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {},
    })
    const { data } = response
    sourceorganism.value = data.results
}
const axios_get2 = async () => {
    const response = await axios.get(`/overview/stats/antigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {},
    })
    const { data } = response
    antigen_stats.value = data
}
const axios_get3 = async () => {
    const response = await axios.get(`/overview/stats/tantigen/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {},
    })
    const { data } = response
    tantigen_stats.value = data
}
const axios_get4 = async () => {
    const response = await axios.get(`/overview/stats/threeutr/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {},
    })
    const { data } = response
    threeutr_stats.value = data
}

onBeforeMount(async () => {
    axios_get1()
    axios_get2()
    axios_get3()
    axios_get4()
})

onMounted(() => {
    const mybarEcharts1 = echarts.init(echartbarDom1.value as HTMLElement)
    mybarEcharts1.setOption(QualityOption)
    const mybarEcharts2 = echarts.init(echartbarDom2.value as HTMLElement)
    mybarEcharts2.setOption(Hostnumber)

    const mypieEcharts1 = echarts.init(echartpieDom1.value as HTMLElement)
    mypieEcharts1.setOption(datasetspieOption)
})

const barcharthandleUpdateValue1 = (value: string) => {
    barchartvalue1.value = value
    if (value === 'Data Source Distribution') {
        const mybarEcharts1 = echarts.init(echartbarDom1.value as HTMLElement)
        mybarEcharts1.setOption(datasetsOption)
    }
}
const barcharthandleUpdateValue2 = (value: string) => {
    barchartvalue2.value = value
    if (value === 'Host Phylum Distribution') {
        const mybarEcharts2 = echarts.init(echartbarDom2.value as HTMLElement)
        mybarEcharts2.setOption(Hostnumber)
    }
}

const piecharthandleUpdateValue1 = (value: string) => {
    piechartvalue1.value = value
    if (value === 'Data Source Distribution') {
        const mypieEcharts1 = echarts.init(echartpieDom1.value as HTMLElement)
        mypieEcharts1.setOption(datasetspieOption)
    }
}
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>

<style lang="scss" scoped>
:deep(.n-statistic .n-statistic-value .n-statistic-value__content) {
    font-size: 42px;
    color: #34498e;
    font-weight: bold;
}
</style>
