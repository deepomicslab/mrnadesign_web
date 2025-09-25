<template>
    <component_cds_only v-if="lineardesignanalysistype == 'cds_only'" />
    <component_cds_plus_35utr v-if="lineardesignanalysistype == 'cds_plus_35utr'" />
    <conmponent_fix_codon v-if="lineardesignanalysistype == 'fix_codon'" />
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { ref } from 'vue'
import axios from 'axios'
import { decrypt } from '@/utils/crypto'
import component_cds_only from './cds_only.vue'
import component_cds_plus_35utr from './cds_plus_35utr.vue'
import conmponent_fix_codon from './fix_codon.vue'

const route = useRoute()
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})

const lineardesignanalysistype = ref('')
onBeforeMount(async () => {
    const response = await axios.get(`/tasks/lineardesign_result/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            taskid: taskid.value,
        },
    })
    const { data } = response
    lineardesignanalysistype.value = data.lineardesignanalysistype
})
</script>
