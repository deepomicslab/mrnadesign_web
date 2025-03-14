import { defineStore } from 'pinia'

export const useDatasetStore = defineStore('datasetStore', () => {
    const datasetId = ref()
    const datasetName = ref()
    const sampleData = ref('')
    const sampleDataLoaded = ref(false)
    return {
        dataset_id: datasetId,
        dataset_name: datasetName,
        sample_data: sampleData,
        sample_data_loaded: sampleDataLoaded,
    }
})
