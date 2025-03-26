<template>
    <div class="flex flex-col pt-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">Codon Pair Fraction Details</div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
            <el-button round color="#34498E" class="ml-5 mt-2">
                <a :href="downloadlink" target="_blank" class="btn">Download</a>
            </el-button>
            <el-select round class="ml-5 mt-2 w-70" v-model="tissue" placeholder="Select Tissue">
                <el-option
                    v-for="item in codonpairTissueOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
            </el-select>
        </div>
    </div>
    <div class="ml-10">
        <n-table :bordered="false">
            <tbody>
                <tr>
                    <td>
                        <div class="datatable-small">
                            <datatable :tissue="tissue" />
                        </div>
                    </td>
                    <td>
                        <div><heatmap :tissue="tissue" /></div>
                    </td>
                </tr>
            </tbody>
        </n-table>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck

import datatable from './datatable.vue'
import heatmap from './heatmap.vue'
import { codonpairTissueOptions } from '@/utils/filteroption'
import { CodonpairDictReversed } from '@/utils/type'

const tissue = ref<keyof typeof CodonpairDictReversed>('Genomic')

const downloadlink = ref(
    `https://mrnaapi.deepomics.org/codon_pair/fraction/download/?calculation_type=fraction&&tissue=${
        CodonpairDictReversed[tissue.value]
    }`
)
watch(tissue, () => {
    downloadlink.value = `https://mrnaapi.deepomics.org/codon_pair/fraction/download/?calculation_type=fraction&&tissue=${
        CodonpairDictReversed[tissue.value]
    }`
})
const router = useRouter()
const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}
</script>

<style scoped>
.datatable-small {
    width: 100%;
}
</style>
