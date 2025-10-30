<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <div h="full" class="flex justify-between items-center">
            <div
                h="[80%]"
                class="flex items-center space-x-4 cursor-pointer select-none w-200"
                @click="router.push('/')"
            >
                <img :src="Logo" class="h-[calc(100%-6px)]" />
                <h1 text="white h5">mRNA Vaccine Design</h1>
            </div>
            <n-menu
                v-model:value="activeKey"
                mode="horizontal"
                :options="menuOptions"
                @update:value="changeMenu"
                class="c-main-menu"
            />
        </div>
    </n-config-provider>
</template>

<script lang="ts">
import type { MenuOption } from 'naive-ui'
import type { Component } from 'vue'
import { ListCheck as WorkspaceIcon } from '@vicons/tabler'
import { AnalyticsOutlined as AnalysisIcon } from '@vicons/material'
import {
    UserCircle as UserIcon,
    FileAltRegular as tutorialIcon,
    Download as DownloadIcon,
    Database as DatabaseIcon,
    Home as HomeIcon,
} from '@vicons/fa'
import { useRouter } from 'vue-router'
import { NConfigProvider, GlobalThemeOverrides, NIcon } from 'naive-ui'
// eslint-disable-next-line import/extensions
import Logo from '@/assets/img/mRNA.png'
</script>

<script setup lang="ts">
const themeOverrides: GlobalThemeOverrides = {
    Menu: {
        itemTextColor: 'white',
        itemIconColor: 'white',
        itemIconColorHover: '#3e5294',
        itemTextColorHover: '#3e5294',
        itemTextColorActive: '#3e5294',
        itemIconColorActive: '#3e5294',
    },
}

const route = useRoute()
const activeKey = ref<string>(route.path)

watch(
    () => route.path,
    () => {
        activeKey.value = route.path
    }
)
const renderIcon = (icon: Component) => {
    return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions: MenuOption[] = [
    // { label: 'HOME', key: '/home', icon: renderIcon(HomeIcon) },
    { label: 'Home', key: '/', icon: renderIcon(HomeIcon) },
    {
        label: 'Database',
        key: '/database',
        icon: renderIcon(DatabaseIcon),
        children: [
            {
                label: 'Overview',
                key: '/database',
            },
            {
                label: 'Antigen List',
                key: '/database/antigen',
            },
            {
                label: 'Tantigen List',
                key: '/database/tantigen',
            },
            {
                label: "3' UTR List",
                key: '/database/three_utr',
            },
            {
                label: 'MicroRNA Target Sites String Evidence',
                key: '/database/mirtarbase',
            },
            {
                label: 'GtRNAdb',
                key: '/database/gtrnadb',
            },
            {
                label: 'TSNAdb v2.0',
                key: '/database/tsnadb2/',
                children: [
                    {
                        label: 'All Collected Experimentally Validated Neoantigens',
                        key: '/database/tsnadb2/validated',
                    },
                    {
                        label: 'Detailed Neoantigen Information Predicted by Three Tools',
                        key: '/database/tsnadb2/neoantigen',
                    },
                ],
            },
            {
                label: 'REBASE',
                key: '/database/rebase',
            },
            {
                label: 'UTRdb 2.0',
                key: '/database/utrdb',
            },
            // {
            //     label: 'Isoform DB',
            //     key: '/database/isoformdb/',
            //     children: [
            //         {
            //             label: 'Datasets',
            //             key: '/database/isoformdb/datasets',
            //         },
            //         {
            //             label: 'Samples',
            //             key: '/database/isoformdb/samples',
            //         },
            //         {
            //             label: 'Isoforms',
            //             key: '/database/isoformdb/isoforms',
            //         },
            //         {
            //             label: 'Genes',
            //             key: '/database/isoformdb/genes',
            //         },
            //     ],
            // },
            {
                label: 'Codon Pair',
                key: '/database/codon_pair/',
                children: [
                    {
                        label: 'Counts',
                        key: '/database/codon_pair/counts',
                    },
                    {
                        label: 'Frequency',
                        key: '/database/codon_pair/frequency',
                    },
                    {
                        label: 'Fraction',
                        key: '/database/codon_pair/fraction',
                    },
                ],
            },
            {
                label: 'TranscriptHub',
                key: '/database/transcripthub/',
                children: [
                    {
                        label: 'Assembly',
                        key: '/database/transcripthub/assembly',
                    },
                    {
                        label: 'Annotation',
                        key: '/database/transcripthub/annotation',
                    },
                ],
            },
            {
                label: 'TCR Alpha-Beta Chain Pairing',
                key: '/database/tcrabpairing',
            },
            // {
            //     label: 'Sequence Filter',
            //     key: '/database/filter',
            // },
        ],
    },
    {
        label: 'Analysis',
        key: '/analysis',
        icon: renderIcon(AnalysisIcon),
        children: [
            {
                label: 'Linear Design',
                key: '/analysis/linear_design/cds_plus_35utr',
                children: [
                    {
                        label: 'CDS Only',
                        key: '/analysis/linear_design/cds_only',
                    },
                    {
                        label: "CDS plus 3'UTR and 5'UTR",
                        key: '/analysis/linear_design/cds_plus_35utr',
                    },
                    {
                        label: 'Fix Codon',
                        key: '/analysis/linear_design/fix_codon',
                    },
                ],
            },
            {
                label: 'Prediction',
                key: '/analysis/prediction',
            },
            {
                label: 'Safety',
                key: '/analysis/safety',
            },
            {
                label: 'Sequence Align',
                key: '/analysis/sequence_align',
            },
            {
                label: 'Antigen Screening',
                key: '/analysis/antigen_screening',
            },
            {
                label: 'TSA',
                key: '/analysis/tsa',
            },
            {
                label: 'TCRanno',
                key: '/analysis/tcranno',
            },
            {
                label: 'TCR Alpha-Beta Chain Pairing',
                key: '/analysis/tcrabpairing',
            },
        ],
    },
    { label: 'Workspace', key: '/workspace', icon: renderIcon(WorkspaceIcon) },
    { label: 'Download', key: '/download', icon: renderIcon(DownloadIcon) },
    { label: 'Tutorial', key: '/tutorial', icon: renderIcon(tutorialIcon) },
    { label: 'Contact us', key: '/contact', icon: renderIcon(UserIcon) },
    { label: 'User Management', key: '/login', icon: renderIcon(UserIcon) },
]

const router = useRouter()
const changeMenu = (_: string, option: MenuOption) => {
    router.push(option.key as string)
}
</script>

<style lang="scss" scoped>
.c-main-menu {
    @apply flex justify-between items-center;
    @apply text-base;

    .n-menu-item {
        @apply flex flex-grow;
    }
}

::v-deep .custom-link {
    color: rgb(200, 200, 200);
    text-decoration: none;
}

::v-deep .n-menu .n-menu-item-content .n-menu-item-content-header a.custom-link:hover {
    color: rgb(255, 255, 255) !important;
}

::v-deep .router-link-active.router-link-exact-active.custom-link {
    color: #059669 !important;
}
</style>
