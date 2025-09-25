<template>
    <div class="flex flex-col w-full">
        <el-scrollbar class="w-full" ref="scrollbarRef" v-load="loading">
            <div class="flex flex-col outer-container">
                <div class="font-600 ml-20 mt-16 flex flex-row border-b-2 w-9/10 pb-5">
                    <div class="text-4xl text-[#253959]">Linear Design (Fix Codon)</div>
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
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/lineardesign/fix_codon/sequence.fasta"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Example CDS Protein Sequence
                    </n-button>
                    ,
                    <n-button
                        text
                        href="https://mrnadesign.deepomics.org/dataExample/mrna/lineardesign/fix_codon/fix_codon_config.csv"
                        tag="a"
                        target="_blank"
                        type="primary"
                        class="text-lg"
                    >
                        See Example Fix Codon Config
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
                    <div class="rounded w-200 h-90 mt-5 rounded-2xl" v-if="inputtype === 'upload'">
                        <n-grid :cols="2" :x-gap="12">
                            <n-grid-item style="box-shadow: 0 0 64px #cfd5db">
                                <n-upload
                                    :max="1"
                                    v-model:file-list="fileListFasta"
                                    directory-dnd
                                    :default-upload="false"
                                    accept=".fasta,.fa"
                                    @update:file-list="handleFileListChangeFasta"
                                >
                                    <n-upload-dragger>
                                        <div class="flex flex-col justify-center items-center">
                                            <div class="text-[90px] mt-10" style="color: #028090">
                                                <i-fa-cloud-upload />
                                            </div>
                                            <p
                                                class="text-h5 mt-3 font-light"
                                                style="color: #028090"
                                            >
                                                Click or drag a file to this area to upload Amino
                                                Acid Sequence
                                            </p>

                                            <p
                                                class="text-base mt-3 mb-3 text-opacity-100"
                                                style="color: #f07167"
                                            >
                                                fasta file size should be less than 10MB
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
                            </n-grid-item>
                            <n-grid-item style="box-shadow: 0 0 64px #cfd5db">
                                <n-upload
                                    :max="1"
                                    v-model:file-list="fileListCsv"
                                    directory-dnd
                                    :default-upload="false"
                                    accept=".csv"
                                    @update:file-list="handleFileListChangeCsv"
                                >
                                    <n-upload-dragger>
                                        <div class="flex flex-col justify-center items-center">
                                            <div class="text-[90px] mt-10" style="color: #028090">
                                                <i-fa-cloud-upload />
                                            </div>
                                            <p
                                                class="text-h5 mt-3 font-light"
                                                style="color: #028090"
                                            >
                                                Click or drag a file to this area to upload Fix
                                                Codon Configuration File
                                            </p>

                                            <p
                                                class="text-base mt-3 mb-3 text-opacity-100"
                                                style="color: #f07167"
                                            >
                                                fasta file size should be less than 10MB
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
                            </n-grid-item>
                        </n-grid>
                    </div>

                    <div
                        class="rounded w-240 mt-5 rounded-2xl flex-col flex justify-center items-center outer-container"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div vclass="w-150">
                            <div class="text-lg mb-6 w-190">
                                Paste your amino acid sequence in the box below.
                                <br />
                                Or import data from our database, or use the sample input.
                            </div>
                            <hr class="mb-5" />
                            <el-form-item label="Name" label-width="100px" class="is-required">
                                <n-input-group>
                                    <n-input
                                        round
                                        placeholder="Name"
                                        type="textarea"
                                        clearable
                                        :rows="1"
                                        v-model:value="inputBlocks.name"
                                    ></n-input>
                                    <n-input-group-label @click="importFromDB(0)">
                                        Import data from DB
                                    </n-input-group-label>
                                </n-input-group>
                            </el-form-item>
                            <el-form-item label="CDS" label-width="100px" class="is-required">
                                <n-input-group>
                                    <n-input
                                        round
                                        placeholder="CDS"
                                        type="textarea"
                                        clearable
                                        v-model:value="inputBlocks.cds"
                                        :autosize="{
                                            minRows: 1,
                                            maxRows: 3,
                                        }"
                                    ></n-input>
                                    <n-input-group-label @click="fillSequence">
                                        Sample Input
                                    </n-input-group-label>
                                </n-input-group>
                            </el-form-item>
                            <hr class="mb-5" />
                            <div class="text-lg mb-6 w-190">
                                Once you've entered your sequence, select which codons you'd like to
                                optimize.
                                <br />
                                Please note: Any changes to the sequence will clear your current
                                codon selections.
                            </div>
                            <el-form-item label="Fix codon" label-width="100px" class="is-required">
                                <n-space vertical>
                                    <n-space vertical>
                                        <n-slider
                                            v-model:value="sliderValue"
                                            range
                                            :step="1"
                                            :min="0"
                                            :max="yourArray.length - 1"
                                        />
                                        <n-space style="align-items: center">
                                            <n-input-number
                                                v-model:value="sliderValue[0]"
                                                size="small"
                                                :min="0"
                                                :max="yourArray.length - 1"
                                            />
                                            <n-input-number
                                                v-model:value="sliderValue[1]"
                                                size="small"
                                                :min="0"
                                                :max="yourArray.length - 1"
                                            />
                                        </n-space>
                                    </n-space>
                                    <div
                                        v-for="(chunk, index) in chunkedArray"
                                        :key="index"
                                        style="
                                            display: flex;
                                            flex-wrap: wrap;
                                            gap: 8px;
                                            margin-bottom: 8px;
                                            justify-content: center;
                                        "
                                    >
                                        <n-button
                                            v-for="item in chunk"
                                            :key="item.index"
                                            :type="
                                                selectedIndices.includes(item.index)
                                                    ? 'primary'
                                                    : 'default'
                                            "
                                            size="small"
                                            @click="handleButtonClick(item.index, item.value)"
                                        >
                                            {{ item.value }}
                                        </n-button>
                                    </div>
                                </n-space>
                            </el-form-item>
                        </div>
                    </div>
                </div>

                <div class="flex flex-row justify-center" v-if="codonBlocks.length > 0">
                    <div
                        class="rounded w-240 mt-5 rounded-2xl flex-col flex justify-center items-center outer-container py-4 px-158"
                        style="box-shadow: 0 0 64px #cfd5db; min-height: 80px"
                    >
                        <div vclass="w-150">
                            <div class="text-lg mb-6 w-190">
                                <div class="mb-5">
                                    Fix the codons of the selected amino acids below.
                                </div>

                                <div
                                    v-for="(chunk, chunkIndex) in chunkedCodonBlocks"
                                    :key="chunkIndex"
                                    class="flex flex-row gap-4 w-full mt-4"
                                >
                                    <div
                                        v-for="block in chunk"
                                        :key="block.index"
                                        class="flex flex-row items-center gap-2 custom-required"
                                        style="width: calc(33.333% - 10.67px)"
                                    >
                                        <span
                                            class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded border border-blue-200"
                                        >
                                            {{ block.index }}
                                        </span>
                                        <span
                                            class="text-sm font-medium text-gray-700 whitespace-nowrap"
                                        >
                                            {{ block.aminoacid }}
                                        </span>
                                        <div class="flex-1">
                                            <n-input-group>
                                                <n-input
                                                    round
                                                    placeholder="Codon"
                                                    type="textarea"
                                                    clearable
                                                    :rows="1"
                                                    v-model:value="block.codon"
                                                ></n-input>
                                            </n-input-group>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
