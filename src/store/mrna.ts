import { defineStore } from 'pinia'

export const useLinearDesign2PredictionTaskSunmissionStore = defineStore('mrna', () => {
    const cdsSequence = ref('')
    return {
        cdsSequence,
    }
})
