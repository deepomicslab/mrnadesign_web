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
