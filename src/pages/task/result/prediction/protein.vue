<template>
    <div>
        <div v-loading="loading">
            <iframe :src="url" scrolling="auto" frameborder="no" class="w-full h-106" />
        </div>
    </div>
</template>
<script setup lang="ts">
/* eslint-disable camelcase */
import axios from 'axios'
import { watchEffect } from 'vue'

const loading = ref(false)

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
}>()
const { taskid, protein_subtask_name } = toRefs(props)
const url = ref('')

const process_protein = async () => {
    loading.value = true
    const response = await axios.get(`/tasks/proteinstructure/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            protein_subtask_name: protein_subtask_name.value,
        },
    })
    const { data: proteinData } = response
    watchEffect(() => {
        url.value = `https://www.ncbi.nlm.nih.gov/Structure/icn3d/?type=${proteinData.type}&url=${proteinData.fileurl}`
    })
    loading.value = false
}

watch(protein_subtask_name, async () => {
    process_protein()
})
</script>
