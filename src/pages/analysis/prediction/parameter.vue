<template>
    <div class="flex flex-row justify-center">
        <div
            class="rounded w-200 mt-0 mb-0 rounded-xl pt-10 outer-container"
            style="box-shadow: 0 0 64px #cfd5db"
        >
            <el-form status-icon label-width="auto" label-position="right">
                <!-- module I -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.rna_structure.run"
                                style="margin-right: 10px"
                            />
                            <label>Module I RNA Structure</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.rna_structure.run">
                    <el-form-item label="Stem Length Threshold" class="is-required">
                        <el-input
                            type="number"
                            v-model="paramform.rna_structure.stem_len_threshold"
                            class="w-60"
                        />
                    </el-form-item>
                </el-row>
                <!-- module II -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.protein_structure.run"
                                style="margin-right: 10px"
                            />
                            <label>Module II Protein Structure</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- module III -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch v-model="paramform.miRNA.run" style="margin-right: 10px" />
                            <label>Module III miRNA</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.miRNA.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.miRNA.target_species"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in targetSpeciesOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <!-- module IV -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.restriction_sites.run"
                                style="margin-right: 10px"
                            />
                            <label>Module IV Restriction Sites</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!-- module V -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch v-model="paramform.ires.run" style="margin-right: 10px" />
                            <label>Module V Ires</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.ires.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.ires.target_species"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in targetSpeciesOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.ires.run">
                    <el-form-item label="e Value" class="is-required">
                        <el-input type="number" v-model="paramform.ires.e_value" class="w-60" />
                    </el-form-item>
                </el-row>
                <!-- module VI -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.upeptide_homology.run"
                                style="margin-right: 10px"
                            />
                            <label>Module VI Upeptide Homology</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.upeptide_homology.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.upeptide_homology.target_species"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in targetSpeciesOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.upeptide_homology.run">
                    <el-form-item label="e Value" class="is-required">
                        <el-input
                            type="number"
                            v-model="paramform.upeptide_homology.e_value"
                            class="w-60"
                        />
                    </el-form-item>
                </el-row>
                <!-- module VII -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.cds_peptide_homology.run"
                                style="margin-right: 10px"
                            />
                            <label>Module VII CDS Peptide Homology</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.cds_peptide_homology.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.cds_peptide_homology.target_species"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in targetSpeciesOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.cds_peptide_homology.run">
                    <el-form-item label="e Value" class="is-required">
                        <el-input
                            type="number"
                            v-model="paramform.cds_peptide_homology.e_value"
                            class="w-60"
                        />
                    </el-form-item>
                </el-row>
                <!-- module VIII -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.cds_scoring.run"
                                style="margin-right: 10px"
                            />
                            <label>Module VIII CDS Scoring</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.cds_scoring.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.cds_scoring.host_species"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in targetSpeciesOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.cds_scoring.run">
                    <el-form-item label="Genetic Code" class="is-required">
                        <el-input
                            type="number"
                            v-model="paramform.cds_scoring.genetic_code"
                            class="w-60"
                        />
                    </el-form-item>
                </el-row>
                <!-- module IX -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.tis_scoring.run"
                                style="margin-right: 10px"
                            />
                            <label>Module IX Tis Scoring</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.tis_scoring.run">
                    <el-form-item label="Inframe Utis Weight" class="is-required">
                        <el-input
                            type="number"
                            v-model="paramform.tis_scoring.inframe_utis_weight"
                            class="w-60"
                        />
                    </el-form-item>
                </el-row>
                <!-- module X -->
                <el-row justify="space-evenly">
                    <el-col :span="16">
                        <el-form-item label="">
                            <el-switch
                                v-model="paramform.utr5_mrl.run"
                                style="margin-right: 10px"
                            />
                            <label>Module X 5'UTR MRL</label>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.utr5_mrl.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.utr5_mrl.base_modify"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in utr5MRLBaseModifyOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
                <el-row justify="space-evenly" v-if="paramform.utr5_mrl.run">
                    <el-form-item label="Target Species" class="is-required">
                        <el-select
                            v-model="paramform.utr5_mrl.trim_strategy"
                            placeholder="Please Select"
                            class="w-60"
                            clearable
                        >
                            <el-option
                                v-for="option in utr5MRLTrimStrategyOptions"
                                :key="option.value"
                                :label="option.label"
                                :value="option.value"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </el-row>
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

import { ref, defineEmits } from 'vue'
import {
    targetSpeciesOptions,
    utr5MRLBaseModifyOptions,
    utr5MRLTrimStrategyOptions,
} from '@/utils/taskoptions'

const emit = defineEmits(['paramform_submitted'])

const paramform = ref({
    // module 1
    rna_structure: {
        run: true,
        stem_len_threshold: 5,
    },
    // module 2
    protein_structure: {
        run: true,
    },
    // module 3
    miRNA: {
        run: true,
        target_species: 'Homo sapiens',
    },
    // module 4
    restriction_sites: {
        run: true,
    },
    // module 5
    ires: {
        run: true,
        target_species: 'Homo sapiens',
        e_value: 0.1,
    },
    // module 6
    upeptide_homology: {
        run: true,
        target_species: 'Homo sapiens',
        e_value: 0.1,
    },
    // module 7
    cds_peptide_homology: {
        run: true,
        target_species: 'Homo sapiens',
        e_value: 0.1,
    },
    // module 8
    cds_scoring: {
        run: true,
        host_species: 'Homo sapiens',
        genetic_code: 1,
    },
    // module 9
    tis_scoring: {
        run: true,
        inframe_utis_weight: 0.5,
    },
    // module 10
    utr5_mrl: {
        run: true,
        base_modify: 'unmod',
        trim_strategy: 'sliding_window',
    },
})

const resetFilterForm = () => {
    paramform.value = {
        // module 1
        rna_structure: {
            run: true,
            stem_len_threshold: 5,
        },
        // module 2
        protein_structure: {
            run: true,
        },
        // module 3
        miRNA: {
            run: true,
            target_species: 'Homo sapiens',
        },
        // module 4
        restriction_sites: {
            run: true,
        },
        // module 5
        ires: {
            run: true,
            target_species: 'Homo sapiens',
            e_value: 0.1,
        },
        // module 6
        upeptide_homology: {
            run: true,
            target_species: 'Homo sapiens',
            e_value: 0.1,
        },
        // module 7
        cds_peptide_homology: {
            run: true,
            target_species: 'Homo sapiens',
            e_value: 0.1,
        },
        // module 8
        cds_scoring: {
            run: true,
            host_species: 'Homo sapiens',
            genetic_code: 1,
        },
        // module 9
        tis_scoring: {
            run: true,
            inframe_utis_weight: 0.5,
        },
        // module 10
        utr5_mrl: {
            run: false,
            base_modify: 'unmod',
            trim_strategy: 'sliding_window',
        },
    }
}

onBeforeMount(() => {
    emit('paramform_submitted', paramform.value)
})

watch(paramform, () => {
    emit('paramform_submitted', paramform.value)
})
</script>
