<template>
    <div class="flex flex-col justify-center items-center">
        <div class="mt-10 w-9/10 mb-10" v-if="props.enableTable">
            <el-descriptions class="text-lg" :column="2" size="large" border v-loading="loading">
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task ID</div>
                    </template>
                    {{ taskdata.results.id }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Using Demo File</div>
                    </template>
                    {{ taskdata.results.is_demo_input }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Task Status</div>
                    </template>
                    <el-tag :type="getStatus(taskdata.results.status)" size="large">
                        {{ taskdata.results.status }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Analysis Type</div>
                    </template>
                    {{ taskdata.results.analysis_type }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <div class="cell-item">Created At</div>
                    </template>
                    {{ taskdata.results.created_at }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <div class="w-full" v-if="props.enableTab">
            Analysis Log
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.analysislog" word-wrap show-line-numbers />
            </el-scrollbar>
            <br />
            Sbatch Log
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.sbatchlog" word-wrap show-line-numbers />
            </el-scrollbar>
            <br />
            Sbatch Error
            <el-scrollbar :class="logStyle" v-loading="consoleloading">
                <n-code :code="taskmoduledetail.sbatcherror" word-wrap show-line-numbers />
            </el-scrollbar>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import axios from 'axios'

// const route = useRoute()
// const taskid = computed(() => route.query?.taskid as string)

const props = defineProps({
    taskid: String,
    enableTable: Boolean,
    enableTab: Boolean,
    moduleName: String,
})
const taskid = computed(() => {
    return props.taskid as string
})
const taskdata = ref({
    results: {
        modulelist: [] as any[],
        task_detail: {
            analysis_type: '',
            task_status: '',
        },
        status: '',
        analysis_type: '',
        created_at: '',
        name: '',
    },
})
const taskmoduledetail = ref({
    status: '',
    sbatchlog: '',
    sbatcherror: '',
    analysislog: '',
})
const loading = ref(false)
const consoleloading = ref(false)
const logStyle = ref('h-150 bg-dark p-4 text-light')

const fetchData = async () => {
    loading.value = true
    consoleloading.value = true
    if (props.enableTab || props.enableTable) {
        const response2 = await axios.get(`/tasks/detail/`, {
            baseURL: '/api',
            timeout: 100000,
            params: {
                taskid: taskid.value,
            },
        })
        taskdata.value = response2.data
        loading.value = false
    }

    const response3 = await axios.get(`/tasks/detail/log/`, {
        baseURL: '/api',
        timeout: 100000,
        params: {
            taskid: taskid.value,
        },
    })
    taskmoduledetail.value.sbatchlog = response3.data.sbatch_log
    taskmoduledetail.value.sbatcherror = response3.data.sbatch_error
    taskmoduledetail.value.analysislog = response3.data.task_log
    consoleloading.value = false
}

onBeforeMount(async () => {
    await fetchData()
})

watch(taskid, async () => {
    await fetchData()
})

const getStatus = (status: any) => {
    if (status === 'Running') {
        return 'info'
    }
    if (status === 'Success') {
        return 'success'
    }
    if (status === 'Failed' || status === 'Canceled') {
        return 'error'
    }
    if (status === 'Created') {
        return 'warning'
    }
    return 'warning'
}
</script>
