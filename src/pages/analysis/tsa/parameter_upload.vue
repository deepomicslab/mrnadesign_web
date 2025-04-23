<template>
    <div class="flex flex-row justify-center">
        <div class="rounded w-200 mt-0 mb-0 rounded-xl pt-10" style="box-shadow: 0 0 64px #cfd5db">
            <el-form status-icon label-width="auto" label-position="right">
                <el-row justify="space-evenly">
                    <el-form-item label="Sample" class="is-required">
                        <el-input v-model="paramform.sample" class="w-60" />
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly">
                    <el-form-item label="Mutation Types" class="is-required">
                        <el-select
                            v-model="paramform.mutation_type"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                            multiple
                        >
                            <el-option
                                v-for="option in tsaMutationTypeOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly">
                    <el-form-item label="HLA Types" class="is-required">
                        <el-input v-model="paramform.hla_type" class="w-60" />
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.mutation_type.includes('rmats')">
                    <el-form-item label="AS Type for Mutation Type rmats" class="is-required">
                        <el-input v-model="paramform.rmats_as_type" class="w-60" />
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.mutation_type.includes('spe')">
                    <el-form-item label="LCOUNT for Mutation Type spe" class="is-required">
                        <el-input type="number" v-model="paramform.spe_lcount" class="w-60" />
                    </el-form-item>
                </el-row>
                <!-- Reset -->
                <el-row class="m-10">
                    <el-col :span="24" class="text-center">
                        <el-button type="info" @click="resetFilterForm()">Reset</el-button>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint no-underscore-dangle: 0 */
/* eslint-disable camelcase */

import { ref, defineEmits } from 'vue'
// import axios from 'axios'
import { tsaMutationTypeOptions } from '@/utils/taskoptions'

const emit = defineEmits(['paramform_submitted'])

const paramform = ref<{
    sample: string
    mutation_type: Array<string>
    hla_type: Array<string>
    rmats_as_type: string
    spe_lcount: number
}>({
    sample: 'HGSC3',
    mutation_type: ['control', 'rna_edit', 'indel', 'snp', 'fusion', 'rmats', 'spe'],
    hla_type: ['HLA-A11:01', 'HLA-A02:01', 'HLA-B07:02', 'HLA-B15:01', 'HLA-C03:04', 'HLA-C07:02'],
    rmats_as_type: 'A3S',
    spe_lcount: 6,
})

const resetFilterForm = () => {
    paramform.value = {
        sample: 'HGSC3',
        mutation_type: ['control', 'rna_edit', 'indel', 'snp', 'fusion', 'rmats', 'spe'],
        hla_type: [
            'HLA-A11:01',
            'HLA-A02:01',
            'HLA-B07:02',
            'HLA-B15:01',
            'HLA-C03:04',
            'HLA-C07:02',
        ],
        rmats_as_type: 'A3S',
        spe_lcount: 6,
    }
}

onBeforeMount(() => {
    emit('paramform_submitted', paramform.value)
})

watch(
    paramform,
    () => {
        emit('paramform_submitted', paramform.value)
    },
    { deep: true }
)
</script>