import selectFromDB from './select_window_cds_only.vue' // fix_codon mode use cds_only window
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'
import { codonUsageOptions } from '@/utils/taskoptions'

const inputBlocks = ref({ name: '', cds: '' })
const inputBlocktoPass = ref({ cds: '' })

interface CodonBlock {
    index: number
    aminoacid: string
    codon: string
}

const codonBlocks = ref<CodonBlock[]>([])
const chunkedCodonBlocks = computed(() => {
    const chunks = []
    for (let i = 0; i < codonBlocks.value.length; i += 3) {
        chunks.push(codonBlocks.value.slice(i, i + 3))
    }
    return chunks
})

const fileListFasta = ref<UploadFileInfo[]>([])
const fileListCsv = ref<UploadFileInfo[]>([])
const submitfilefasta = ref<File[]>([])
const submitfilecsv = ref<File[]>([])
const inputtype = ref('upload')

const userid = ref('')
const loading = ref(false)

const selectionDialogVisible = ref(false)

const sliderValue = ref([1, 5])
const selectedIndices = ref<number[]>([])

const yourArray = ref([] as string[])
watch(
    () => inputBlocks.value.cds,
    (newVal: string) => {
        const aminoAcids = newVal.split('')
        yourArray.value = aminoAcids

        selectedIndices.value.length = 0
        codonBlocks.value.length = 0
    }
)

