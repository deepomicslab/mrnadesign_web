<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col h-400">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Linear Design</div>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="text-white hover:text-white focus:text-white active:text-white ml-40"
                        @click="submitdemo"
                    >
                        Run Demo
                    </el-button>
                    <el-button
                        round
                        size="large"
                        color="#EE7E7D"
                        class="ml-5 text-white hover:text-white focus:text-white active:text-white"
                        @click="godemo"
                    >
                        View Demo Result
                    </el-button>
                    <el-button round size="large" color="#34498E" @click="gosubmithelper">
                        Submission Helper
                    </el-button>
                    <el-button round size="large" color="#34498E" class="ml-5">
                        <a href="#" target="_blank" class="btn">Report bug</a>
                    </el-button>
                </div>
                <div class="text-lg font-500 ml-20 mt-3 w-9/10 flex flex-row">
                    <el-icon class="text-lg mt-1 mr-2 text-[#34498E]">
                        <InfoFilled />
                    </el-icon>
                    It takes a few minutes to
                    <p class="text-[#EE7E7D] mx-2">RUN DEMO.</p>
                    Click
                    <p class="text-[#EE7E7D] mx-2">VIEW DEMO RESULT</p>
                    to see the precomputed demo results immediately.
                </div>
                <div class="font-600 text-3xl ml-20 mt-10">
                    1. Input Sequence
                    <n-button
                        text
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/lineardesign/sequence.fasta"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Example FASTA sequence
                    </n-button>
                </div>
                <div class="ml-25 mt-5 flex flex-row mb-5">
                    <div class="font-500 text-2xl">Select an input type:</div>

                    <div class="ml-5">
                        <n-radio-group v-model:value="inputtype">
                            <n-radio-button value="upload">UPLOAD FILE</n-radio-button>
                            <n-radio-button value="enter">ENTER ANTIGEN/TANTIGEN ID</n-radio-button>
                            <n-radio-button value="paste">PASTE SEQUENCE</n-radio-button>
                        </n-radio-group>
                    </div>
                </div>

                <div class="flex flex-row justify-center">
                    <div
                        class="rounded w-200 h-90 mt-5 rounded-2xl"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'upload'"
                    >
                        <n-upload
                            v-model:file-list="fileList"
                            directory-dnd
                            :default-upload="false"
                            accept=".fasta,.fa"
                            @update:file-list="handleFileListChange"
                            @remove="remove"
                            show-remove-button
                        >
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p
                                        class="text-base mt-3 mb-3 text-opacity-100"
                                        style="color: #f07167"
                                    >
                                        Fasta file size should be less than 10MB
                                    </p>
                                    <p
                                        class="text-base mb-3 text-opacity-100"
                                        style="color: #f07167"
                                    >
                                        Supported formats: .fasta / .fa
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>

                    <div
                        class="rounded w-200 h-60 mt-5 rounded-2xl flex-col flex justify-center items-center"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'enter'"
                    >
                        <div class="text-lg flex flex-row mt-20">
                            Enter the
                            <p class="text-red-400 mx-2">Antigen/Tantigen IDs</p>
                            that already exist in the database, separated by
                            <p class="text-red-400 mx-2 font-900">' ; '</p>
                        </div>
                        <div class="flex flex-row justify-center">
                            <div class="rounded w-200 h-40 mt-10 rounded-xl">
                                <el-form status-icon label-width="auto" label-position="right">
                                    <el-row justify="space-evenly">
                                        <el-col :span="16">
                                            <el-form-item label="ID" class="is-required">
                                                <n-input
                                                    v-model:value="inputformValue.phage"
                                                    placeholder="Example: 1;27;56"
                                                    type="textarea"
                                                    :autosize="{
                                                        minRows: 1,
                                                        maxRows: 2,
                                                    }"
                                                />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row justify="space-evenly">
                                        <el-col :span="16">
                                            <el-form-item
                                                label="Select Data Table"
                                                class="is-required"
                                            >
                                                <n-radio-group
                                                    v-model:value="inputformValue.datatable"
                                                    name="datatable"
                                                    size="large"
                                                >
                                                    <n-radio-button value="antigen">
                                                        Antigen
                                                    </n-radio-button>
                                                    <n-radio-button value="tantigen">
                                                        Tantigen
                                                    </n-radio-button>
                                                </n-radio-group>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </div>
                    </div>
                    <div
                        class="rounded w-240 h-100 mt-5 rounded-2xl flex-col flex justify-center items-center"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div class="text-lg mb-6 w-190">
                            Paste a fasta formatted protein/amino acid sequence.
                        </div>
                        <div class="w-190 mt-1 flex flex-row text-lg">
                            <n-input
                                round
                                placeholder=">seq1&#10;sequence&#10;>seq2&#10;sequence&#10;"
                                type="textarea"
                                clearable
                                :rows="10"
                                v-model:value="pastefile"
                            ></n-input>
                        </div>
                        <div class="mt-4">
                            <n-button-group>
                                <n-button
                                    round
                                    size="large"
                                    class="w-50"
                                    @click="
                                        fillSequence('>seq1\nMPNTLACP\n>seq2\nMLDQVNKLKYPEVSLT*\n')
                                    "
                                >
                                    Sample Input
                                </n-button>
                            </n-button-group>
                        </div>
                    </div>
                </div>

                <div class="font-600 text-3xl ml-20 mt-10">2. Parameters</div>
                <div class="flex flex-row justify-center">
                    <div
                        class="rounded w-200 h-60 mt-15 rounded-xl"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div class="mt-10">
                            <el-form status-icon label-width="auto" label-position="right">
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Codon Usage" class="is-required">
                                            <el-select
                                                v-model="paramform.codonusage"
                                                placeholder="Please Select"
                                                class="w-60"
                                                clearable
                                            >
                                                <el-option
                                                    v-for="option in codonUsageOptions"
                                                    :key="option.value"
                                                    :label="option.label"
                                                    :value="option.value"
                                                ></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item
                                            label="Codon Adaption Index (&lambda;)"
                                            class="is-required"
                                        >
                                            <el-input v-model="paramform.lambda" class="w-60" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="mt-10">
                                    <el-col :span="24" class="text-center">
                                        <el-button type="info" @click="resetFilterForm()">
                                            Reset
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                </div>

                <div class="mt-20 flex flex-row justify-center">
                    <el-button
                        size="large"
                        color="#34498E"
                        :width="70"
                        class="text-white hover:text-white focus:text-white active:text-white text-2xl"
                        @click="submit"
                    >
                        Submit
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>
<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { codonUsageOptions } from '@/utils/taskoptions'

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('upload')
const pastefile = ref('')

