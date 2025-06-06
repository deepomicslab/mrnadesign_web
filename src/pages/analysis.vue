<template>
    <div class="flex flex-row w-full justify-start h-full">
        <!-- <button
            text
            class="text-5xl mt-3 ml-75 absolute z-10 hover:bg-gray-200"
            @click="closeMenu"
            v-if="menu"
        >
            <el-icon><Fold /></el-icon>
        </button>
        <button
            text
            class="text-5xl mt-3 ml-75 absolute z-10 hover:bg-gray-200"
            @click="showMenu"
            v-if="!menu"
        >
            <el-icon><Fold /></el-icon>
        </button>
        <div class="w-360px h-full" v-if="menu">
            <el-scrollbar ref="scrollbarRef">
                <div class="flex flex-col w-360px bg-gray-50 h-237">
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] mt-30 hover:text-blue-400"
                        :class="{ active: rou == '/analysis/helper' }"
                        @click="routeGO('helper')"
                    >
                        Analysis Helper
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/annopipline/annotation' }"
                        @click="routeGO('annopipline/annotation')"
                    >
                        Genome Annotation
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/comparison/alignment' }"
                        @click="routeGO('comparison/alignment')"
                    >
                        Genome Comparison
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/completeness' }"
                        @click="routeGO('completeness')"
                    >
                        Completeness Analysis
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/prediction' }"
                        @click="routeGO('prediction')"
                    >
                        Host Prediction
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/trna' }"
                        @click="routeGO('trna')"
                    >
                        tRNA Detection
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/alignment' }"
                        @click="routeGO('alignment')"
                    >
                        Sequence Alignment
                    </button>

                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/clustering' }"
                        @click="routeGO('clustering')"
                    >
                        Sequence Cluster
                    </button>
                    <button
                        class="text-xl p-6 pl-10 text-[#4D6A7F] hover:text-blue-400"
                        :class="{ active: rou == '/analysis/phylogenetic' }"
                        @click="routeGO('phylogenetic')"
                    >
                        Phylogenetic Tree
                    </button>
                </div>
            </el-scrollbar>
        </div> -->
        <n-config-provider :theme-overrides="themeOverrides">
            <n-layout-sider
                bordered
                :width="450"
                show-trigger="bar"
                :collapsed-width="20"
                class="h-full"
            >
                <el-scrollbar ref="scrollbarRef">
                    <n-menu
                        class="mt-10"
                        :options="menuOptions"
                        :default-expanded-keys="defaultExpandedKeys"
                        @update:value="changeMenu"
                        v-model:value="activeKey"
                    />
                </el-scrollbar>
            </n-layout-sider>
        </n-config-provider>
        <router-view />
    </div>
</template>
<script setup lang="ts">
import type { MenuOption, GlobalThemeOverrides } from 'naive-ui'
import { RouterLink } from 'vue-router'

const themeOverrides: GlobalThemeOverrides = {
    Menu: {
        fontSize: '18px',
        itemHeight: '55px',
        itemColorHover: '#bec2c9',
        itemColorActive: '#bec2c9',
        itemColorActiveHover: '#bec2c9',
        itemTextColor: '#253959',
        itemTextColorHover: '#0f8696',
        itemTextColorActive: '#0f8696',
        itemTextColorActiveHover: '#0f8696',
        itemTextColorChildActive: '#0f8696',
        itemTextColorChildActiveHover: '#0f8696',
    },
}
const defaultExpandedKeys = [
    '/analysis/annopipline',
    '/analysis/comparison',
    '/analysis/annopipline/functional',
    '/analysis/annopipline/phenotype',
    '/analysis/annopipline/structural',
]
const menuOptions: MenuOption[] = [
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/linear_design/cds_plus_35utr',
                    },
                },
                { default: () => 'Linear Design' }
            ),
        key: '/analysis/linear_design',
        children: [
            {
                label: 'CDS Only',
                key: '/analysis/linear_design/cds_only',
            },
            {
                label: "CDS plus 3'UTR and 5'UTR",
                key: '/analysis/linear_design/cds_plus_35utr',
            },
        ],
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/prediction',
                    },
                },
                { default: () => 'Prediction' }
            ),
        key: '/analysis/prediction',
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/safety',
                    },
                },
                { default: () => 'Safety' }
            ),
        key: '/analysis/safety',
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/sequence_align',
                    },
                },
                { default: () => 'Sequence Align' }
            ),
        key: '/analysis/sequence_align',
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/antigen_screening',
                    },
                },
                { default: () => 'Antigen Screening' }
            ),
        key: '/analysis/antigen_screening',
    },
    {
        label: () =>
            h(
                RouterLink,
                {
                    to: {
                        path: '/analysis/tsa',
                    },
                },
                { default: () => 'TSA' }
            ),
        key: '/analysis/tsa',
    },
]
const router = useRouter()
const changeMenu = (_: string, option: MenuOption) => {
    router.push(option.key as string)
}

const route = useRoute()
const activeKey = ref<string>(route.path)
watch(
    () => route.path,
    () => {
        activeKey.value = route.path
    }
)
</script>

<style scoped>
.active {
    --tw-bg-opacity: 1;
    background-color: rgba(209, 213, 219, var(--tw-bg-opacity));
    border-right-width: 5px;
    --tw-border-opacity: 1;
    border-color: rgba(17, 56, 84, var(--tw-border-opacity));
}
</style>