const filteredArray = computed(() => {
    return yourArray.value
        .map((value, index) => ({ value, index }))
        .slice(sliderValue.value[0], sliderValue.value[1] + 1)
})

const chunkedArray = computed(() => {
    const chunks = []
    for (let i = 0; i < filteredArray.value.length; i += 20) {
        chunks.push(filteredArray.value.slice(i, i + 20))
    }
    return chunks
})

const importID = ref(0)

const importFromDB = (index: number) => {
    importID.value = index
    selectionDialogVisible.value = true
}
const fillSequence = async () => {
    inputBlocks.value = {
        name: 'seq',
        cds: 'MSYYLNYYGGLGYGYDCKYSY*',
    }
    // eslint-disable-next-line no-promise-executor-return
    await new Promise(resolve => setTimeout(resolve, 200)) // watch inputBlocks 的时候，会清除 codonBlocks 和 selectedIndices，等待 0.2 秒，等 watch 跑完 再更新 codonBlocks 和 selectedIndices
    codonBlocks.value.length = 0
    codonBlocks.value.push({ index: 2, aminoacid: 'S', codon: 'UCA' }) // this 0-index is required by the linear design software which will be passed to the backend as parameters
    codonBlocks.value.push({ index: 5, aminoacid: 'L', codon: 'CUA' })
    selectedIndices.value.push(1) // this is normally 0-index
    selectedIndices.value.push(4)
}
const handleButtonClick = (index: number, value: string) => {
    console.log(index, value)
    const selectedIndex = selectedIndices.value.indexOf(index)
    // select
    if (selectedIndex > -1) {
        selectedIndices.value.splice(selectedIndex, 1)
        codonBlocks.value = codonBlocks.value.filter(block => block.index !== index + 1)
    }
    // deselect
    else {
        selectedIndices.value.push(index) // 0-index
        codonBlocks.value.push({ index: index + 1, aminoacid: value, codon: '' }) // 1-index
        codonBlocks.value.sort((a, b) => a.index - b.index)
    }
}

const handleSelectionDialogVisible = (value: any) => {
    selectionDialogVisible.value = value
}
const handleInputBlocktoPass = (value: any) => {
    inputBlocktoPass.value = value
    if (inputBlocktoPass.value.cds !== '') {
        inputBlocks.value.cds = inputBlocktoPass.value.cds
        inputBlocktoPass.value.cds = ''
    }
}

const checkfile = (data: UploadFileInfo, type: string) => {
    if (type === 'fasta') {
        if (data.name.match(/(.fasta)$/g) === null && data.name.match(/(.fa)$/g) === null) {
            windowErrorMessage('Uploaded file must be in fasta format.')
            return false
        }
    } else if (type === 'csv') {
        if (data.name.match(/(.csv)$/g) === null) {
            windowErrorMessage('Uploaded file must be in csv format.')
            return false
        }
    }

    if (data.file?.size === 0 || data.file?.size === undefined) {
        windowErrorMessage('Uploaded file cannot be empty.')
        return false
    }
    if (data.file.size / 1024 / 1024 > 10) {
        windowErrorMessage('Uploaded file cannot exceed 10MB.')
        return false
    }
    return true
}

