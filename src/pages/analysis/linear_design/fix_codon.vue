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
                        class="rounded w-full max-w-6xl mt-5 rounded-2xl flex-col flex justify-center items-center outer-container px-4"
                        style="box-shadow: 0 0 64px #cfd5db"
                        v-if="inputtype === 'paste'"
                    >
                        <div class="w-full px-4">
                            <div class="text-lg mb-6 w-full">
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

                            <div class="text-lg mb-6 w-full">
                                Once you've entered your sequence, select which codons you'd like to
                                optimize.
                                <br />
                                Please note: Any changes to the sequence will clear your current
                                codon selections.
                            </div>

                            <el-form-item label="Fix Codon" class="mb-6 is-required">
                                <div class="sequence-window-container">
                                    <div
                                        class="sequence-window"
                                        ref="sequenceWindow"
                                        :style="{ height: dynamicWindowHeight }"
                                        @scroll="handleSequenceScroll"
                                        @mouseup="handleMouseUp"
                                        @mouseleave="handleMouseLeave"
                                        :class="{ 'drag-selecting': isDragging }"
                                    >
                                        <div class="sequence-grid">
                                            <n-button
                                                v-for="(item, index) in yourArray"
                                                :key="index"
                                                :type="
                                                    selectedIndices.includes(index)
                                                        ? 'primary'
                                                        : 'default'
                                                "
                                                size="small"
                                                class="sequence-button"
                                                @mousedown="handleMouseDown(index, item, $event)"
                                                @mouseenter="handleMouseEnter(index)"
                                                @click="handleButtonClick(index, item)"
                                            >
                                                {{ item }}
                                            </n-button>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </div>

                <div
                    class="flex flex-row justify-center"
                    v-if="codonBlocks.length > 0 && inputtype === 'paste'"
                >
                    <div
                        class="rounded w-full max-w-6xl mt-5 rounded-2xl flex-col flex justify-center items-center outer-container py-4 px-4"
                        style="box-shadow: 0 0 64px #cfd5db; min-height: 80px"
                    >
                        <div class="w-full px-4">
                            <div class="text-lg mb-6 w-full">
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
                                            <n-select
                                                v-model:value="block.codon"
                                                :options="getCodonOptions(block.aminoacid as keyof typeof codonSelectionOptions)"
                                                placeholder="Select codon"
                                                clearable
                                                filterable
                                                value-field="key"
                                                label-field="label"
                                            />
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
import { ref, computed, watch, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { InfoFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import selectFromDB from './select_window_cds_only.vue' // fix_codon mode use cds_only window
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'
import { codonUsageOptions } from '@/utils/taskoptions'
import { codonSelectionOptions } from '@/utils/selectionoptions'

// Basic refs
const sequenceWindow = ref(null)
const inputBlocks = ref({ name: '', cds: '' })
const inputBlocktoPass = ref({ cds: '' })
const fileListFasta = ref<UploadFileInfo[]>([])
const fileListCsv = ref<UploadFileInfo[]>([])
const submitfilefasta = ref<File[]>([])
const submitfilecsv = ref<File[]>([])
const inputtype = ref('paste')
const userid = ref('')
const loading = ref(false)
const selectionDialogVisible = ref(false)
const selectedIndices = ref<number[]>([])
const yourArray = ref([] as string[])
const importID = ref(0)

// Drag selection state
const isDragging = ref(false)
const dragStartIndex = ref(-1)
const lastDragIndex = ref(-1)
const dragStartTime = ref(0)
const draggedIndices = ref<Set<number>>(new Set())
const initialSelectionState = ref<Map<number, boolean>>(new Map())
const dragThreshold = 150 // milliseconds

// Codon blocks interface and refs
interface CodonBlock {
    index: number
    aminoacid: string
    codon: string
}

const codonBlocks = ref<CodonBlock[]>([])

// Parameters
const paramform = ref({
    codonusage: '',
    lambda: 0.0,
})

// Computed properties
const chunkedCodonBlocks = computed(() => {
    const chunks = []
    for (let i = 0; i < codonBlocks.value.length; i += 3) {
        chunks.push(codonBlocks.value.slice(i, i + 3))
    }
    return chunks
})

const dynamicWindowHeight = computed(() => {
    const sequenceLength = yourArray.value.length
    if (sequenceLength === 0) return '100px'

    const aminoAcidsPerRow = 28
    const buttonHeight = 32
    const padding = 32

    const numberOfRows = Math.ceil(sequenceLength / aminoAcidsPerRow)
    const calculatedHeight = numberOfRows * buttonHeight + padding

    const minHeight = 80
    const maxHeight = 300

    const finalHeight = Math.max(minHeight, Math.min(calculatedHeight, maxHeight))

    return `${finalHeight}px`
})

// Utility functions
const resetDragState = () => {
    isDragging.value = false
    dragStartIndex.value = -1
    lastDragIndex.value = -1
    dragStartTime.value = 0
    draggedIndices.value.clear()
    initialSelectionState.value.clear()
}

const getCodonOptions = (aminoacid: keyof typeof codonSelectionOptions) => {
    return codonSelectionOptions[aminoacid] || []
}

// Direct toggle function that doesn't check drag state
const toggleSelectionDirect = (index: number, value: string) => {
    const selectedIndex = selectedIndices.value.indexOf(index)
    if (selectedIndex > -1) {
        // Deselect
        selectedIndices.value.splice(selectedIndex, 1)
        codonBlocks.value = codonBlocks.value.filter(block => block.index !== index + 1)
    } else {
        // Select
        selectedIndices.value.push(index) // 0-index
        codonBlocks.value.push({ index: index + 1, aminoacid: value, codon: '' }) // 1-index
        codonBlocks.value.sort((a, b) => a.index - b.index)
    }
}

// Fill gaps between two indices during drag
const fillDragGaps = (fromIndex: number, toIndex: number) => {
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)

    for (let i = start; i <= end; i += 1) {
        if (!draggedIndices.value.has(i)) {
            draggedIndices.value.add(i)

            // Determine if this should be selected or deselected based on drag start state
            const wasInitiallySelected =
                initialSelectionState.value.get(dragStartIndex.value) || false
            const shouldSelect = !wasInitiallySelected // Toggle behavior

            const currentlySelected = selectedIndices.value.includes(i)

            if (shouldSelect && !currentlySelected) {
                // Select this index
                selectedIndices.value.push(i)
                codonBlocks.value.push({
                    index: i + 1,
                    aminoacid: yourArray.value[i],
                    codon: '',
                })
                codonBlocks.value.sort((a, b) => a.index - b.index)
            } else if (!shouldSelect && currentlySelected) {
                // Deselect this index
                const selectedIdx = selectedIndices.value.indexOf(i)
                if (selectedIdx > -1) {
                    selectedIndices.value.splice(selectedIdx, 1)
                }
                codonBlocks.value = codonBlocks.value.filter(block => block.index !== i + 1)
            }
        }
    }
}

// Event handlers
const handleMouseDown = (index: number, value: string, event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    dragStartTime.value = Date.now()

    // Don't immediately set isDragging to true
    dragStartIndex.value = index
    lastDragIndex.value = index
    draggedIndices.value.clear()
    draggedIndices.value.add(index)
    initialSelectionState.value.clear()

    // Store initial selection state for all items
    for (let i = 0; i < yourArray.value.length; i += 1) {
        initialSelectionState.value.set(i, selectedIndices.value.includes(i))
    }
}

const handleMouseEnter = (index: number) => {
    // Only start dragging if mouse has been down long enough or moved to a different box
    if (
        dragStartIndex.value !== -1 &&
        (index !== dragStartIndex.value || Date.now() - dragStartTime.value > dragThreshold)
    ) {
        if (!isDragging.value) {
            isDragging.value = true
            // Apply the initial toggle to the start index when we start dragging
            toggleSelectionDirect(dragStartIndex.value, yourArray.value[dragStartIndex.value])
        }

        // Fill gaps between last processed index and current index
        if (lastDragIndex.value !== -1) {
            fillDragGaps(lastDragIndex.value, index)
        }
        lastDragIndex.value = index
    }
}

const handleMouseUp = () => {
    if (isDragging.value) {
        resetDragState()
    } else {
        // Just reset the drag start tracking for normal clicks
        dragStartIndex.value = -1
        dragStartTime.value = 0
    }
}

const handleMouseLeave = () => {
    if (isDragging.value) {
        resetDragState()
    }
}

const handleButtonClick = (index: number, value: string) => {
    // Only handle click if not dragging
    if (!isDragging.value) {
        toggleSelectionDirect(index, value)
    }
}

const handleGlobalMouseUp = () => {
    if (isDragging.value) {
        resetDragState()
    } else if (dragStartIndex.value !== -1) {
        // Clean up drag start state for normal clicks
        dragStartIndex.value = -1
        dragStartTime.value = 0
    }
}

const handleSequenceScroll = () => {
    // Scroll handling logic if needed
}

// File handling functions
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

// Dialog and input functions
const importFromDB = (index: number) => {
    importID.value = index
    selectionDialogVisible.value = true
}

const fillSequence = async () => {
    inputBlocks.value = {
        name: 'seq',
        cds: 'MSYYLNYYGGLGYGYDCKYSY*',
    }
    await new Promise(resolve => {
        setTimeout(resolve, 200)
    })
    codonBlocks.value.length = 0
    codonBlocks.value.push({ index: 2, aminoacid: 'S', codon: 'UCG' })
    codonBlocks.value.push({ index: 5, aminoacid: 'L', codon: 'UUA' })
    selectedIndices.value.push(1)
    selectedIndices.value.push(4)
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

// Validation functions
const checkPasteInput = () => {
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
        if (!codonBlocks.value[i].codon || codonBlocks.value[i].codon.length === 0) {
            windowErrorMessage('Please select a codon for all selected amino acids.')
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

// Form and submission functions
const resetFilterForm = () => {
    paramform.value = {
        codonusage: '',
        lambda: 0.0,
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

const gosubmithelper = () => {
    router.push({ path: '/tutorial', query: { type: 'analysis' } })
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

// Watchers
watch(
    () => inputBlocks.value.cds,
    (newVal: string) => {
        const aminoAcids = newVal.split('')
        yourArray.value = aminoAcids

        selectedIndices.value.length = 0
        codonBlocks.value.length = 0
        resetDragState()
    }
)

// Lifecycle hooks
onMounted(() => {
    document.addEventListener('mouseup', handleGlobalMouseUp)
})

onUnmounted(() => {
    document.removeEventListener('mouseup', handleGlobalMouseUp)
})

onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})
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

.sequence-window-container {
    width: 100%;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
}

.sequence-window {
    overflow-y: auto;
    overflow-x: hidden;
    padding: 16px;
    background-color: #fafafa;
    transition: height 0.3s ease;
}

.sequence-window.drag-selecting {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.sequence-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    gap: 0;
    max-width: 100%;
}

.sequence-button {
    min-width: 20px;
    width: 20px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    font-size: 12px;
    padding: 0;
    border-radius: 0;
    margin: 0;
    cursor: pointer;
    transition: background-color 0.1s ease;
}

.drag-selecting .sequence-button {
    cursor: crosshair;
}

.sequence-button:not(:last-child) {
    border-right: none;
}

.sequence-button:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}

.sequence-button:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}

.sequence-window::-webkit-scrollbar {
    width: 8px;
}

.sequence-window::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.sequence-window::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
}

.sequence-window::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}
</style>
