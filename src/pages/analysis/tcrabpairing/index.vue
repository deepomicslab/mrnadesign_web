<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col outer-container min-h-screen bg-gray-100">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">TCR Alpha-Beta Chain Pairing</div>
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
                    Input Sequence
                    <n-button
                        text
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/prediction/task0001_input_seq.csv"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Example CSV sequence
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
                            accept=".csv"
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
                                        CSV file size should be less than 10MB
                                    </p>
                                    <p
                                        class="text-base mb-3 text-opacity-100"
                                        style="color: #f07167"
                                    >
                                        Supported formats: .csv
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
                            Paste a gene element sequence, or import data from DB.
                        </div>
                        <div v-for="(inputGroup, index) in inputBlocks" :key="index" class="w-190">
                            <hr class="mb-5" />
                            <el-form-item label="Select" label-width="100px" class="is-required">
                                <n-input-group class="w-full">
                                    <n-dropdown
                                        trigger="hover"
                                        :options="tcrabpairingChainRefOptions"
                                        @select="
                                            (key, option) => handleInputChain(key, option, index)
                                        "
                                    >
                                        <n-button>
                                            {{ inputGroup.chain || 'Select Chain' }}
                                        </n-button>
                                    </n-dropdown>
                                    <n-dropdown
                                        trigger="hover"
                                        :options="tcrabpairingGeneElementRefOptions"
                                        @select="
                                            (key, option) =>
                                                handleInputGeneElement(key, option, index)
                                        "
                                    >
                                        <n-button>
                                            {{ inputGroup.element || 'Select Gene Element' }}
                                        </n-button>
                                    </n-dropdown>
                                    <!-- <n-input-group-label @click="importFromDB(index)">
                                        Import data from DB
                                    </n-input-group-label> -->
                                </n-input-group>
                            </el-form-item>
                            <el-form-item label="Input" label-width="100px" class="is-required">
                                <n-input-group>
                                    <n-input
                                        round
                                        placeholder="gene element sequence"
                                        type="textarea"
                                        clearable
                                        v-model:value="inputGroup.seq"
                                        :autosize="{
                                            minRows: 1,
                                            maxRows: 3,
                                        }"
                                    ></n-input>
                                    <n-input-group-label @click="deleteInputBlock(index)">
                                        Delete this entry
                                    </n-input-group-label>
                                </n-input-group>
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
            :chain="passchain"
            :element="passelement"
            @selectionDialogVisible="handleSelectionDialogVisible"
            @inputBlocktoPass="handleInputBlocktoPass"
        />
    </el-dialog>
</template>
<script setup lang="ts">
/* eslint-disable camelcase */
/* eslint no-underscore-dangle: 0 */
/* eslint-disable */

import type { UploadFileInfo } from 'naive-ui'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import selectFromDB from './select_window.vue'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'
import { tcrabpairingChainRefOptions, tcrabpairingGeneElementRefOptions } from '@/utils/selectionoptions'
const inputBlocks = ref([{ chain: '', element: '', seq: '' }]) // Initialize with one input block
const inputBlocktoPass = ref({ chain: '', element: '', seq: '' })

const fileList = ref<UploadFileInfo[]>([])
const submitfile = ref<File>()
const inputtype = ref('paste')

const userid = ref('')
const loading = ref(false)

const selectionDialogVisible = ref(false)

const passchain = ref('')
const passelement = ref('')

const importID = ref(0)

const handleInputChain = (key: string, option: any, index: number) => {
    inputBlocks.value[index].chain = option.label
}
const handleInputGeneElement = (key: string, option: any, index: number) => {
    inputBlocks.value[index].element = option.label
}

const addInputBlock = () => {
    inputBlocks.value.push({ chain: '', element: '', seq: '' }) // Add a new input block
}
// const importFromDB = (index: number) => {
//     if (inputBlocks.value[index].chain === '') {
//         windowErrorMessage('Please select chain first')
//         return
//     }
//     if (inputBlocks.value[index].element === '') {
//         windowErrorMessage('Please select gene element first')
//         return
//     }
//     importID.value = index
//     passchain.value = inputBlocks.value[index].chain
//     passelement.value = inputBlocks.value[index].element
//     selectionDialogVisible.value = true
// }
const deleteInputBlock = (index: number) => {
    inputBlocks.value.splice(index, 1)
}
const fillSequence = () => {
    inputBlocks.value.length = 0
    inputBlocks.value.push({
        chain: 'Alpha',
        element: 'V Gene',
        seq: 'TRAV1-1',
    })
    inputBlocks.value.push({
        chain: 'Beta',
        element: 'CDR3',
        seq: 'CAVNTGGFKTIF',
    })
}

const handleSelectionDialogVisible = (value: any) => {
    selectionDialogVisible.value = value
}
const handleInputBlocktoPass = (value: any) => {
    inputBlocktoPass.value = value
    inputBlocks.value[importID.value].seq = inputBlocktoPass.value.seq
}

const handleFileListChange = (data: UploadFileInfo[]) => {
    if (data[0].name.match(/(.csv)$/g) === null) {
        windowErrorMessage('Uploaded file must be in CSV format.')
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
    let thistaskid = '-30'
    router.push({
        path: '/task/result/tcrabpairing',
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

    if (inputBlocks.value.length === 0) {
        return 1
    }
    for (let i = 0; i < inputBlocks.value.length; i += 1) {
        const block = inputBlocks.value[i]
        if (
            block.seq.length === 0
        ) {
            return 1
        }
        if (block.chain === '') {
            return 3
        }
        if (block.element === '') {
            return 4
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
        } else {
            precheck.value = false
            switch (paster_input_code) {
                case 1:
                    windowErrorMessage('Please input sequence')
                    break
                case 3:
                    windowErrorMessage('Please select chain for all input blocks')
                    break
                case 4:
                    windowErrorMessage('Please select gene element for all input blocks')
                    break
                default:
                    windowErrorMessage('Unknown error occurred in pasted sequence')
            }
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'TCR Alpha-Beta Chain Pairing')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('submitfile', submitfile.value as File)
        const response = await axios.post(`/analyze/tcrabpairing/`, submitdata, {
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
        submitdata.append('analysistype', 'TCR Alpha-Beta Chain Pairing')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        submitdata.append('codonusage', 'human')
        submitdata.append('lambda', '0')
        const response = await axios.post(`/analyze/tcrabpairing/`, submitdata, {
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
    border-radius: 8px;
    // Remove background-color since we're using Tailwind's bg-gray-100
}
</style>
