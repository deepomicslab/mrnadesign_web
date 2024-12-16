<template>
    <n-anchor show-rail affix :top="150" class="ml-15 w-55" show-background :bound="124">
        <n-anchor-link title="Database Table Download" href="#meta" class="text-xl"></n-anchor-link>
        <n-anchor-link title="FASTA File Download" href="#fasta" />
    </n-anchor>

    <div class="flex flex-col w-full h-2220 justify-start items-center">
        <div id="meta" class="pt-10">
            <div class="w-280 border-b-1 border-[#34498E] pb-3">
                <div class="text-[40px] text-[#34498E] font-600">Database Tables</div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>Antigen</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="Antigen Sequence"
                        link="https://mrnaapi.deepomics.org/database/files/Antigen_se.csv/"
                    ></downloadItem>
                </div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>Tantigen</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="Tantigen Sequence"
                        link="https://mrnaapi.deepomics.org/database/files/Tantigen_rna_seq.csv/"
                    ></downloadItem>
                    <downloadItem
                        description="Tantigen DB"
                        link="https://mrnaapi.deepomics.org/database/files/TAntigendb_se.csv/"
                    ></downloadItem>
                </div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>3'UTR</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="3'UTR Data"
                        link="https://mrnaapi.deepomics.org/database/files/Complete_3_UTR_ARE_Data/Complete_3_UTR_Data.csv/"
                    ></downloadItem>
                </div>
            </div>
        </div>
        <div id="fasta" class="pt-10">
            <div class="w-280 mt-20 border-b-1 border-[#34498E] pb-3">
                <div class="text-[40px] text-[#34498E] font-600">FASTA File Download</div>
            </div>
            <div class="w-280 mt-10">
                <div class="w-280 bg-[#34498E] text-gray-50 p-4 text-[20px] font-600">
                    <div>Phage FASTA File Download</div>
                    <div></div>
                </div>
                <div class="w-280 border-1 border-gray-700">
                    <downloadItem
                        description="Human 3'UTR"
                        link="https://mrnaapi.deepomics.org/database/files/human-3UTR-refseq.fasta/"
                    ></downloadItem>
                    <downloadItem
                        description="Human 5'UTR"
                        link="https://mrnaapi.deepomics.org/database/files/human-5UTR-refseq.fasta/"
                    ></downloadItem>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import downloadItem from './downloadItem.vue'
</script>
