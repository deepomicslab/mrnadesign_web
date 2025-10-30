<template>
    <div>
        <!-- Loading state -->
        <div v-if="authStore.isLoading" class="auth-loading">
            <n-spin size="large">
                <template #description>
                    <n-text>Checking authentication...</n-text>
                </template>
            </n-spin>
        </div>

        <!-- Not authenticated -->
        <div v-else-if="!authStore.isAuthenticated" class="auth-required">
            <n-card class="auth-card">
                <template #header>
                    <n-h2>Authentication Required</n-h2>
                </template>
                <n-space vertical>
                    <n-text>Please log in to access transcript database features.</n-text>
                    <n-button @click="redirectToLogin" type="primary" size="large">
                        Go to Login
                    </n-button>
                </n-space>
            </n-card>
        </div>

        <!-- Authenticated but not staff -->
        <div v-else-if="requiresStaff && !authStore.isStaff" class="staff-required">
            <n-card class="auth-card">
                <template #header>
                    <n-h2>Staff Access Required</n-h2>
                </template>
                <n-space vertical>
                    <n-text>You need staff permissions to access transcript database.</n-text>
                    <n-text depth="3">
                        Contact your administrator if you believe this is an error.
                    </n-text>
                </n-space>
            </n-card>
        </div>

        <!-- Authenticated and authorized -->
        <div v-else class="auth-content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { NCard, NH2, NText, NButton, NSpace, NSpin } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

interface Props {
    requiresStaff?: boolean
}

withDefaults(defineProps<Props>(), {
    requiresStaff: false,
})

const authStore = useAuthStore()
const router = useRouter()

const redirectToLogin = () => {
    const currentPath = router.currentRoute.value.fullPath
    localStorage.setItem('redirectAfterLogin', currentPath)
    router.push('/login')
}
</script>

<style scoped>
.auth-loading,
.auth-required,
.staff-required {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
}

.auth-card {
    max-width: 400px;
    text-align: center;
}
</style>
