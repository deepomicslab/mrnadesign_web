<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col outer-container">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">
                        Linear Design (CDS plus 3'UTR and 5'UTR)
                    </div>
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
                        See Example FATSA sequence
                    </n-button>
                </div>
                <div class="ml-25 mt-5 flex flex-row mb-5">
                    <div class="font-500 text-2xl">Select an input type:</div>

                    <div class="ml-5">
                        <n-radio-group v-model:value="inputtype">
                            <n-radio-button value="upload">UPLOAD FILE</n-radio-button>
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
                        <!-- @remove="remove" -->
                        <!-- show-remove-button -->
                        <n-upload
                            multiple
                            :max="3"
                            v-model:file-list="fileList"
                            directory-dnd
                            :default-upload="false"
                            accept=".fasta,.fa"
                            @update:file-list="handleFileListChange"
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
                        class="rounded w-240 mt-5 rounded-2xl flex-col flex justify-center items-center outer-container"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div class="text-lg mb-6 w-190">
                            Paste a fasta formatted protein/amino acid sequence.
                        </div>
                        <div v-for="(inputGroup, index) in inputBlocks" :key="index" class="w-190">
                            <hr class="mb-5" />
                            <el-form-item label="Name" label-width="100px" class="is-required">
                                <n-input-group>
                                    <n-input
                                        round
                                        placeholder="Name"
                                        type="textarea"
                                        clearable
                                        :rows="1"
                                        v-model:value="inputGroup.name"
                                    ></n-input>
                                    <n-input-group-label @click="importFromDB(index)">
                                        Import data from DB
                                    </n-input-group-label>
                                    <n-input-group-label @click="deleteInputBlock(index)">
                                        Delete this entry
                                    </n-input-group-label>
                                </n-input-group>
                            </el-form-item>
                            <el-form-item label="3'UTR" label-width="100px" class="is-required">
                                <n-input
                                    round
                                    placeholder="3'UTR"
                                    type="textarea"
                                    clearable
                                    v-model:value="inputGroup.utr3"
                                    :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"
                                ></n-input>
                            </el-form-item>
                            <el-form-item label="CDS" label-width="100px" class="is-required">
                                <n-input
                                    round
                                    placeholder="CDS"
                                    type="textarea"
                                    clearable
                                    v-model:value="inputGroup.cds"
                                    :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"
                                ></n-input>
                            </el-form-item>
                            <el-form-item label="5'UTR" label-width="100px" class="is-required">
                                <n-input
                                    round
                                    placeholder="5'UTR"
                                    type="textarea"
                                    clearable
                                    v-model:value="inputGroup.utr5"
                                    :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"
                                ></n-input>
                            </el-form-item>
                        </div>
                        <n-button-group>
                            <n-button size="large" class="w-50 mt-4" @click="addInputBlock">
                                Add Input Block
                            </n-button>
                            <n-button size="large" class="w-50 mt-4" @click="fillSequence">
                                Sample Input
                            </n-button>
                        </n-button-group>
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
                <div class="mt-10 flex flex-row justify-center">
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
    <el-dialog
        v-model="selectionDialogVisible"
        title="Please select sequences as you analysis input"
        width="75%"
    >
        <selectFromDB
            @selectionDialogVisible="handleSelectionDialogVisible"
            @inputBlocktoPass="handleInputBlocktoPass"
        />
    </el-dialog>
</template>
<script setup lang="ts">
/* eslint-disable camelcase */

import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import selectFromDB from './select_window_cds_plus_35utr.vue'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'
import { codonUsageOptions } from '@/utils/taskoptions'

const inputBlocks = ref([{ name: '', utr3: '', cds: '', utr5: '' }]) // Initialize with one input block
const inputBlocktoPass = ref({ utr3: '', cds: '', utr5: '' })

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File[]>([])
const inputtype = ref('upload')

const userid = ref('')
const loading = ref(false)

const selectionDialogVisible = ref(false)

const importID = ref(0)

const addInputBlock = () => {
    inputBlocks.value.push({ name: '', utr3: '', cds: '', utr5: '' }) // Add a new input block
}
const importFromDB = (index: number) => {
    importID.value = index
    selectionDialogVisible.value = true
}
const deleteInputBlock = (index: number) => {
    inputBlocks.value.splice(index, 1)
}
const fillSequence = () => {
    inputBlocks.value.length = 0
    inputBlocks.value.push({
        name: 'seq1',
        utr3: 'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
        cds: 'MPNTLACP',
        utr5: 'AUUGAUUUU',
    })
    inputBlocks.value.push({
        name: 'seq2',
        utr3: 'CUAAUGCCAUGAUCCAACAUGUGGAAGCUUGGAUCAGAUGCUGCACCCUGGAUUGGCUGCC',
        cds: 'MLDQVNKLKYPEVSLT',
        utr5: 'AUUGAUUGGGGUAAUAAAGGGU',
    })
}

