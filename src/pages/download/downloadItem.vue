<template>
    <div class="w-280 border-1 border-gray-700 h-13 flex flex-row">
        <div
            class="w-160 border-r-1 border-gray-700 h-13 flex-row flex pl-4 items-center text-[19px]"
        >
            {{ description }}
        </div>

        <div class="w-120 flex flex-row items-center justify-start">
            <n-button class="ml-10 w-23 h-7 text-lg" text>
                <template #icon>
                    <n-icon class="text-lg">
                        <Download />
                    </n-icon>
                </template>
                <a :href="link" target="_blank" class="btn">Click to Download</a>
            </n-button>
        </div>
    </div>
</template>

<script setup>
import { Download } from '@vicons/fa'

defineProps({
    description: String,
    link: String,
})
</script>