const handleFileListChangeFasta = (data: UploadFileInfo[]) => {
    if (data.length > 0) {
        const f = data[0]
        if (checkfile(f, 'fasta') === false) {
            data.pop()
        }
    }
}
const handleFileListChangeCsv = (data: UploadFileInfo[]) => {
    if (data.length > 0) {
        const f = data[0]
        if (checkfile(f, 'csv') === false) {
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
                '-97',
                'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
            ),
        },
    })
}

const checkPasteInput = () => {
    // error code: 0 for true, 1 for error
    const isOnlyLetters = (str: string) => {
        const regex = /^[A-Za-z]+$/
        return regex.test(str)
    }
    const isOnlyLettersAndAsterisk = (str: string) => {
        const regex = /^[A-Za-z*]+$/
        return regex.test(str)
    }
    const isOnlyLettersAndDigits = (str: string) => {
        const regex = /^[A-Za-z0-9]+$/
        return regex.test(str)
    }

    const block = inputBlocks.value
    if (block.name.length === 0 || block.cds.length === 0) {
        windowErrorMessage('Please input sequence')
        return 1
    }
    if (!isOnlyLettersAndDigits(block.name) || !isOnlyLettersAndAsterisk(block.cds)) {
        windowErrorMessage(
            'Only letters and digits are allowed in the name; Only letters and asterisk are allowed in the sequences'
        )
        return 2
    }
    for (let i = 0; i < codonBlocks.value.length; i += 1) {
        if (codonBlocks.value[i].codon.length === 0) {
            windowErrorMessage('Please fill in all the codons you want to fix.')
            return 3
        }
        if (!isOnlyLetters(codonBlocks.value[i].codon)) {
            windowErrorMessage('Only letters are allowed in the codons.')
            return 4
        }
        if (codonBlocks.value[i].codon.length !== 3) {
            windowErrorMessage('The length of each codon must be 3.')
            return 5
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
        if (fileListFasta.value.length !== 1 || fileListCsv.value.length !== 1) {
            windowErrorMessage('Please upload file')
            precheck.value = false
        } else {
            fileListFasta.value.forEach(element => {
                if (element.file) {
                    submitfilefasta.value.push(element.file)
                }
            })
            fileListCsv.value.forEach(element => {
                if (element.file) {
                    submitfilecsv.value.push(element.file)
                }
            })
            precheck.value = true
        }
    } else if (inputtype.value === 'paste') {
        const paste_input_code = checkPasteInput()
        if (paste_input_code === 0) {
            submitdata.append('seq', JSON.stringify(inputBlocks.value))
            precheck.value = true
        } else {
            precheck.value = false
        }
    }

    if (precheck.value) {
        submitdata.append('analysistype', 'Linear Design')
        submitdata.append('lineardesignanalysistype', 'fix_codon')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', inputtype.value)
        submitdata.append('parameters_taskparam', JSON.stringify(paramform.value))
        submitdata.append('parameters_fixcodonconfig', JSON.stringify(codonBlocks.value))
        submitdata.append('submitfilefasta', submitfilefasta.value[0] as File)
        submitdata.append('submitfilecsv', submitfilecsv.value[0] as File)
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
        submitdata.append('lineardesignanalysistype', 'fix_codon')
        submitdata.append('userid', userid.value)
        submitdata.append('inputtype', 'rundemo')
        paramform.value.codonusage = 'human'
        paramform.value.lambda = 0
        submitdata.append('parameters_taskparam', JSON.stringify(paramform.value))
        submitdata.append('parameters_fixcodonconfig', JSON.stringify({}))
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

.custom-required::before {
    content: '*';
    color: #f4aaa9;
    margin-right: 2px;
}
</style>
a