const handleSelectionDialogVisible = (value: any) => {
    selectionDialogVisible.value = value
}
const handleInputBlocktoPass = (value: any) => {
    inputBlocktoPass.value = value
    if (inputBlocktoPass.value.utr3 !== '') {
        inputBlocks.value[importID.value].utr3 = inputBlocktoPass.value.utr3
        inputBlocktoPass.value.utr3 = ''
    }
    if (inputBlocktoPass.value.cds !== '') {
        inputBlocks.value[importID.value].cds = inputBlocktoPass.value.cds
        inputBlocktoPass.value.cds = ''
    }
    if (inputBlocktoPass.value.utr5 !== '') {
        inputBlocks.value[importID.value].utr5 = inputBlocktoPass.value.utr5
        inputBlocktoPass.value.utr5 = ''
    }
}

const checkfile = (data: UploadFileInfo) => {
    if (data.name.match(/(.fasta)$/g) === null && data.name.match(/(.fa)$/g) === null) {
        windowErrorMessage('Uploaded file must be in fasta format.')
        return false
    }
    if (data.file?.size === 0 || data.file?.size === undefined) {
        windowErrorMessage('Uploaded file cannot be empty.')
        return false
    }
    if (data.file.size / 1024 / 1024 > 10) {
        windowErrorMessage('Uploaded file cannot exceed 10MB.')
        return false
    }
    if (
        data.name !== 'cds.fasta' &&
        data.name !== 'utr3.fasta' &&
        data.name !== 'utr5.fasta' &&
        data.name !== 'cds.fa' &&
        data.name !== 'utr3.fa' &&
        data.name !== 'utr5.fa'
    ) {
        windowErrorMessage('The name of the uploaded files are not correct.')
        return false
    }
    return true
}
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data.length > 0) {
        const f = data[data.length - 1]
        if (checkfile(f) === false) {
            data.pop()
        }
    }
}

const router = useRouter()

const godemo = () => {
    router.push({
        path: '/task/result/lineardesign',
        query: {
            taskid: encrypt(
                '-99',
                'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
            ),
        },
    })
}

const checkPasteInput = () => {
    // error code: 0 for true, 1 for requiring input, 2 for requiring letters
    const isOnlyLetters = (str: string) => {
        const regex = /^[A-Za-z]+$/
        return regex.test(str)
    }
    const isOnlyLettersAndDigits = (str: string) => {
        const regex = /^[A-Za-z0-9]+$/
        return regex.test(str)
    }

    if (inputBlocks.value.length === 0) {
        return 1
    }
    for (let i = 0; i < inputBlocks.value.length; i += 1) {
        const block = inputBlocks.value[i]
        if (
            block.name.length === 0 ||
            block.utr3.length === 0 ||
            block.cds.length === 0 ||
            block.utr5.length === 0
        ) {
            return 1
        }
        if (!isOnlyLettersAndDigits(block.name)) {
            return 2
        }
        if (!isOnlyLetters(block.utr3) && !isOnlyLetters(block.cds) && !isOnlyLetters(block.utr5)) {
            return 2
        }
    }
    return 0
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

const submit = async () => {
    loading.value = true
    const submitdata = new FormData()
    submitdata.append('rundemo', 'false')
    const precheck = ref(false)

    if (inputtype.value === 'upload') {
        if (fileList.value.length !== 3) {
            windowErrorMessage('Please upload file')
            precheck.value = false
        } else {
            fileList.value.forEach(element => {
                submitfile.value.push(element.file)
            })
            precheck.value = true
        }
    } else if (inputtype.value === 'paste') {
        const paster_input_code = checkPasteInput()
        if (paster_input_code === 0) {
            submitdata.append('seq', JSON.stringify(inputBlocks.value))
            precheck.value = true
        } else if (paster_input_code === 1) {
            windowErrorMessage('Please input sequence')
            precheck.value = false
        } else if (paster_input_code === 2) {
            windowErrorMessage(
                'Only letters and digits are allowed in the name; Only letters are allowed in the sequences'
            )
            precheck.value = false
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'Linear Design')
        submitdata.append('lineardesignanalysistype', 'cds_plus_35utr')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('parameters', JSON.stringify(paramform.value))
        submitdata.append('submitfile1', submitfile.value[0] as File)
        submitdata.append('submitfile2', submitfile.value[1] as File)
        submitdata.append('submitfile3', submitfile.value[2] as File)
        const response = await axios.post(`/analyze/linear_design/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        if (data.status === 'Create Success') {
            windowSuccessMessage(data.message)
            router.push({
                path: '/workspace/',
            })
        } else {
            windowErrorMessage(data.message)
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
        submitdata.append('lineardesignanalysistype', 'cds_plus_35utr')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        paramform.value.codonusage = 'human'
        paramform.value.lambda = 0
        submitdata.append('parameters', JSON.stringify(paramform.value))
        const response = await axios.post(`/analyze/linear_design/`, submitdata, {
            baseURL: '/api',
            timeout: 10000,
        })
        const { data } = response
        if (data.status === 'Create Success') {
            windowSuccessMessage(data.message)
            router.push({
                path: '/workspace/',
            })
        } else {
            windowErrorMessage(data.message)
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

.outer-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}
</style>
