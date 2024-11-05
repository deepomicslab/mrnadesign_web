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
// import { useRouter, RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
// import { NConfigProvider, GlobalThemeOverrides, NIcon, NEllipsis } from 'naive-ui'
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
                key: '/analysis/linear_design',
            },
            {
                label: 'Prediction',
                key: '/analysis/prediction',
            },

            // {
            //     label: () =>
            //         h(
            //             RouterLink,
            //             {
            //                 to: {
            //                     path: '/analysis/annopipline/',
            //                 },
            //             },
            //             { default: () => 'Genome Annotation' }
            //         ),
            //     key: '/analysis/annopipline/',
            //     children: [
            //         {
            //             label: 'Completeness Assessment',
            //             key: '/analysis/annopipline/quality',
            //         },
            //         {
            //             label: () =>
            //                 h(
            //                     RouterLink,
            //                     {
            //                         to: {
            //                             path: '/analysis/annopipline/phenotype',
            //                         },
            //                     },
            //                     { default: () => 'Phenotype Annotation' }
            //                 ),
            //             key: '/analysis/annopipline/phenotype',
            //             children: [
            //                 {
            //                     label: 'Host Assignment',
            //                     key: '/analysis/annopipline/phenotype/host',
            //                 },
            //                 {
            //                     label: 'Lifestyle Prediction',
            //                     key: '/analysis/annopipline/phenotype/lifestyle',
            //                 },
            //             ],
            //         },

            //         {
            //             label: () =>
            //                 h(
            //                     RouterLink,
            //                     {
            //                         to: {
            //                             path: '/analysis/annopipline/structural',
            //                         },
            //                     },
            //                     { default: () => 'Structural Annotation' }
            //                 ),
            //             key: '/analysis/annopipline/structural',
            //             children: [
            //                 {
            //                     label: 'ORF prediction & Protein Classification',
            //                     key: '/analysis/annopipline/structural/annotation',
            //                 },
            //                 {
            //                     label: 'Transcription Terminator Annotation',
            //                     key: '/analysis/annopipline/structural/terminators',
            //                 },
            //             ],
            //         },
            //         {
            //             label: 'Taxonomic Annotation',
            //             key: '/analysis/annopipline/taxonomic',
            //         },
            //         {
            //             label: () =>
            //                 h(
            //                     RouterLink,
            //                     {
            //                         to: {
            //                             path: '/analysis/annopipline/functional',
            //                         },
            //                     },
            //                     { default: () => 'Functional Annotation' }
            //                 ),
            //             key: '/analysis/annopipline/functional',
            //             children: [
            //                 {
            //                     label: 'tRNA & tmRNA Gene Annotation',
            //                     key: '/analysis/annopipline/functional/trna',
            //                 },

            //                 {
            //                     label: 'Anti-CRISPR Protein Annotation',
            //                     key: '/analysis/annopipline/functional/anti',
            //                 },
            //                 {
            //                     label: 'CRISPR Array Annotation',
            //                     key: '/analysis/annopipline/functional/crispr',
            //                 },
            //                 {
            //                     label: () =>
            //                         h(NEllipsis, null, {
            //                             default: () =>
            //                                 'Virulent Factor & Antimicrobial Resistance Gene Detection',
            //                         }),
            //                     key: '/analysis/annopipline/functional/arvf',
            //                 },
            //                 {
            //                     label: 'Transmembrane Protein Annotation',
            //                     key: '/analysis/annopipline/functional/trans',
            //                 },
            //             ],
            //         },
            //     ],
            // },

            // {
            //     label: () =>
            //         h(
            //             RouterLink,
            //             {
            //                 to: {
            //                     path: '/analysis/comparison',
            //                 },
            //             },
            //             { default: () => 'Genome Comparison' }
            //         ),
            //     key: '/analysis/comparison',
            //     children: [
            //         {
            //             label: 'Sequence Clustering',
            //             key: '/analysis/comparison/clustering',
            //         },
            //         {
            //             label: 'Sequence Alignment',
            //             key: '/analysis/comparison/alignment',
            //         },
            //         {
            //             label: 'Comparative Tree Construction',
            //             key: '/analysis/comparison/phylogenetic',
            //         },
            //     ],
            // },
        ],
    },
    { label: 'Workspace', key: '/workspace', icon: renderIcon(WorkspaceIcon) },
    { label: 'Download', key: '/download', icon: renderIcon(DownloadIcon) },
    { label: 'Tutorial', key: '/tutorial', icon: renderIcon(tutorialIcon) },
    { label: 'Contact us', key: '/contact', icon: renderIcon(UserIcon) },
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
