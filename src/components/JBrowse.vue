<template>
    <div id="jbrowse_linear_genome_view"></div>
</template>

<script>
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'
import React from 'react'
import ReactDOM from 'react-dom'
import assembly from './assembly'
import tracks from './tracks'

export default {
    name: 'JBrowseLinearGenomeView',
    mounted() {
        const state = createViewState({
            assembly,
            tracks,
            location: '1:100,987,269..100,987,368',
        })
        ReactDOM.render(
            React.createElement(JBrowseLinearGenomeView, { viewState: state }),
            document.getElementById('jbrowse_linear_genome_view')
        )
    },
}
</script>

<style scoped>
/* Add any styles you need here */
</style>