const userid = ref('')
const loading = ref(false)

const inputformValue = ref({
    phage: '',
    datatable: '',
})
const idlist = ref([])
const inputfeedback = ref('')
const validationstatus = ref()

const fillSequence = (seq: string) => {
    pastefile.value = seq
}

/* eslint-disable */
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.fasta)$/g) === null && data[0].name.match(/(.fa)$/g) === null) {
        window.$message.error('Uploaded file must be fasta format.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        window.$message.error('Uploaded file cannot be empty.', { closable: true, duration: 5000 })
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 10) {
        window.$message.error('Uploaded file cannot exceed 10MB.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length > 1) {
        window.$message.error('Cannot upload more than one files.', {
            closable: true,
            duration: 5000,
        })
        data.pop()
    } else if (data.length === 1) {
        submitfile.value = data[0].file
        fileList.value[0] = data[0]
    }
}
const remove = () => {
    submitfile.value = undefined
    fileList.value.pop()
}
const router = useRouter()

const godemo = () => {
    router.push({
        path: '/task/result/lineardesign',
        query: {
            taskid: encrypt(
                '-99', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2')
        }
    })
}

const paramform = ref({
    codonusage: '',
    lambda: 0.0,
})
const resetFilterForm = () => {
    paramform.value = {
        codonusage: '',
        lambda: 0.0,
    }
}

interface Tree {
    id?: number
    label: string
    children?: Tree[]
}

const submit = async () => {
    loading.value = true
    const submitdata = new FormData()
    submitdata.append('rundemo', 'false')
    const precheck = ref(false)

    if (inputtype.value === 'upload') {
        if (typeof submitfile.value === 'undefined') {
            window.$message.error('Please upload file', {
                closable: true,
                duration: 5000,
            })
            precheck.value = false
        } else {
            precheck.value = true
        }
    } else if (inputtype.value === 'paste') {
        if (pastefile.value.length > 0) {
            submitdata.append('file', pastefile.value)
            precheck.value = true
        } else {
            window.$message.error('Please input sequence', {
                closable: true,
                duration: 5000,
            })
            precheck.value = false
        }
    } else { // enter
        if (inputformValue.value.phage.length === 0) {
            window.$message.error('Please input Antigen/TAntigen IDs', {
                closable: true,
                duration: 5000,
            })
            precheck.value = false
        } else if (inputformValue.value.datatable === '') {
            window.$message.error('Please select the data table that the IDs come from', {
                closable: true,
                duration: 5000,
            })
        } else {
            const checkdata = new FormData()
            checkdata.append('antigen_tantigen_ids', inputformValue.value.phage)
            checkdata.append('datatable', inputformValue.value.datatable)
            const response = await axios.post(`/analyze/linear_design_inputcheck/`, checkdata, {
                baseURL: '/api',
                timeout: 10000,
            })
            const res = response.data
            idlist.value = res.idlist
            validationstatus.value = res.status
            inputfeedback.value = res.message
            if (validationstatus.value == 'failed') {
                window.$message.error(inputfeedback.value, {
                    closable: true,
                    duration: 5000,
                })
            } else if (validationstatus.value == 'success') {
                submitdata.append('datatable', inputformValue.value.datatable)
                submitdata.append('queryids', JSON.stringify(idlist.value))
                precheck.value = true
            }
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'Linear Design')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('submitfile', submitfile.value as File)
        submitdata.append('codonusage', paramform.value.codonusage as string)
        submitdata.append('lambda', paramform.value.lambda.toString() as string)
        const response = await axios.post(`/analyze/linear_design/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        if (data.status === 'Create Success') {
            window.$message.success(data.message, {
                closable: true,
                duration: 5000,
            })
            router.push({
                path: '/workspace/',
            })
        } else {
            window.$message.error(data.message, {
                closable: true,
                duration: 5000,
            })
        }
    }
    loading.value = false
}
const submitdemo = async () => {
    loading.value = true
    const submitdata = new FormData()
    submitdata.append('rundemo', 'true')
    const precheck = ref(true)

    if (precheck.value) {
        submitdata.append('analysistype', 'Linear Design')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('codonusage', 'human')
        submitdata.append('lambda', '0')
        const response = await axios.post(`/analyze/linear_design/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        if (data.status === 'Create Success') {
            window.$message.success(data.message, {
                closable: true,
                duration: 5000,
            })
            router.push({
                path: '/workspace/',
            })
        } else {
            window.$message.error(data.message, {
                closable: true,
                duration: 5000,
            })
        }
    }
    loading.value = false
}
onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})

const gosubmithelper = () => {
    router.push({ path: '/tutorial', query: { type: 'analysis' } })
}
</script>

<style lang="scss" scoped>
:deep(.el-tree-node__content) {
    height: 48px !important;
}
</style>
