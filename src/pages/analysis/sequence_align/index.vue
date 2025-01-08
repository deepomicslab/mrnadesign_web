<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col h-400">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Sequence Align</div>
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
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/sequence_align/sequence.fasta"
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
                        class="rounded w-240 h-100 mt-5 rounded-2xl flex-col flex justify-center items-center"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div class="text-lg mb-6 w-190">
                            Paste a fasta formatted protein/amino acid sequence. We accept only one
                            sequence here.
                        </div>
                        <div class="w-190 mt-1 flex flex-row text-lg">
                            <n-input
                                round
                                placeholder=">seq&#10;sequence&#10;"
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
                                        fillSequence(
                                            '>SQF22697.1 glycyl-tRNA synthetase alpha subunit [Streptococcus pyogenes]\nVLHCVAFAVPKSSSNEEVMFLTVQVKGPGYKNSRNKLDLETLTDILEHQIRAVPFYLAYAIAMEEISRGCASTGVIMSVNNSLYL'
                                        )
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
                        class="rounded w-200 h-70 mt-15 rounded-xl"
                        style="box-shadow: 0 0 64px #cfd5db"
                    >
                        <div class="mt-10">
                            <el-form status-icon label-width="auto" label-position="right">
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Window Size" class="is-required">
                                            <el-input
                                                v-model="paramform.window_size"
                                                class="w-80"
                                            />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="Step Size" class="is-required">
                                            <el-input v-model="paramform.step_size" class="w-80" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row justify="space-evenly">
                                    <el-col :span="16">
                                        <el-form-item label="e value" class="is-required">
                                            <el-input v-model="paramform.evalue" class="w-80" />
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row class="mt-5">
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
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('upload')
const pastefile = ref('')

const userid = ref('')
const loading = ref(false)

const fillSequence = (seq: string) => {
    pastefile.value = seq
}

/* eslint-disable */
const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.fasta)$/g) === null && data[0].name.match(/(.fa)$/g) === null) {
        windowErrorMessage('Uploaded file must be fasta format.')
        data.pop()
    } else if (data[0].file?.size === 0 || data[0].file?.size === undefined) {
        windowErrorMessage('Uploaded file cannot be empty.')
        data.pop()
    } else if (data[0].file.size / 1024 / 1024 > 10) {
        windowErrorMessage('Uploaded file cannot exceed 10MB.')
        data.pop()
    } else if (data.length > 1) {
        windowErrorMessage('Cannot upload more than one files.')
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
        path: '/task/result/sequencealign',
        query: {
            taskid: encrypt(
                '-70',
                'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
            ),
        },
    })
}

const paramform = ref({
    window_size: 11,
    step_size: 5,
    evalue: 10,
})
const resetFilterForm = () => {
    paramform.value = {
        window_size: 11,
        step_size: 5,
        evalue: 10,
    }
}

const checkPasteInput = () => {
    // error code: 0 for true, 1 for requiring input, 2 for requiring digits, 3 for out-of-range
    const isOnlyDigits = (str: string) => {
        const regex = /^(0|[1-9]\d*)(\.\d+)?$/
        return regex.test(str)
    }

    if (
        paramform.value.window_size.toString() == '' ||
        paramform.value.step_size.toString() == '' ||
        paramform.value.evalue.toString() == ''
    ) {
        return 1
    }
    if (
        !isOnlyDigits(paramform.value.window_size.toString()) &&
        !isOnlyDigits(paramform.value.step_size.toString()) &&
        !isOnlyDigits(paramform.value.evalue.toString())
    ) {
        return 2
    }
    if (
        paramform.value.window_size <= 0 ||
        paramform.value.window_size >= 20 ||
        paramform.value.step_size <= 0 ||
        paramform.value.step_size >= 20 ||
        paramform.value.evalue <= 0 ||
        paramform.value.evalue >= 20
    ) {
        return 3
    }

    return 0
}

const submit = async () => {
    loading.value = true
    const submitdata = new FormData()
    submitdata.append('rundemo', 'false')
    const precheck = ref(false)

    if (inputtype.value === 'upload') {
        if (typeof submitfile.value === 'undefined') {
            windowErrorMessage('Please input file')
            precheck.value = false
        } else {
            submitdata.append('submitfile', submitfile.value as File)
            precheck.value = true
        }
    } else if (inputtype.value === 'paste') {
        if (pastefile.value.length > 0) {
            submitdata.append('file', pastefile.value)
            precheck.value = true
        } else {
            windowErrorMessage('Please input sequence')
            precheck.value = false
        }
    }

    if (precheck.value) {
        const input_code = checkPasteInput()
        if (input_code != 0) {
            precheck.value = false
            if (input_code === 1) {
                windowErrorMessage(
                    'Lack of Input. Please input the thresholds that in the range of (0, 20)'
                )
            } else if (input_code === 2) {
                windowErrorMessage(
                    'Invalid Input. The thresholds should be digits that in the range of (0, 20).'
                )
            } else if (input_code === 3) {
                windowErrorMessage(
                    'Out of Range. The thresholds should be digits that in the range of (0, 20).'
                )
            }
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'Sequence Align')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('window_size', paramform.value.window_size.toString() as string)
        submitdata.append('step_size', paramform.value.step_size.toString() as string)
        submitdata.append('evalue', paramform.value.evalue.toString() as string)
        const response = await axios.post(`/analyze/sequence_align/`, submitdata, {
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
        submitdata.append('analysistype', 'Sequence Align')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('window_size', '11')
        submitdata.append('step_size', '5')
        submitdata.append('evalue', '10')
        const response = await axios.post(`/analyze/sequence_align/`, submitdata, {
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
