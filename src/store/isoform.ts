import { defineStore } from 'pinia'

export const useIsoformStore = defineStore('isoformdata', () => {
    const taskisoformlist = ref([])
    const taskproteinlist = ref([])
    const isoformid = ref()
    const isoformdataloaded = ref(false)
    const isoformfastadata = ref('')
    const trnaloaed = ref(false)
    const antiloaded = ref(false)
    const crisprloaded = ref(false)
    const terminatorloaded = ref(false)
    const transproteinloaded = ref(false)
    const arvfloaded = ref(false)
    const alignmentloaded = ref(false)
    const heatmaploaded = ref(false)
    return {
        isoformid,
        isoformfastadata,
        alignmentloaded,
        isoformdataloaded,
        terminatorloaded,
        transproteinloaded,
        antiloaded,
        arvfloaded,
        crisprloaded,
        trnaloaed,
        taskisoformlist,
        taskproteinlist,
        heatmaploaded,
    }
})
