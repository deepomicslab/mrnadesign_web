<template>
    <div class="w-full flex flex-row justify-start h-full">
        <div class="h-full"></div>
        <n-layout-sider
            bordered
            :width="310"
            show-trigger="bar"
            :collapsed-width="20"
            class="h-full"
        >
            <div class="flex flex-col h-full">
                <div class="h-1/8 flex flex-row justify-start items-center w-full">
                    <div class="font-500 text-[28px] text-[#3e5294] ml-18">Directly Start</div>
                </div>
                <div class="h-2/8 flex flex-col justify-center items-center">
                    <el-button round color="#34498E" class="w-30 h-9" @click="goDocument">
                        Help
                    </el-button>
                    <img src="../../public/png/help.png" class="image w-34 h-23 mt-2" />
                </div>
                <div class="h-2/8 flex flex-col justify-center items-center">
                    <el-button round color="#34498E" class="w-30 h-9" @click="godatabasae">
                        Database
                    </el-button>
                    <img src="../../public/png/database.png" class="image w-34 h-34" />
                </div>
                <div class="h-2/8 flex flex-col justify-center items-center">
                    <el-button round color="#34498E" class="w-30 h-9" @click="goAnalysis">
                        Analysis
                    </el-button>
                    <img src="../../public/png/analysis.png" class="image w-34 h-34" />
                </div>
            </div>
        </n-layout-sider>
        <el-scrollbar ref="scrollbarRef" class="w-full">
            <div class="w-full flex flex-col justify-start h-700 bg-[#f8f9fa]">
                <div class="h-220 flex flex-col">
                    <div class="flex flex-row border-b-1 border-[#34498E] ml-13 w-290 pb-6">
                        <div class="text-5xl font-700 mt-20 text-[#3e5294]">
                            mRNA vaccine design
                        </div>
                        <el-button
                            round
                            color="#34498E"
                            class="w-25 h-7 mt-24 ml-10"
                            @click="godatabasae"
                        >
                            Database
                        </el-button>
                        <el-button
                            round
                            color="#34498E"
                            class="w-25 h-7 mt-24 ml-18"
                            @click="goAnalysis"
                        >
                            Analysis
                        </el-button>
                    </div>

                    <div class="text-[22px] font-400 mt-13 ml-15 w-[84%] leading-9 text-gray-900">
                        Welcome to the mRNA Vaccine Design Platform! Our mRNA Vaccine Design
                        Platform is an
                        <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">
                            intelligent online tool
                        </strong>
                        designed to streamline the design processes of mRNA vaccines.It offers tools
                        including an analysis pipeline for whole-genome tumor-specific antigens
                        (wgTSAs), 5'UTR design tool and CDS design tool and related database.
                    </div>
                    <div class="text-[22px] font-400 mt-10 ml-15 w-[89%] leading-9 text-gray-900">
                        Key Features of the mRNA Design Platform:
                    </div>
                    <div class="mt-8 ml-25 w-[81%] flex flex-row">
                        <div>
                            <div
                                class="h-[0.6em] w-[0.6em] rounded-full bg-gray-900 mx-5 mt-3.5"
                            ></div>
                        </div>
                        <div class="text-[21px] font-400 leading-9 text-gray-900">
                            Therapeutic mRNA design database includes
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">5,812</strong>
                            <strong class="text-[#ee7e7d] font-400 mx-1 text-[21px]">
                                antigen sequences,
                            </strong>
                            with
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">505</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                normal antigen sequences, from
                            </strong>
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">94</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                organisms,
                            </strong>
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">691,091</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                tRNA genes,
                            </strong>
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">4,307</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                tumor antigens form
                            </strong>
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">384</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                gene cards, and
                            </strong>
                            <strong class="text-2xl font-600 text-[#ee7e7d] ml-1">4,884</strong>
                            <strong class="text-[#ee7e7d] font-400 ml-1 text-[21px]">
                                3'UTRs.
                            </strong>
                        </div>
                    </div>

                    <div
                        class="text-[21px] font-400 mt-8 ml-25 w-[79%] leading-9 text-gray-900 flex flex-row"
                    >
                        <div>
                            <div
                                class="h-[0.4em] w-[0.4em] rounded-full bg-gray-900 mx-5 mt-3.5"
                            ></div>
                        </div>
                        Intelligent design and analysis with state-of-the-art tools, including
                        analysis pipeline for whole-genome tumor-specific antigens (wgTSAs), Smart
                        5'UTR, linear design for CDS and mRNA sequence annotation.
                    </div>
                    <div
                        class="text-[21px] font-400 mt-8 ml-25 w-[80%] leading-9 text-gray-900 flex flex-row"
                    >
                        <div>
                            <div
                                class="h-[0.4em] w-[0.4em] rounded-full bg-gray-900 mx-5 mt-3.5"
                            ></div>
                        </div>
                        Interactive visualization of antigen source distribution, structural and
                        functional annotation, etc.
                    </div>
                </div>
                <div class="h-290 flex flex-col items-center">
                    <div class="mb-10 text-3xl font-600 text-[#3e5294] mt-5">Focus</div>
                    <div
                        style="box-shadow: 0 0 64px #cfd5db"
                        class="w-270 h-200 bg-white rounded-2xl"
                    >
                        <div>
                            <el-carousel
                                height="800px"
                                width="1080px"
                                arrow="always"
                                indicator-position="outside"
                                :autoplay="false"
                            >
                                <el-carousel-item>
                                    <div
                                        class="w-270 h-200 flex flex-row items-center justify-center"
                                    >
                                        <el-image
                                            src="/png/homepage_database.png"
                                            class="image w-270 h-200"
                                            z-index="100"
                                        />
                                    </div>
                                </el-carousel-item>
                                <el-carousel-item>
                                    <div
                                        class="w-270 h-200 flex flex-row items-center justify-center"
                                    >
                                        <el-image
                                            src="/png/homepage_analysis.png"
                                            class="image w-270 h-200"
                                            z-index="100"
                                        />
                                    </div>
                                </el-carousel-item>
                                <el-carousel-item>
                                    <div
                                        class="w-270 h-200 flex flex-row items-center justify-center"
                                    >
                                        <el-image
                                            src="/png/homepage_visualization.png"
                                            class="image w-270 h-200"
                                            z-index="100"
                                        />
                                    </div>
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                </div>

                <div class="h-170 flex flex-row w-full justify-center mt-20">
                    <div class="w-270 flex flex-row">
                        <div>
                            <iframe class="w-120 h-120" src="/cloudTag.html"></iframe>
                        </div>
                        <el-scrollbar
                            class="w-110 h-100 ml-40 rounded-7px bg-white mt-10"
                            style="box-shadow: 0 0 64px #cfd5db"
                        >
                            <div class="text-3xl font-600 mt-4 ml-8">NEWS</div>

                            <el-steps direction="vertical" class="h-70 ml-8 mt-5 mb-10">
                                <el-step :icon="Opportunity" status="process">
                                    <template #title>
                                        <div class="text-gray-700 font-600">
                                            Version 1.0 (2024.10.28)
                                        </div>
                                    </template>
                                    <template #description>
                                        <div :class="descriptionClass">
                                            mRNA Vaccine Design Platform (v1.0) has been released.
                                            Welcome to use.
                                        </div>
                                    </template>
                                </el-step>
                            </el-steps>
                        </el-scrollbar>
                    </div>
                </div>
                <el-footer
                    class="px-20 h-70 bg-[#253959] flex flex-col justify-center items-start text-white text-sm"
                >
                    <div class="px-10 w-full flex flex-row justify-between leading-relaxed">
                        <div class="flex flex-col">
                            <el-scrollbar class="w-35 h-35">
                                <iframe
                                    src="/revolvermaps.html"
                                    frameborder="0"
                                    style="width: 100%; height: 310px"
                                ></iframe>
                            </el-scrollbar>
                        </div>
                        <div class="flex flex-col">
                            <a class="text-xl mb-3" href="/database">Database</a>
                            <p><a href="/database/antigen">Antigen List</a></p>
                            <p><a href="/database/tantigen">Tantigen List</a></p>
                            <p><a href="/database/three_utr">3'UTR List</a></p>
                            <!-- <p><a href="/database/filter">Sequence Filter</a></p> -->
                        </div>

                        <div class="flex flex-col">
                            <p class="text-xl mb-3">Analysis</p>
                            <p><a href="/analysis/linear_design">Linear Design</a></p>
                        </div>
                        <div class="flex flex-col mb-3">
                            <p class="text-xl mb-10"><a href="/workspace">Workspace</a></p>
                            <p class="text-xl"><a href="/download">Download</a></p>
                        </div>
                        <div class="flex flex-col">
                            <p class="text-xl mb-3">Help</p>
                            <p><a href="/tutorial">Tutorial</a></p>
                            <p><a href="/contact">Contact us</a></p>
                        </div>
                    </div>
                    <el-divider />
                    <div>2024 &copy; City University of Hong Kong. All rights reserved.</div>
                </el-footer>
            </div>
        </el-scrollbar>
        <admin v-show="false" />
    </div>
    <el-dialog v-model="dialogVisible" title="Tips" width="30%">
        <span>This is a message</span>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="confirmcookie()">Confirm</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
// import { ref, onMounted } from 'vue'
import { Opportunity } from '@element-plus/icons-vue'
import { useUserIdGenerator } from '@/utils/userIdGenerator'
import admin from './admin.vue'

const dialogVisible = ref(false)

const descriptionClass = ref('text-gray-500 font-400 pt-1 border-t-1 mb-5 w-70')

const router = useRouter()
// const route = useRoute()

const godatabasae = () => {
    router.push({
        path: '/database',
    })
}

const goDocument = () => {
    router.push({
        path: '/tutorial',
    })
}

const goAnalysis = () => {
    router.push({
        path: '/analysis/linear_design',
    })
}

const confirmcookie = () => {
    const { generateUserId, userId } = useUserIdGenerator()
    generateUserId()
    dialogVisible.value = false
    console.log(userId.value)
}
</script>

<style lang="scss" scoped>
:deep(.el-carousel__arrow) {
    background-color: rgb(31 45 61 / 59%);
}

:deep(.el-carousel__indicators--outside button) {
    height: 10px;
    width: 60px;
    background-color: #070708;
}
</style>
