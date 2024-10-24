<template>
    <div>
        <!-- <link rel="stylesheet" type="text/css" href="/forna/css/fornac.css" media="screen" /> -->
        <div id="rna_ss"></div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

const props = defineProps<{
    structure: string
    sequence: string
}>()

const { structure, sequence } = toRefs(props)

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

const preprocess_forna = () => {
    // Load scripts in order
    Promise.all([
        // loadScript('../../../../../public/forna/js/jquery.js'),
        // loadScript('../../../../../public/forna/js/d3.js'),
        // loadScript('../../../../../public/forna/js/fornac.js'),
        loadScript('/forna/js/jquery.js'),
        loadScript('/forna/js/d3.js'),
        loadScript('/forna/js/fornac.js'),
        loadStyle('/forna/css/fornac.css'),
    ])
        .then(() => {
            // After loading scripts, initialize the RNA container
            const container = new FornaContainer('#rna_ss', { applyForce: true })
            const options = {
                // structure: '((..((....)).(((....))).))',
                // sequence: 'CGCUUCAUAUAAUCCUAAUGACCUAU',
                structure: structure.value,
                sequence: sequence.value,
            }

            container.addRNA(options.structure, options)
        })
        .catch(error => {
            console.error('Error loading scripts:', error)
        })
}

watch(structure, () => {
    preprocess_forna()
})
</script>

<style scoped></style>
