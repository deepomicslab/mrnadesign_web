<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col outer-container">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">
                        Prediction (From Linear Design Result)
                    </div>
                    <el-button round size="large" color="#EE7E7D"
                        class="text-white hover:text-white focus:text-white active:text-white ml-40"
                        @click="submitdemo">
                        Run Demo
                    </el-button>
                    <el-button round size="large" color="#EE7E7D"
                        class="ml-5 text-white hover:text-white focus:text-white active:text-white" @click="godemo">
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
                    <n-button text
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/prediction/task0001_input_seq.tsv"
                        tag="a" target="_blank" type="primary" class="text-lg">
                        See Example TSV sequence
                    </n-button>
                </div>
                <div class="ml-25 mt-5 flex flex-row mb-5">
                    <div class="font-500 text-2xl">Select an input type:</div>

                    <div class="ml-5">
                        <n-radio-group v-model:value="inputtype">
                            <n-radio-button value="upload">UPLOAD FILE</n-radio-button>
                            <!-- <n-radio-button value="enter">ENTER ANTIGEN/TANTIGEN ID</n-radio-button> -->
                            <n-radio-button value="paste">PASTE SEQUENCE</n-radio-button>
                        </n-radio-group>
                    </div>
                </div>

                <div class="flex flex-row justify-center">
                    <div class="rounded w-200 h-90 mt-5 rounded-2xl" style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'upload'">
                        <n-upload v-model:file-list="fileList" directory-dnd :default-upload="false" accept=".tsv"
                            @update:file-list="handleFileListChange" @remove="remove" show-remove-button>
                            <n-upload-dragger>
                                <div class="flex flex-col justify-center items-center">
                                    <div class="text-[90px] mt-10" style="color: #028090">
                                        <i-fa-cloud-upload />
                                    </div>
                                    <p class="text-h5 mt-3 font-light" style="color: #028090">
                                        Click or drag a file to this area to upload your file
                                    </p>

                                    <p class="text-base mt-3 mb-3 text-opacity-100" style="color: #f07167">
                                        TSV file size should be less than 10MB
                                    </p>
                                    <p class="text-base mb-3 text-opacity-100" style="color: #f07167">
                                        Supported formats: .tsv
                                    </p>
                                </div>
                            </n-upload-dragger>
                        </n-upload>
                    </div>

                    <div class="rounded w-200 h-60 mt-5 rounded-2xl flex-col flex justify-center items-center"
                        style="box-shadow: 0 0 64px #cfd5db" v-if="inputtype === 'enter'">
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
                                                <n-input v-model:value="inputformValue.phage"
                                                    placeholder="Example: 1;27;56" type="textarea" :autosize="{
                                                        minRows: 1,
                                                        maxRows: 2,
                                                    }" />
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row justify="space-evenly">
                                        <el-col :span="16">
                                            <el-form-item label="Select Data Table" class="is-required">
                                                <n-radio-group v-model:value="inputformValue.datatable" name="datatable"
                                                    size="large">
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
                    <div class="rounded w-240 mt-5 rounded-2xl flex-col flex justify-center items-center outer-container"
                        style="box-shadow: 0 0 64px #cfd5db" v-if="inputtype === 'paste'">
                        <div class="text-lg mb-6 w-190">
                            Paste a fasta formatted protein/amino acid sequence.
                        </div>
                        <div v-for="(inputGroup, index) in inputBlocks" :key="index" class="w-190">
                            <hr class="mb-5" />
                            <el-form-item label="Name" label-width="100px" class="is-required">
                                <n-input-group>
                                    <n-input round placeholder="Name" type="textarea" clearable :rows="1"
                                        v-model:value="inputGroup.name"></n-input>
                                    <n-input-group-label @click="importFromDB(index)">
                                        Import data from DB
                                    </n-input-group-label>
                                    <n-input-group-label @click="deleteInputBlock(index)">
                                        Delete this entry
                                    </n-input-group-label>
                                </n-input-group>
                            </el-form-item>
                            <el-form-item label="3'UTR" label-width="100px" class="is-required">
                                <n-input round placeholder="3'UTR" type="textarea" clearable
                                    v-model:value="inputGroup.utr3" :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"></n-input>
                            </el-form-item>
                            <el-form-item label="CDS" label-width="100px" class="is-required">
                                <n-input round placeholder="CDS" type="textarea" clearable
                                    v-model:value="inputGroup.cds" :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"></n-input>
                            </el-form-item>
                            <el-form-item label="5'UTR" label-width="100px" class="is-required">
                                <n-input round placeholder="5'UTR" type="textarea" clearable
                                    v-model:value="inputGroup.utr5" :autosize="{
                                        minRows: 1,
                                        maxRows: 3,
                                    }"></n-input>
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

                <div class="font-600 text-3xl ml-20 mt-10 mb-10">
                    2.Apply Modules & Specify Parameters
                </div>
                <parameter @paramform_submitted="handleParamSubmitted" />
                <div class="mt-10 flex flex-row justify-center">
                    <el-button size="large" color="#34498E" :width="70"
                        class="text-white hover:text-white focus:text-white active:text-white text-2xl" @click="submit">
                        Submit
                    </el-button>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <el-dialog v-model="dialogVisible" title="Please select the demo result to view" width="30%">
        <el-checkbox-group v-model="demotask" :max="1">
            <el-checkbox label="Task 0001" />
            <el-checkbox label="Task 0002" />
            <el-checkbox label="Task 0003" />
        </el-checkbox-group>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button @click="opendemo">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
    <el-dialog v-model="selectionDialogVisible" title="Please select sequences as you analysis input" width="75%">
        <selectFromDB @selectionDialogVisible="handleSelectionDialogVisible"
            @inputBlocktoPass="handleInputBlocktoPass" />
    </el-dialog>
