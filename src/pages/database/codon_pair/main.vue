<template>
    <div class="h-320 flex flex-col py-10 px-30">
        <div class="flex flex-row ml-1 my-7">
            <div class="text-4xl font-600">
                Codon Pair
                <span class="capitalize">{{ calculation_type }}</span>
            </div>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="godatahelper">
                Database Helper
            </el-button>
            <el-button round color="#34498E" class="ml-5 mt-2" @click="detail">Details</el-button>
            <el-button round color="#34498E" class="ml-5 mt-2">
                <a :href="downloadlink" target="_blank" class="btn">Download</a>
            </el-button>
        </div>
        <div class="flex flex-row justify-between mb-4">
            <div class="mt-1.5 ml-1"></div>
            <div class="flex flex-row">
                <div class="mt-2 text-base">Search:</div>
                <el-input class="w-50 ml-3" size="small" v-model="searchinput">
                    <template #append>
                        <el-button :icon="Search" @click="filtersearch" />
                    </template>
                </el-input>
                <el-button class="mt-1 ml-2" :icon="RefreshRight" circle @click="resetsearch" />
            </div>
        </div>
        <div>
            <el-menu
                :default-active="dataset"
                class="el-menu-demo"
                mode="horizontal"
                @select="handleSelectSet"
            >
                <el-menu-item index="phage_protein_RefSeq">Main</el-menu-item>
            </el-menu>
        </div>
        <div v-loading="loading" class="h-300 mb-2">
            <n-data-table
                :columns="columns"
                :data="MainList"
                :row-key="rowKey"
                :scroll-x="2500"
                :max-height="1000"
                @update:checked-row-keys="handleCheck"
                @update:sorter="handleSorterChange"
            />
        </div>
        <div>
            <n-pagination
                class="mt-10 ml-130 mb-2"
                v-model:page="pagevalue"
                v-model:pageSize="pageSize"
                show-size-picker
                :default-page-size="20"
                :page-sizes="[20, 50, 100]"
                show-quick-jumper
                :item-count="count"
                @update:page="pagechange"
                @update:page-size="pagesizechange"
            >
                <template #prev>
                    <n-button @click="prevPage" v-bind:disabled="pagevalue === 1" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronBack />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
                <template #next>
                    <n-button @click="nextPage" size="small">
                        <template #icon>
                            <n-icon>
                                <ChevronForward />
                            </n-icon>
                        </template>
                    </n-button>
                </template>
            </n-pagination>
        </div>
    </div>
</template>

<script setup lang="ts">
/* eslint-disable camelcase */
// @ts-nocheck
import type { DataTableColumns, DataTableRowKey } from 'naive-ui'
import { NButton, NTooltip, NTag } from 'naive-ui'

import { Search, RefreshRight } from '@element-plus/icons-vue'
import { ChevronBack, ChevronForward } from '@vicons/ionicons5'
import axios from 'axios'
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { codonpairType, codonpairDict } from '@/utils/type'

// const calculation_type = ref('fraction')
const props = defineProps<{
    calculation_type: string
}>()
const { calculation_type } = toRefs(props)
const downloadlink = ref(
    `https://mrnaapi.deepomics.org/codon_pair/download/?calculation_type=${calculation_type.value}&&tissue=ALL`
)

const router = useRouter()
const loading = ref(false)

const checkedRowKeysRef = ref<DataTableRowKey[]>([])
function handleCheck(rowKeys: DataTableRowKey[]) {
    checkedRowKeysRef.value = rowKeys
}
const dataset = ref('phage_protein_RefSeq')

const renderTooltip = (trigger: any, content: any) => {
    return h(NTooltip, null, {
        trigger: () => trigger,
        default: () => content,
    })
}

const sorter_dict = ref('')

type RowData = codonpairType

const pagevalue = ref(1)
const pageSize = ref(20)

const Maindata = ref()

const main_get_response = async (pagevalueoffset: number) => {
    loading.value = true
    const response = await axios.get(`/codon_pair/`, {
        baseURL: '/api',
        timeout: 10000,
        params: {
            page: pagevalue.value + pagevalueoffset,
            pagesize: pageSize.value,
            sorter: sorter_dict.value,
            tissue: 'ALL',
            calculation_type: calculation_type.value,
        },
    })
    const { data } = response
    Maindata.value = data
    loading.value = false
}

onBeforeMount(async () => {
    main_get_response(0)
})

const MainList = computed(() => {
    return Maindata.value?.results
})
const columns: DataTableColumns<RowData> = computed(() => {
    if (!MainList.value || MainList.value.length === 0) {
        return []
    }

    const keys = Object.keys(MainList.value[0])
    const headColumn = keys.includes('Dinucleotide')
        ? {
              title() {
                  return renderTooltip(
                      h('div', null, { default: () => codonpairDict.Dinucleotide }),
                      codonpairDict.Dinucleotide
                  )
              },
              key: 'Dinucleotide',
              align: 'center',
              ellipsis: {
                  tooltip: true,
              },
              width: 150,
              sorter: true,
              fixed: 'left',
              render(row: any) {
                  return h('div', {}, [
                      h(
                          NTag,
                          {
                              type: 'info',
                              size: 'small',
                          },
                          {
                              default: () => row.Dinucleotide,
                          }
                      ),
                  ])
              },
          }
        : null

    const otherColumns = keys
        .filter(key => !['id', 'head', 'Dinucleotide', 'calculation_type'].includes(key)) // Filter out useless keys
        .map(key => ({
            title() {
                return renderTooltip(
                    h('div', null, { default: () => codonpairDict[key] }),
                    codonpairDict[key]
                )
            },
            key,
            align: 'center',
            ellipsis: {
                tooltip: true,
            },
            width: 100,
            sorter: true,
        }))

    return headColumn ? [headColumn, ...otherColumns] : otherColumns
})

const count = computed(() => Maindata.value?.count)

const nextPage = async () => {
    main_get_response(1)
}
const prevPage = async () => {
    main_get_response(-1)
}

const pagechange = async () => {
    main_get_response(0)
}
const pagesizechange = async () => {
    main_get_response(0)
}

const handleSorterChange = async sorter => {
    sorter_dict.value = sorter
    main_get_response(0)
}

const handleSelectSet = async (key: any) => {
    dataset.value = key
    main_get_response(0)
}

const rowKey = (row: RowData) => {
    return row.id
}

const searchinput = ref('')

const templatedata = ref()
const filtersearch = () => {
    templatedata.value = Maindata.value.results

    Maindata.value.results = _.filter(Maindata.value.results, obj => {
        return JSON.stringify(obj).includes(searchinput.value)
    })
}
const resetsearch = () => {
    searchinput.value = ''
    if (templatedata.value) {
        Maindata.value.results = templatedata.value
    }
}

const godatahelper = () => {
    router.push({
        path: '/tutorial',
        query: { type: 'database_intro' },
    })
}

const detail = () => {
    router.push({
        path: `detail`,
        query: { calculation_type: calculation_type.value },
    })
}
</script>
