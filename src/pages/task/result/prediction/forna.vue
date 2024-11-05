<template>
    <!-- <link rel="stylesheet" type="text/css" href="/forna/css/fornac.css" media="screen" /> -->
    <div id="rna_ss" class="h-130" v-loading="loading"></div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
import axios from 'axios'

const loading = ref(false)

const props = defineProps<{
    taskid: string
    protein_subtask_name: string
}>()
const { taskid, protein_subtask_name } = toRefs(props)

const loadScript = (src: string) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = src
        script.async = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
    })
}
const loadStyle = (src: string) => {
    return new Promise((resolve, reject) => {
        const style = document.createElement('link')
        style.href = src
        style.onload = resolve
        style.onerror = reject
        style.media = 'screen'
        style.rel = 'stylesheet'
        style.type = 'text/css'
        document.head.appendChild(style)
    })
}

const process_forna = async () => {
    loading.value = true

    const response = await axios.get(`/tasks/secondarystructure/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
            protein_subtask_name: protein_subtask_name.value,
        },
    })
    const { data } = response

    // Load scripts in order
    Promise.all([
        loadScript('/forna/js/jquery.js'),
        loadScript('/forna/js/d3.js'),
        loadScript('/forna/js/fornac.js'),
        loadStyle('/forna/css/fornac.css'),
    ])
        .then(() => {
            // After loading scripts, initialize the RNA container
            const container = new FornaContainer('#rna_ss', { applyForce: true })
            const options = {
                structure: data.structure,
                sequence: data.sequence,
            }

            container.addRNA(options.structure, options)
        })
        .catch(error => {
            console.error('Error loading scripts:', error)
        })

    loading.value = false
}

// to give a starting point to run the preprocess_forna()
// const today = new Date()
// const ccur_time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
// if (cur_time.value !== ccur_time.value) {
//     process_forna()
// }

watch(protein_subtask_name, async () => {
    process_forna()
})
</script>

<style scoped></style>