</template>
<script setup lang="ts">
/* eslint-disable camelcase */
/* eslint no-underscore-dangle: 0 */
/* eslint-disable */

import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import parameter from './parameter.vue'
import selectFromDB from './select_window.vue'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'

import { useLinearDesign2PredictionTaskSunmissionStore } from '@/store/mrna'

const taskSubmissionStore = useLinearDesign2PredictionTaskSunmissionStore()


const inputBlocks = ref([{ name: '', utr3: '', cds: '', utr5: '' }]) // Initialize with one input block
inputBlocks.value[0]['cds'] = taskSubmissionStore.cdsSequence

const inputBlocktoPass = ref({ utr3: '', cds: '', utr5: '' })

const paramform = ref([])

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('paste')

const userid = ref('')
const loading = ref(false)

const inputformValue = ref({
    phage: '',
    datatable: '',
})
const idlist = ref([])
const inputfeedback = ref('')
const validationstatus = ref()

const dialogVisible = ref(false)
const selectionDialogVisible = ref(false)
const demotask = ref([] as any[])

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
        name: 'SEQ000000',
        utr3: 'CUAAUGCCAUGAUCCAGGUGACAUGUAGAAGCUUGGAUCAGAUGCUGCACUUUGCGUUCGAUGUGGGAGCGUGCUUUCCACGACGGUGACACGCUUCCCUGGAUUGGCAGCCAGACUGCCUUCCGGGUCACUGCC',
        cds: 'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        utr5: 'AUUGAUUUU',
    })
    inputBlocks.value.push({
        name: 'SEQ000001',
        utr3: 'CUAAUGCCAUGAUCCAACAUGUGGAAGCUUGGAUCAGAUGCUGCACCCUGGAUUGGCUGCC',
        cds: 'AUGCCCAUGCCCAUCGGCAGCAAGGAGAGGCCCACCUUCUUCGAGAUCUUCAAGACCAGGUGCAACAAGGCCGACCUGGGCCCCAUCAGCCUGAACUGA',
        utr5: 'AUUGAUUGGGGUAAUAAAGGGU',
    })
}

const handleParamSubmitted = (value: any) => {
    paramform.value = value
}
const handleSelectionDialogVisible = (value: any) => {
    selectionDialogVisible.value = value
}
const handleInputBlocktoPass = (value: any) => {
    inputBlocktoPass.value = value
    if (inputBlocktoPass.value.utr3 != '') {
        inputBlocks.value[importID.value].utr3 = inputBlocktoPass.value.utr3
        inputBlocktoPass.value.utr3 = ''
    }
    if (inputBlocktoPass.value.cds != '') {
        inputBlocks.value[importID.value].cds = inputBlocktoPass.value.cds
        inputBlocktoPass.value.cds = ''
    }
    if (inputBlocktoPass.value.utr5 != '') {
        inputBlocks.value[importID.value].utr5 = inputBlocktoPass.value.utr5
        inputBlocktoPass.value.utr5 = ''
    }
}

const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.tsv)$/g) === null) {
        windowErrorMessage('Uploaded file must be in TSV format.')
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
    dialogVisible.value = true
}
const opendemo = () => {
    let thistaskid = ''
    if (demotask.value[0] === 'Task 0001') {
        thistaskid = '-95'
    } else if (demotask.value[0] === 'Task 0002') {
        thistaskid = '-94'
    } else if (demotask.value[0] === 'Task 0003') {
        thistaskid = '-93'
    }
    router.push({
        path: '/task/result/prediction',
        query: {
            taskid: encrypt(
                thistaskid,
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

const submit = async () => {
    loading.value = true
    const submitdata = new FormData()
    submitdata.append('rundemo', 'false')
    const precheck = ref(false)

    if (inputtype.value === 'upload') {
        if (typeof submitfile.value === 'undefined') {
            windowErrorMessage('Please upload file')
            precheck.value = false
        } else {
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
    } else {
        // enter
        if (inputformValue.value.phage.length === 0) {
            windowErrorMessage('Please input Antigen/TAntigen IDs')
            precheck.value = false
        } else if (inputformValue.value.datatable === '') {
            windowErrorMessage('Please select the data table that the IDs come from')
        } else {
            const checkdata = new FormData()
            checkdata.append('antigen_tantigen_ids', inputformValue.value.phage)
            checkdata.append('datatable', inputformValue.value.datatable)
            const response = await axios.post(`/analyze/prediction_inputcheck/`, checkdata, {
                baseURL: '/api',
                timeout: 10000,
            })
            const res = response.data
            idlist.value = res.idlist
            validationstatus.value = res.status
            inputfeedback.value = res.message
            if (validationstatus.value === 'failed') {
                windowErrorMessage(inputfeedback.value)
            } else if (validationstatus.value === 'success') {
                submitdata.append('datatable', inputformValue.value.datatable)
                submitdata.append('queryids', JSON.stringify(idlist.value))
                precheck.value = true
            }
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'Prediction')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('parameters', JSON.stringify(paramform.value))
        submitdata.append('submitfile', submitfile.value as File)
        const response = await axios.post(`/analyze/prediction/`, submitdata, {
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
        submitdata.append('analysistype', 'Prediction')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('codonusage', 'human')
        submitdata.append('lambda', '0')
        const response = await axios.post(`/analyze/prediction/`, submitdata, {
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
