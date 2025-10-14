<template>
    <div class="page-container">
        <!-- Header Section -->
        <div class="header-section">
            <div class="header-content">
                <div class="text-4xl font-500 mb-8">Linear Design Result Display</div>
                <div class="header-button">
                    <el-button class="ml-5" @click="downloadresult">
                        <template #icon>
                            <n-icon>
                                <downicon />
                            </n-icon>
                        </template>
                        Download Analysis Result
                    </el-button>
                </div>
            </div>
        </div>

        <!-- Main Content Container -->
        <div class="main-content">
            <!-- Section 1: Result Table -->
            <div class="content-section">
                <div
                    class="section-wrapper"
                    v-loading="loading"
                    element-loading-text="Loading results..."
                >
                    <div v-if="rnadataList.length > 0" class="result-display-container">
                        <div class="result-table">
                            <!-- 6-column row for name, energy, and CAI -->
                            <div class="table-row six-column">
                                <div class="cell key">Sequence Name</div>
                                <div class="cell value">{{ rnadataList[0].seq_name }}</div>
                                <div class="cell key">Folding Free Energy</div>
                                <div class="cell value">
                                    {{ rnadataList[0].folding_free_energy }}
                                </div>
                                <div class="cell key">mRNA CAI</div>
                                <div class="cell value">{{ rnadataList[0].cai }}</div>
                            </div>

                            <!-- 2-column rows for long content -->
                            <div class="table-row two-column">
                                <div class="cell key">Sequence</div>
                                <div class="cell value sequence-text">
                                    {{ rnadataList[0].sequence }}
                                </div>
                            </div>

                            <div class="table-row two-column">
                                <div class="cell key">Structure</div>
                                <div class="cell value structure-text">
                                    {{ rnadataList[0].structure }}
                                </div>
                            </div>

                            <!-- Actions row -->
                            <div class="table-row two-column">
                                <div class="cell key">Actions</div>
                                <div class="cell value">
                                    <div class="action-buttons">
                                        <el-button
                                            size="small"
                                            type="primary"
                                            @click="openView(rnadataList[0])"
                                        >
                                            View Structure Visualization
                                        </el-button>
                                        <el-button
                                            size="small"
                                            type="success"
                                            @click="runPrediction(rnadataList[0])"
                                        >
                                            Run Prediction Analysis
                                        </el-button>
                                        <el-button
                                            size="small"
                                            type="warning"
                                            @click="continueLinearDesign(rnadataList[0])"
                                        >
                                            Continue Linear Design
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loading fallback when no data and not loading -->
                    <div v-else-if="!loading" class="no-data">
                        <el-empty description="No data available" />
                    </div>
                </div>
            </div>

            <!-- Section 2: RNA Sequence Visualization -->
            <div class="content-section">
                <div class="section-title">RNA Sequence Visualization</div>
                <div class="visualization-container">
                    <div class="visualization-content">
                        <div class="sequence-info">
                            RNA Sequence: {{ displaySequence.length }} nucleotides
                            <span v-if="highlightedCodonCount > 0" class="highlight-info">
                                ({{ highlightedCodonCount }} codons highlighted)
                            </span>
                        </div>

                        <div class="rna-sequence-viewer-container">
                            <!-- Controls Bar -->
                            <div class="controls-bar">
                                <div class="sequence-info">
                                    <span class="sequence-name">
                                        {{ rnadataList[0]?.seq_name || 'RNA Sequence' }}
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
                                    <el-button size="small" @click="resetZoom">RESET</el-button>
                                </div>
                            </div>

                            <!-- Progress Bar (Two-part vertical layout) -->
                            <div class="progress-bar-container">
                                <!-- Upper part: Info display -->
                                <div class="progress-info-section">
                                    <span class="progress-info-text">
                                        Length: {{ displaySequence.length }} nucleotides |
                                        Highlighted: {{ highlightedCodonCount }} codons
                                    </span>
                                </div>

                                <!-- Lower part: Position indicators with mask -->
                                <div class="progress-position-section" ref="progressContainer">
                                    <div class="position-indicators">
                                        <div
                                            v-for="(nucleotide, index) in displaySequence"
                                            :key="`progress-${index}`"
                                            class="position-block"
                                            :class="{
                                                highlighted: isNucleotideHighlighted(index),
                                            }"
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

                                    <!-- Viewport mask with range display -->
                                    <div
                                        class="viewport-mask"
                                        :style="viewportMaskStyle"
                                        @mousedown="handleMaskBodyMouseDown"
                                    >
                                        <div class="mask-range-display">
                                            {{ maskRangeText }}
                                        </div>
                                        <div
                                            class="mask-handle mask-handle-left"
                                            @mousedown.stop="handleLeftHandleMouseDown"
                                        ></div>
                                        <div
                                            class="mask-handle mask-handle-right"
                                            @mousedown.stop="handleRightHandleMouseDown"
                                        ></div>
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
                                    <!-- Sequence display -->
                                    <div class="sequence-display" :style="sequenceDisplayStyle">
                                        <span
                                            v-for="(nucleotide, index) in visibleSequence"
                                            :key="`nucleotide-${viewportStart + index}`"
                                            class="nucleotide-char"
                                            :class="{
                                                highlighted: isNucleotideHighlighted(
                                                    viewportStart + index
                                                ),
                                            }"
                                            :style="getCharStyle(index)"
                                            :title="
                                                getNucleotideTitle(
                                                    nucleotide,
                                                    viewportStart + index
                                                )
                                            "
                                        >
                                            {{ nucleotide }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3: Structure Visualization -->
            <div class="content-section">
                <div class="structure-header">
                    <div class="section-title">Structure Visualization</div>
                    <div class="structure-controls">
                        <n-space align="center">
                            <n-radio-group v-model:value="activeTab">
                                <n-radio-button value="second">Secondary Structure</n-radio-button>
                            </n-radio-group>
                        </n-space>
                    </div>
                </div>
                <div class="structure-container">
                    <div v-if="activeTab === 'second'">
                        <forna
                            :structure="forna_structure"
                            :sequence="forna_sequence"
                            :cur_time="cur_time"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */

import { ref, computed, watch, onBeforeMount, onMounted, onUnmounted, nextTick } from 'vue'
import axios from 'axios'
import { CloudDownloadOutline as downicon } from '@vicons/ionicons5'
import { ZoomIn, ZoomOut } from '@element-plus/icons-vue'
import { ElEmpty } from 'element-plus'
import _ from 'lodash'
import { decrypt } from '@/utils/crypto'
import forna from './forna.vue'
import { windowSuccessMessage } from '@/utils/windowFunctions'
import {
    useLinearDesign2PredictionTaskSunmissionStore,
    useLinearDesign2LinearDesignFixCodonTaskSunmissionStore,
} from '@/store/mrna'

const taskSubmissionLinearDesign2PredictionStore = useLinearDesign2PredictionTaskSunmissionStore()
const taskSubmissionLinearDesign2LinearDesignFixCodonStore =
    useLinearDesign2LinearDesignFixCodonTaskSunmissionStore()
const router = useRouter()
const route = useRoute()

// Original data variables
const activeTab = ref('second')
const forna_structure = ref('')
const forna_sequence = ref('')
const cur_time = ref('')
const loading = ref(false)
const rnadata = ref()
const inputdata = ref()

// Element refs
const progressContainer = ref<HTMLElement | null>(null)
const sequenceContainer = ref<HTMLElement | null>(null)

// Viewport and zoom state
const zoomLevel = ref(1.0)
const viewportStart = ref(0)
const viewportEnd = ref(0)

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

// Computed properties
const taskid = computed(() => {
    return decrypt(
        route.query?.taskid as string,
        'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2'
    )
})

const displaySequence = computed(() => {
    if (!rnadata.value?.results?.[0]?.sequence) return []
    return rnadata.value.results[0].sequence.split('')
})

const rnadataList = computed(() => {
    return _.map(rnadata.value?.results, (row: any) => {
        return row
    })
})

// Core computed properties for windowing
const charWidth = computed(() => Math.max(12, CHAR_BASE_SIZE * zoomLevel.value))

const actualContainerWidth = computed(() => {
    return progressContainer.value?.offsetWidth || 1000
})

const maxVisibleChars = computed(() => {
    return Math.floor(actualContainerWidth.value / charWidth.value)
})

// Ensure viewport end is properly calculated and bounded
const ensureViewportBounds = () => {
    const maxStart = Math.max(0, displaySequence.value.length - maxVisibleChars.value)
    viewportStart.value = Math.max(0, Math.min(viewportStart.value, maxStart))
    viewportEnd.value = Math.min(
        displaySequence.value.length,
        viewportStart.value + maxVisibleChars.value
    )
}

// Watch for changes that require viewport recalculation
watch([() => displaySequence.value.length, maxVisibleChars], () => {
    ensureViewportBounds()
})

watch(viewportStart, () => {
    ensureViewportBounds()
})

// Sequence display computeds
const visibleSequence = computed(() => {
    return displaySequence.value.slice(viewportStart.value, viewportEnd.value).join('')
})

// Progress bar computeds
const progressPositions = computed(() => {
    return Array.from({ length: displaySequence.value.length }, i => i + 1)
})

const positionLabelInterval = computed(() => {
    const { length } = displaySequence.value
    if (length <= 20) return 1
    if (length <= 100) return 5
    if (length <= 200) return 10
    if (length <= 1000) return 50
    return Math.ceil(length / 20)
})

// Viewport mask style
const viewportMaskStyle = computed(() => {
    if (displaySequence.value.length === 0) {
        return { left: '0%', width: '100%' }
    }

    const totalLength = displaySequence.value.length
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

// Style functions
const sequenceDisplayStyle = computed(() => ({
    width: `${visibleSequence.value.length * charWidth.value}px`,
    fontSize: `${Math.max(12, CHAR_BASE_SIZE * zoomLevel.value)}px`,
}))

const getProgressPositionStyle = (index: number) => {
    const blockWidth = actualContainerWidth.value / displaySequence.value.length
    return {
        left: `${index * blockWidth}px`,
        width: `${blockWidth}px`,
    }
}

const shouldShowProgressPosition = (pos: number) => {
    return (pos - 1) % positionLabelInterval.value === 0
}

// Compute highlighted RNA positions based on store conf data
const highlightedPositions = computed(() => {
    const positions: number[] = []
    taskSubmissionLinearDesign2LinearDesignFixCodonStore.conf.forEach((item: any) => {
        // Each amino acid corresponds to 3 RNA nucleotides (codon)
        const rnaStartPos = (item.index - 1) * 3
        positions.push(rnaStartPos, rnaStartPos + 1, rnaStartPos + 2)
    })
    return positions
})

// Check if a nucleotide position should be highlighted
const isNucleotideHighlighted = (index: number): boolean => {
    return highlightedPositions.value.includes(index)
}

const getCharStyle = (index: number) => {
    const globalIndex = viewportStart.value + index
    const isHighlighted = isNucleotideHighlighted(globalIndex)

    return {
        width: `${charWidth.value}px`,
        backgroundColor: isHighlighted ? '#c0c0c0' : '#f5f5f5',
        color: '#000000',
        fontFamily: 'Courier New, monospace',
        fontWeight: isHighlighted ? 'bold' : 'normal',
    }
}

const updateViewportFromPercent = (leftPercent: number, widthPercent: number) => {
    const totalLength = displaySequence.value.length
    const newStart = Math.floor((leftPercent / 100) * totalLength)
    const newCount = Math.floor((widthPercent / 100) * totalLength)

    viewportStart.value = Math.max(0, Math.min(newStart, totalLength - 1))

    // Adjust zoom to fit the selected range
    if (newCount > 0) {
        const targetCharWidth = actualContainerWidth.value / newCount
        zoomLevel.value = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetCharWidth / CHAR_BASE_SIZE))
    }
}

// Count unique highlighted codons
const highlightedCodonCount = computed(() => {
    const uniqueCodons = new Set()
    highlightedPositions.value.forEach(position => {
        const codonIndex = Math.floor(position / 3)
        uniqueCodons.add(codonIndex)
    })
    return uniqueCodons.size
})

// Get amino acid position from RNA nucleotide index
const getAminoAcidPosition = (rnaIndex: number): number => {
    return Math.floor(rnaIndex / 3)
}

// Get amino acid for a given RNA nucleotide position
const getAminoAcidForPosition = (rnaIndex: number): string => {
    if (!inputdata.value?.seq) return ''
    const aminoAcidPos = getAminoAcidPosition(rnaIndex)
    return inputdata.value.seq[aminoAcidPos] || ''
}

const getNucleotideTitle = (nucleotide: string, index: number): string => {
    const aminoAcidPos = getAminoAcidPosition(index)
    const aminoAcid = getAminoAcidForPosition(index)
    const codonPos = index % 3
    const isHighlighted = isNucleotideHighlighted(index)

    let title = `Position: ${index + 1}, Nucleotide: ${nucleotide}`
    title += `\nCodon position: ${codonPos + 1}/3`
    title += `\nAmino acid position: ${aminoAcidPos + 1}`

    if (aminoAcid) {
        title += `\nAmino acid: ${aminoAcid}`
    }

    if (isHighlighted) {
        title += '\n[HIGHLIGHTED - Part of conf positions]'
    }

    return title
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

const openView = (row: any) => {
    forna_structure.value = row.structure
    forna_sequence.value = row.sequence
}

const runPrediction = (row: any) => {
    taskSubmissionLinearDesign2PredictionStore.cdsSequence = row.sequence
    windowSuccessMessage(
        'You will be directed to the Prediction task submission page. The CDS sequence will be used to do the analysis. You can do some modifications on it if needed.'
    )
    router.push({
        path: '/analysis/prediction/index4lineardesign_cdsonly',
    })
}

const continueLinearDesign = () => {
    windowSuccessMessage(
        'You will be directed to the Linear Design task submission page. You can continue the design there.'
    )
    router.push({
        path: '/analysis/linear_design/index4lineardesign_fixcodon',
    })
}

const downloadresult = () => {
    window.open(`/api/tasks/zip/?taskid=${taskid.value}`, '_blank')
}

// Watchers
watch(activeTab, async () => {
    const today = new Date()
    cur_time.value = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
})

watch(zoomLevel, () => {
    nextTick(() => {
        ensureViewportBounds()
    })
})

// Lifecycle hooks
onBeforeMount(async () => {
    loading.value = true
    try {
        const response = await axios.get(`/tasks/lineardesign_result/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                taskid: taskid.value,
                lineardesignanalysistype: 'fix_codon',
            },
        })
        const { data } = response
        rnadata.value = data

        if (rnadata.value?.results?.[0]) {
            forna_structure.value = rnadata.value.results[0].structure
            forna_sequence.value = rnadata.value.results[0].sequence
        }
    } catch (error) {
        console.error('Error loading data:', error)
    } finally {
        loading.value = false
    }

    try {
        const response = await axios.get(`/tasks/parameter/lineardesign/`, {
            baseURL: '/api',
            timeout: 10000,
            params: {
                taskid: taskid.value,
                lineardesignanalysistype: 'fix_codon',
            },
        })
        const { data } = response
        inputdata.value = data
        taskSubmissionLinearDesign2LinearDesignFixCodonStore.seq_name = inputdata.value.seq_name
        taskSubmissionLinearDesign2LinearDesignFixCodonStore.seq = inputdata.value.seq
        taskSubmissionLinearDesign2LinearDesignFixCodonStore.conf = inputdata.value.conf
        taskSubmissionLinearDesign2LinearDesignFixCodonStore.codonusage =
            inputdata.value.parameters.codonusage
        taskSubmissionLinearDesign2LinearDesignFixCodonStore.lambda =
            inputdata.value.parameters.lambda
    } catch (error) {
        console.error('Error loading input data:', error)
    }
})

onMounted(() => {
    nextTick(() => {
        ensureViewportBounds()
    })
})

onUnmounted(() => {
    // Clean up all event listeners
    document.removeEventListener('mousemove', handleMaskMouseMove)
    document.removeEventListener('mouseup', handleMaskMouseUp)
})
</script>

<style lang="scss" scoped>
.page-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header-section {
    margin-bottom: 32px;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 2px solid #e5e7eb;
}

.header-button {
    flex-shrink: 0;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.content-section {
    width: 100%;
}

.section-wrapper {
    width: 100%;
    min-height: 200px;
    position: relative;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 24px;
    color: #333;
}

.result-display-container {
    width: 100%;
    margin: 0 auto;
}

.result-table {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    background: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-row {
    display: grid;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
        border-bottom: none;
    }

    &.six-column {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }

    &.two-column {
        grid-template-columns: 200px 1fr;
    }
}

.cell {
    padding: 12px 16px;
    border-right: 1px solid #f0f0f0;

    &:last-child {
        border-right: none;
    }

    &.key {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #333;
    }

    &.value {
        background-color: white;
        color: #666;
    }
}

.sequence-text,
.structure-text {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    word-break: break-all;
    line-height: 1.4;
}

.action-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.visualization-container {
    width: 100%;
    border-radius: 16px;
    background-color: #f9f9f9;
    box-shadow: 0 0 64px #cfd5db;
    padding: 24px;
}

.visualization-content {
    width: 100%;
}

.sequence-info {
    font-size: 1.125rem;
    margin-bottom: 24px;
    color: #333;
}

.highlight-info {
    font-size: 0.9rem;
    color: #666;
    font-weight: normal;
}

/* RNA Sequence Viewer Container - borders removed, grey color scheme */
.rna-sequence-viewer-container {
    width: 100%;
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
}

.progress-info-section {
    height: 25px;
    background-color: #ffbb4d;
    display: flex;
    align-items: center;
    justify-content: center;
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
    overflow: hidden;
}

.position-indicators {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: stretch;
}

.position-block {
    flex: 1;
    min-width: 1px;
    height: 100%;
    background-color: #f5f5f5;
}

.position-block.highlighted {
    background-color: #c0c0c0 !important;
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

.progress-position-label {
    position: absolute;
    top: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 600;
    color: #000;
    font-family: 'Monaco', 'Menlo', monospace;
    pointer-events: none;
    border-radius: 2px;
    min-width: 15px;
    max-width: 30px;
}

.viewport-mask {
    position: absolute;
    top: 0;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    border: 2px solid #1890ff;
    cursor: move;
    min-width: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
}

.mask-range-display {
    font-size: 9px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    pointer-events: none;
}

.mask-handle {
    position: absolute;
    top: 0;
    height: 100%;
    width: 8px;
    background-color: #1890ff;
    cursor: col-resize;
}

.mask-handle-left {
    left: -4px;
}

.mask-handle-right {
    right: -4px;
}

.sequence-window {
    width: 100%;
    height: 80px;
    background-color: #ffffff;
    overflow: hidden;
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

.sequence-display {
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: 600;
    line-height: 1;
    user-select: none;
}

.nucleotide-char {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    cursor: pointer;
    transition: all 0.1s ease;
    letter-spacing: 0px;
}

.nucleotide-char:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.structure-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
}

.structure-controls {
    flex-shrink: 0;
}

.structure-container {
    width: 100%;
    height: 600px;
    border-radius: 8px;
    box-shadow: 0 0 64px #cfd5db;
    background: white;
    padding: 16px;
}
</style>
