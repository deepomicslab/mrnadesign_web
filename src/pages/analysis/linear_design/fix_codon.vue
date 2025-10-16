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

                    <div class="sequence-input-container" v-if="inputtype === 'paste'">
                        <div class="w-full px-6">
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
                                    <n-input-group-label @click="importFromDB">
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
                                <div class="sequence-viewer-container">
                                    <!-- Controls Bar -->
                                    <div class="controls-bar">
                                        <div class="sequence-info">
                                            <span class="sequence-name">
                                                {{ inputBlocks.name || 'Sequence' }}
                                            </span>
                                        </div>
                                        <div class="zoom-controls">
                                            <el-button
                                                size="small"
                                                @click="zoomOut"
                                                :disabled="zoomLevel <= 0.5"
                                            >
                                                <el-icon><ZoomOut /></el-icon>
                                            </el-button>
                                            <span class="zoom-level">
                                                {{ Math.round(zoomLevel * 100) }}%
                                            </span>
                                            <el-button
                                                size="small"
                                                @click="zoomIn"
                                                :disabled="zoomLevel >= 3"
                                            >
                                                <el-icon><ZoomIn /></el-icon>
                                            </el-button>
                                            <el-button size="small" @click="resetZoom">
                                                RESET
                                            </el-button>
                                        </div>
                                    </div>

                                    <!-- Progress Bar (Two-part vertical layout) -->
                                    <div class="progress-bar-container">
                                        <!-- Upper part: Info display -->
                                        <div class="progress-info-section">
                                            <span class="progress-info-text">
                                                Length: {{ yourArray.length }} | Selected:
                                                {{ selectedIndices.length }}
                                            </span>
                                        </div>

                                        <!-- Lower part: Position indicators with mask -->
                                        <div
                                            class="progress-position-section"
                                            ref="progressContainer"
                                        >
                                            <div class="position-indicators">
                                                <div
                                                    v-for="(char, index) in yourArray"
                                                    :key="`progress-${index}`"
                                                    class="position-block"
                                                    :class="{
                                                        selected: selectedIndices.includes(index),
                                                    }"
                                                    :style="getProgressBlockStyle(index)"
                                                ></div>
                                            </div>

                                            <!-- Position indices -->
                                            <div class="position-indices">
                                                <span
                                                    v-for="(pos, index) in progressPositions"
                                                    :key="`progress-pos-${pos}`"
                                                    class="progress-position-label"
                                                    :style="getProgressPositionStyle(index)"
                                                    v-show="shouldShowProgressPosition(pos)"
                                                >
                                                    {{ pos }}
                                                </span>
                                            </div>

                                            <!-- Viewport mask without range display -->
                                            <div
                                                class="viewport-mask"
                                                :style="viewportMaskStyle"
                                                @mousedown="handleMaskBodyMouseDown"
                                            >
                                                <div
                                                    class="mask-handle mask-handle-left"
                                                    @mousedown.stop="handleLeftHandleMouseDown"
                                                ></div>
                                                <div
                                                    class="mask-handle mask-handle-right"
                                                    @mousedown.stop="handleRightHandleMouseDown"
                                                ></div>
                                            </div>

                                            <!-- Range display positioned at container level -->
                                            <div
                                                class="mask-range-display"
                                                :style="maskRangeDisplayStyle"
                                            >
                                                {{ maskRangeText }}
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Sequence Display Window -->
                                    <div class="sequence-window">
                                        <div
                                            class="sequence-container"
                                            ref="sequenceContainer"
                                            @scroll="handleSequenceScroll"
                                            @wheel="handleWheel"
                                        >
                                            <!-- Position labels -->
                                            <div
                                                class="sequence-position-labels"
                                                :style="sequencePositionLabelsStyle"
                                            >
                                                <span
                                                    v-for="(pos, index) in visiblePositions"
                                                    :key="`seq-pos-${pos}`"
                                                    class="sequence-position-label"
                                                    :style="getSequencePositionStyle(index)"
                                                    v-show="shouldShowSequencePosition(pos)"
                                                >
                                                    {{ pos }}
                                                </span>
                                            </div>

                                            <!-- Sequence display -->
                                            <div
                                                class="sequence-display"
                                                :style="sequenceDisplayStyle"
                                            >
                                                <span
                                                    v-for="(char, index) in visibleSequence"
                                                    :key="`char-${viewportStart + index}`"
                                                    class="sequence-char"
                                                    :class="{
                                                        selected: selectedIndices.includes(
                                                            viewportStart + index
                                                        ),
                                                    }"
                                                    :style="getCharStyle(index)"
                                                    @mousedown="
                                                        handleCharMouseDown(
                                                            viewportStart + index,
                                                            $event
                                                        )
                                                    "
                                                    @mousemove="
                                                        handleCharMouseMove(viewportStart + index)
                                                    "
                                                    @mouseup="handleCharMouseUp"
                                                    :title="`Position: ${
                                                        viewportStart + index + 1
                                                    }, AA: ${char}`"
                                                >
                                                    {{ char }}
                                                </span>
                                            </div>
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
                    <div class="codon-config-container">
                        <div class="w-full px-6">
                            <div class="text-lg mb-6 w-full calibri-font">
                                <div class="mb-5">
                                    Fix the codons of the selected amino acids below.
                                </div>

                                <div class="codon-blocks-grid">
                                    <div
                                        v-for="block in codonBlocks"
                                        :key="block.index"
                                        class="codon-block-item"
                                    >
                                        <div class="codon-label calibri-font">
                                            <span class="index-number">{{ block.index }}</span>
                                            <span class="colon-separator">:</span>
                                            <span class="amino-letter">{{ block.aminoacid }}</span>
                                        </div>
                                        <div class="codon-select-wrapper">
                                            <n-select
                                                v-model:value="block.codon"
                                                :options="getCodonOptions(block.aminoacid as keyof typeof codonSelectionOptions)"
                                                placeholder="---"
                                                clearable
                                                filterable
                                                value-field="key"
                                                label-field="label"
                                                size="small"
                                                class="calibri-select"
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
                                        <el-button type="info" @click="resetFilterForm">
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
import { ref, computed, watch, onBeforeMount, onMounted, onUnmounted, nextTick } from 'vue'
import { InfoFilled, ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import selectFromDB from './select_window_cds_only.vue'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import { encrypt } from '@/utils/crypto'
import { windowErrorMessage, windowSuccessMessage } from '@/utils/windowFunctions'
import { codonUsageOptions } from '@/utils/taskoptions'
import { codonSelectionOptions } from '@/utils/selectionoptions'

// Interfaces
interface CodonBlock {
    index: number
    aminoacid: string
    codon: string
}

// Router
const router = useRouter()

// Element refs
const progressContainer = ref<HTMLElement | null>(null)
const sequenceContainer = ref<HTMLElement | null>(null)

// Basic reactive data
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
const codonBlocks = ref<CodonBlock[]>([])

// Parameters form
const paramform = ref({
    codonusage: '',
    lambda: 0.0,
})

// Viewport and zoom state
const zoomLevel = ref(1.0)
const viewportStart = ref(0)
const viewportEnd = ref(0)

// Selection state
const isDragging = ref(false)
const dragStart = ref(-1)
const dragEnd = ref(-1)
const mouseStartPos = ref({ x: 0, y: 0 })

// Mask drag state
const maskDrag = ref({
    isDragging: false,
    isLeftHandle: false,
    isRightHandle: false,
    startX: 0,
    originalLeft: 0,
    originalWidth: 0,
})

// Constants
const CHAR_BASE_SIZE = 16
const MIN_ZOOM = 0.5
const MAX_ZOOM = 3.0
const DRAG_THRESHOLD = 3

// Utility functions
const getCodonOptions = (aminoacid: keyof typeof codonSelectionOptions) => {
    return codonSelectionOptions[aminoacid] || []
}

// Core computed properties
const charWidth = computed(() => Math.max(12, CHAR_BASE_SIZE * zoomLevel.value))

const actualContainerWidth = computed(() => {
    return progressContainer.value?.offsetWidth || 1000
})

const maxVisibleChars = computed(() => {
    return Math.floor(actualContainerWidth.value / charWidth.value)
})

// Ensure viewport end is properly calculated and bounded
const ensureViewportBounds = () => {
    const maxStart = Math.max(0, yourArray.value.length - maxVisibleChars.value)
    viewportStart.value = Math.max(0, Math.min(viewportStart.value, maxStart))
    viewportEnd.value = Math.min(
        yourArray.value.length,
        viewportStart.value + maxVisibleChars.value
    )
}

// Watch for changes that require viewport recalculation
watch([() => yourArray.value.length, maxVisibleChars], () => {
    ensureViewportBounds()
})

watch(viewportStart, () => {
    ensureViewportBounds()
})

// Sequence display computeds
const visibleSequence = computed(() => {
    return yourArray.value.slice(viewportStart.value, viewportEnd.value).join('')
})

const visiblePositions = computed(() => {
    const count = viewportEnd.value - viewportStart.value
    return Array.from({ length: count }, (_, i) => viewportStart.value + i + 1)
})

const sequencePositionLabelsStyle = computed(() => ({
    width: `${visibleSequence.value.length * charWidth.value}px`,
}))

// Progress bar computeds
const progressPositions = computed(() => {
    return Array.from({ length: yourArray.value.length }, (_, i) => i + 1)
})

const positionLabelInterval = computed(() => {
    const { length } = yourArray.value
    if (length <= 20) return 1
    if (length <= 100) return 5
    if (length <= 200) return 10
    if (length <= 1000) return 50
    return Math.ceil(length / 20)
})

// Viewport mask style
const viewportMaskStyle = computed(() => {
    if (yourArray.value.length === 0) {
        return { left: '0%', width: '100%' }
    }

    const totalLength = yourArray.value.length
    const startPercent = (viewportStart.value / totalLength) * 100
    const endPercent = (viewportEnd.value / totalLength) * 100
    const widthPercent = endPercent - startPercent

    return {
        left: `${Math.max(0, startPercent)}%`,
        width: `${Math.max(1, widthPercent)}%`,
    }
})

const maskRangeText = computed(() => {
    return `${viewportStart.value + 1}-${viewportEnd.value}`
})

// Range display positioning computed
const maskRangeDisplayStyle = computed(() => {
    if (!progressContainer.value || yourArray.value.length === 0) {
        return { display: 'none' }
    }

    const containerWidth = progressContainer.value.offsetWidth
    const totalLength = yourArray.value.length
    const startPercent = (viewportStart.value / totalLength) * 100
    const endPercent = (viewportEnd.value / totalLength) * 100

    // Calculate mask positions
    const maskRightPercent = endPercent
    const maskRightPx = (maskRightPercent / 100) * containerWidth
    const maskLeftPercent = startPercent
    const maskLeftPx = (maskLeftPercent / 100) * containerWidth

    // Estimate the width of the range display (approximate)
    const rangeDisplayWidth = 60 // rough estimate in pixels

    // Check if there's enough space on the right
    const spaceOnRight = containerWidth - maskRightPx
    const shouldPositionLeft = spaceOnRight < rangeDisplayWidth + 10 // 10px buffer

    if (shouldPositionLeft) {
        // Position to the left of the mask
        return {
            position: 'absolute' as const,
            top: '20px',
            left: `${Math.max(0, maskLeftPx - rangeDisplayWidth - 8)}px`, // 8px offset from mask left edge
            zIndex: '100',
        }
    }
    // Position to the right of the mask (original behavior)
    return {
        position: 'absolute' as const,
        top: '20px',
        left: `${maskRightPx + 8}px`, // 8px offset from mask right edge
        zIndex: '100',
    }
})

// Fixed: Use consistent positioning for both blocks and labels
const getProgressBlockStyle = (index: number) => {
    const blockWidth = actualContainerWidth.value / yourArray.value.length
    return {
        position: 'absolute' as const,
        left: `${index * blockWidth}px`,
        width: `${blockWidth}px`,
        height: '100%',
    }
}

const getProgressPositionStyle = (index: number) => {
    const blockWidth = actualContainerWidth.value / yourArray.value.length
    return {
        position: 'absolute' as const,
        left: `${index * blockWidth}px`,
        width: `${blockWidth}px`,
    }
}

// Style functions
const sequenceDisplayStyle = computed(() => ({
    width: `${visibleSequence.value.length * charWidth.value}px`,
    fontSize: `${Math.max(12, CHAR_BASE_SIZE * zoomLevel.value)}px`,
}))

const shouldShowProgressPosition = (pos: number) => {
    return (pos - 1) % positionLabelInterval.value === 0
}

const getSequencePositionStyle = (index: number) => ({
    left: `${index * charWidth.value}px`,
    width: `${charWidth.value}px`,
})

const shouldShowSequencePosition = (pos: number) => {
    const step = Math.max(1, Math.floor(8 / zoomLevel.value))
    return (pos - 1) % (step * 5) === 0
}

// Helper functions
const isDragInRange = (index: number) => {
    if (dragStart.value === -1 || dragEnd.value === -1) return false
    const start = Math.min(dragStart.value, dragEnd.value)
    const end = Math.max(dragStart.value, dragEnd.value)
    return index >= start && index <= end
}

const getCharStyle = (index: number) => {
    const globalIndex = viewportStart.value + index
    const isSelected = selectedIndices.value.includes(globalIndex)
    const isDragSelected = isDragging.value && isDragInRange(globalIndex)

    return {
        width: `${charWidth.value}px`,
        backgroundColor: isSelected || isDragSelected ? '#df5d5d' : '#53dee6',
        color: '#000000',
        fontFamily: 'Calibri, sans-serif',
        fontWeight: isSelected || isDragSelected ? 'bold' : 'normal',
    }
}

const updateViewportFromPercent = (leftPercent: number, widthPercent: number) => {
    const totalLength = yourArray.value.length
    const newStart = Math.floor((leftPercent / 100) * totalLength)
    const newCount = Math.floor((widthPercent / 100) * totalLength)

    viewportStart.value = Math.max(0, Math.min(newStart, totalLength - 1))

    // Adjust zoom to fit the selected range
    if (newCount > 0) {
        const targetCharWidth = actualContainerWidth.value / newCount
        zoomLevel.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetCharWidth / CHAR_BASE_SIZE))
    }
}

const getCharIndexFromMouse = (event: MouseEvent) => {
    const sequenceDisplay = document.querySelector('.sequence-display')
    if (!sequenceDisplay) return -1

    const rect = sequenceDisplay.getBoundingClientRect()
    const relativeX = event.clientX - rect.left
    const charIndex = Math.floor(relativeX / charWidth.value)
    const globalIndex = viewportStart.value + charIndex

    return globalIndex >= 0 && globalIndex < yourArray.value.length ? globalIndex : -1
}

// Zoom functions
const zoomIn = () => {
    zoomLevel.value = Math.min(MAX_ZOOM, zoomLevel.value + 0.2)
}

const zoomOut = () => {
    zoomLevel.value = Math.max(MIN_ZOOM, zoomLevel.value - 0.2)
}

const resetZoom = () => {
    zoomLevel.value = 1.0
    viewportStart.value = 0
}

// Selection functions
const applyDragSelection = () => {
    if (dragStart.value === -1 || dragEnd.value === -1) return

    const start = Math.min(dragStart.value, dragEnd.value)
    const end = Math.max(dragStart.value, dragEnd.value)
    const rangeIndices = []

    for (let i = start; i <= end; i += 1) {
        rangeIndices.push(i)
    }

    // Check if all indices in range are selected
    const allSelected = rangeIndices.every(index => selectedIndices.value.includes(index))

    if (allSelected) {
        // Deselect all in range
        rangeIndices.forEach(index => {
            const selectedIndex = selectedIndices.value.indexOf(index)
            if (selectedIndex > -1) {
                selectedIndices.value.splice(selectedIndex, 1)
            }
        })
        // Remove from codon blocks
        codonBlocks.value = codonBlocks.value.filter(
            block => !rangeIndices.includes(block.index - 1)
        )
    } else {
        // Select all unselected in range
        rangeIndices.forEach(index => {
            if (!selectedIndices.value.includes(index)) {
                selectedIndices.value.push(index)
                codonBlocks.value.push({
                    index: index + 1,
                    aminoacid: yourArray.value[index],
                    codon: '',
                })
            }
        })
        codonBlocks.value.sort((a, b) => a.index - b.index)
    }
}

const handleCharClick = (index: number, char: string) => {
    const selectedIndex = selectedIndices.value.indexOf(index)
    if (selectedIndex > -1) {
        selectedIndices.value.splice(selectedIndex, 1)
        codonBlocks.value = codonBlocks.value.filter(block => block.index !== index + 1)
    } else {
        selectedIndices.value.push(index)
        codonBlocks.value.push({ index: index + 1, aminoacid: char, codon: '' })
        codonBlocks.value.sort((a, b) => a.index - b.index)
    }
}

const handleDocumentMouseMove = (event: MouseEvent) => {
    const deltaX = Math.abs(event.clientX - mouseStartPos.value.x)
    const deltaY = Math.abs(event.clientY - mouseStartPos.value.y)

    if (!isDragging.value && (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD)) {
        isDragging.value = true
    }

    if (isDragging.value) {
        const newIndex = getCharIndexFromMouse(event)
        if (newIndex !== -1) {
            dragEnd.value = newIndex
        }
    }
}

const handleDocumentMouseUp = () => {
    document.removeEventListener('mousemove', handleDocumentMouseMove)
    document.removeEventListener('mouseup', handleDocumentMouseUp)

    if (isDragging.value) {
        applyDragSelection()
    } else {
        // Simple click - only call handleCharClick if we have a valid drag start
        // eslint-disable-next-line no-lonely-if
        if (dragStart.value >= 0 && dragStart.value < yourArray.value.length) {
            const char = yourArray.value[dragStart.value]
            handleCharClick(dragStart.value, char)
        }
    }

    isDragging.value = false
    dragStart.value = -1
    dragEnd.value = -1
}

// Mouse event handlers
const handleCharMouseDown = (index: number, event: MouseEvent) => {
    event.preventDefault()

    mouseStartPos.value = { x: event.clientX, y: event.clientY }
    dragStart.value = index
    dragEnd.value = index

    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('mouseup', handleDocumentMouseUp)
}

const handleCharMouseMove = (index: number) => {
    if (isDragging.value) {
        dragEnd.value = index
    }
}

const handleMaskMouseMove = (event: MouseEvent) => {
    if (!maskDrag.value.isDragging || !progressContainer.value) return

    const deltaX = event.clientX - maskDrag.value.startX
    const containerWidth = progressContainer.value.offsetWidth
    const deltaPercent = (deltaX / containerWidth) * 100

    let newLeft = maskDrag.value.originalLeft
    let newWidth = maskDrag.value.originalWidth

    if (maskDrag.value.isLeftHandle) {
        newLeft = Math.max(
            0,
            Math.min(
                maskDrag.value.originalLeft + deltaPercent,
                maskDrag.value.originalLeft + maskDrag.value.originalWidth - 1
            )
        )
        newWidth = maskDrag.value.originalLeft + maskDrag.value.originalWidth - newLeft
    } else if (maskDrag.value.isRightHandle) {
        newWidth = Math.max(
            1,
            Math.min(100 - maskDrag.value.originalLeft, maskDrag.value.originalWidth + deltaPercent)
        )
    } else {
        // Body drag
        newLeft = Math.max(
            0,
            Math.min(100 - maskDrag.value.originalWidth, maskDrag.value.originalLeft + deltaPercent)
        )
    }

    updateViewportFromPercent(newLeft, newWidth)
}

const handleMaskMouseUp = () => {
    document.removeEventListener('mousemove', handleMaskMouseMove)
    document.removeEventListener('mouseup', handleMaskMouseUp)

    maskDrag.value.isDragging = false
}

// Mask drag handlers
const handleMaskMouseDown = (event: MouseEvent, type: 'body' | 'left' | 'right') => {
    event.preventDefault()
    event.stopPropagation()

    const currentStyle = viewportMaskStyle.value

    maskDrag.value = {
        isDragging: true,
        isLeftHandle: type === 'left',
        isRightHandle: type === 'right',
        startX: event.clientX,
        originalLeft: parseFloat(currentStyle.left.replace('%', '')),
        originalWidth: parseFloat(currentStyle.width.replace('%', '')),
    }

    document.addEventListener('mousemove', handleMaskMouseMove)
    document.addEventListener('mouseup', handleMaskMouseUp)
}

// Convenience handlers for template
const handleMaskBodyMouseDown = (event: MouseEvent) => handleMaskMouseDown(event, 'body')
const handleLeftHandleMouseDown = (event: MouseEvent) => handleMaskMouseDown(event, 'left')
const handleRightHandleMouseDown = (event: MouseEvent) => handleMaskMouseDown(event, 'right')

const handleCharMouseUp = () => {}
const handleSequenceScroll = () => {}

const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
        event.preventDefault()
        if (event.deltaY < 0) {
            zoomIn()
        } else {
            zoomOut()
        }
    }
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
const importFromDB = () => {
    selectionDialogVisible.value = true
}

const fillSequence = async () => {
    inputBlocks.value = {
        name: 'seq',
        cds: 'MSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSYMSYYLNYYGGLGYGYDCKYSY*',
    }
    await nextTick()
    selectedIndices.value.length = 0
    selectedIndices.value = [1, 4]
    codonBlocks.value.length = 0
    codonBlocks.value = [
        { index: 2, aminoacid: 'S', codon: 'UCG' },
        { index: 5, aminoacid: 'L', codon: 'UUA' },
    ]
}

const handleSelectionDialogVisible = (value: boolean) => {
    selectionDialogVisible.value = value
}

const handleInputBlocktoPass = (value: { cds: string }) => {
    inputBlocktoPass.value = value
    if (inputBlocktoPass.value.cds !== '') {
        inputBlocks.value.cds = inputBlocktoPass.value.cds
        inputBlocktoPass.value.cds = ''
    }
}

// Validation functions
const checkPasteInput = () => {
    const isOnlyLetters = (str: string) => /^[A-Za-z]+$/.test(str)
    const isOnlyLettersAndAsterisk = (str: string) => /^[A-Za-z*]+$/.test(str)
    const isOnlyLettersAndDigits = (str: string) => /^[A-Za-z0-9]+$/.test(str)

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

const resetFilterForm = () => {
    paramform.value = {
        codonusage: '',
        lambda: 0.0,
    }
}

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
    let precheck = false

    if (inputtype.value === 'upload') {
        if (fileListFasta.value.length !== 1 || fileListCsv.value.length !== 1) {
            windowErrorMessage('Please upload file')
            precheck = false
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
            precheck = true
        }
    } else if (inputtype.value === 'paste') {
        const paste_input_code = checkPasteInput()
        if (paste_input_code === 0) {
            submitdata.append('seq', JSON.stringify(inputBlocks.value))
            precheck = true
        } else {
            precheck = false
        }
    }

    if (precheck) {
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
    const precheck = true

    if (precheck) {
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
        yourArray.value = newVal.split('')
        selectedIndices.value = []
        codonBlocks.value = []
        viewportStart.value = 0
    }
)

// Lifecycle hooks
onBeforeMount(() => {
    const { userId, getUserIdFromCookie } = useUserIdGenerator()
    getUserIdFromCookie()
    userid.value = userId.value as string
})

onMounted(() => {
    fillSequence()
})

onUnmounted(() => {
    // Clean up all event listeners
    document.removeEventListener('mousemove', handleDocumentMouseMove)
    document.removeEventListener('mouseup', handleDocumentMouseUp)
    document.removeEventListener('mousemove', handleMaskMouseMove)
    document.removeEventListener('mouseup', handleMaskMouseUp)
})
</script>

<style lang="scss" scoped>
.outer-container {
    display: flex;
    flex-direction: column;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
}

/* Make containers wider and responsive */
.sequence-input-container {
    width: 95%;
    max-width: 1200px;
    margin-top: 20px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 0 64px #cfd5db;
    padding: 30px;
}

.codon-config-container {
    width: 95%;
    max-width: 1200px;
    margin-top: 20px;
    border-radius: 12px;
    background-color: #ffffff;
    box-shadow: 0 0 64px #cfd5db;
    padding: 30px;
    min-height: 80px;
}

/* Calibri font class */
.calibri-font {
    font-family: 'Calibri', sans-serif !important;
}

.sequence-viewer-container {
    width: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    background-color: #ffffff;
}

.controls-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: linear-gradient(135deg, #f0f2f5 0%, #e8e8e8 100%);
    border-bottom: 1px solid #d9d9d9;
}

.sequence-info {
    display: flex;
    gap: 12px;
    align-items: center;
}

.sequence-name {
    font-weight: 600;
    color: #1890ff;
    font-size: 14px;
}

.zoom-controls {
    display: flex;
    align-items: center;
    gap: 6px;
}

.zoom-level {
    font-size: 11px;
    color: #666;
    min-width: 35px;
    text-align: center;
    font-weight: 500;
}

.progress-bar-container {
    width: 100%;
    border-bottom: 1px solid #d9d9d9;
}

.progress-info-section {
    height: 25px;
    background-color: #ffbb4d;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #e8e8e8;
}

.progress-info-text {
    font-size: 12px;
    font-weight: 600;
    color: #333;
}

.progress-position-section {
    height: 30px;
    background-color: #ffffff;
    position: relative;
    overflow: visible; /* Changed from hidden to visible */
}

.position-indicators {
    width: 100%;
    height: 100%;
    position: relative;
}

.position-block {
    background-color: #ffffff;
}

/* Updated selected color to #df5d5d */
.position-block.selected {
    background-color: #df5d5d !important;
}

.position-indices {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 10;
}

/* Fixed progress position label styling - simple black text only */
.progress-position-label {
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: #000; /* Simple black text */
    font-family: 'Monaco', 'Menlo', monospace;
    pointer-events: none;
    /* No background, no text-shadow - just clean black text */
    border-radius: 2px;
    min-width: 15px;
    max-width: 30px;
}

.viewport-mask {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border-top: 2px solid #cfcfcf;
    border-bottom: 2px solid #cfcfcf;
    /* Removed left and right borders since handles provide those */
    cursor: move;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
}

/* Range display positioned at container level and calculated dynamically */
.mask-range-display {
    font-size: 10px;
    font-weight: bold;
    color: #1890ff;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 2px 6px;
    border-radius: 3px;
    border: 1px solid #1890ff;
    pointer-events: none;
    white-space: nowrap;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.mask-handle {
    position: absolute;
    top: 0;
    height: 100%;
    width: 4px; /* Reduced from 8px to 4px */
    background-color: #cfcfcf;
    cursor: col-resize;
}

.mask-handle-left {
    left: 1px;
}

.mask-handle-right {
    right: 1px;
}

.sequence-window {
    width: 100%;
    height: 80px;
    background-color: #ffffff;
    overflow: hidden;
    padding-top: 15px; /* Add space above index row */
    box-sizing: border-box;
}

.sequence-container {
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    position: relative;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.sequence-container::-webkit-scrollbar {
    display: none;
}

.sequence-position-labels {
    height: 20px;
    position: relative;
    background-color: #f8f8f8;
    border-bottom: none; /* Remove border */
    margin: 0;
    padding: 0;
}

.sequence-position-label {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #8c8c8c;
    font-family: 'Monaco', 'Menlo', monospace;
    pointer-events: none;
}

.sequence-display {
    height: 40px; /* Exact same height as sequence chars */
    display: flex;
    align-items: stretch; /* Make chars fill full height */
    font-weight: 600;
    line-height: 1;
    user-select: none;
    margin: 0;
    padding: 0;
}

.sequence-char {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%; /* Fill the parent container completely */
    cursor: pointer;
    transition: all 0.1s ease;
    letter-spacing: 0px;
}

.sequence-char:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.codon-blocks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 4px;
    width: 100%;
}

.codon-block-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
}

.codon-label {
    font-size: 15px;
    font-weight: normal;
    color: #333;
    text-align: center;
    padding: 4px 0;
    display: flex;
    align-items: center;
    justify-content: center;
}

.index-number {
    font-weight: 600;
    color: #409eff;
    font-size: 14px;
}

.colon-separator {
    color: #666;
    margin: 0 2px;
    font-size: 14px;
}

/* Updated amino-letter to use Calibri */
.amino-letter {
    font-family: 'Calibri', sans-serif;
    font-weight: bold;
    color: #333;
    font-size: 15px;
}

.codon-select-wrapper {
    width: 80px;
}

/* Calibri font for select components */
.calibri-select :deep(.n-base-selection) {
    font-family: 'Calibri', sans-serif !important;
    min-height: 32px !important;
}

.calibri-select :deep(.n-base-selection-input) {
    font-family: 'Calibri', sans-serif !important;
    min-height: 30px !important;
    font-size: 13px !important;
}

.calibri-select :deep(.n-base-selection-label) {
    font-family: 'Calibri', sans-serif !important;
}

.codon-select-wrapper :deep(.n-base-selection) {
    min-height: 32px !important;
}

.codon-select-wrapper :deep(.n-base-selection-input) {
    min-height: 30px !important;
    font-size: 13px !important;
}
</style>
