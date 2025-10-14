/* eslint-disable camelcase */
import { defineStore } from 'pinia'

export const useLinearDesign2PredictionTaskSunmissionStore = defineStore('mrna', () => {
    const name = ref('')
    const utr3Sequence = ref('')
    const cdsSequence = ref('')
    const utr5Sequence = ref('')
    return {
        name,
        utr3Sequence,
        cdsSequence,
        utr5Sequence,
    }
})

export const useLinearDesign2LinearDesignFixCodonTaskSunmissionStore = defineStore('mrna', () => {
    const seq_name = ref('')
    const seq = ref('')
    const conf = ref([])
    const codonusage = ref('')
    const lambda = ref('')
    const lineardesignanalysistype = ref('')
    return {
        seq_name,
        seq,
        conf,
        codonusage,
        lambda,
        lineardesignanalysistype,
    }
})
