<template>
    <div class="user-management-container">
        <div class="user-management-content">
            <!-- Page Header -->
            <div class="page-header">
                <h1>User Management</h1>
                <p>Manage your account and access protected features</p>
            </div>

            <!-- Authentication Status Card -->
            <n-card class="auth-card" :bordered="false">
                <!-- Not Authenticated State -->
                <div v-if="!authStore.isAuthenticated" class="login-section">
                    <div class="login-header">
                        <h2>Login Required</h2>
                        <p>Sign in to access protected database features</p>
                    </div>

                    <n-form
                        ref="formRef"
                        :model="formData"
                        :rules="rules"
                        size="large"
                        @submit.prevent="handleLogin"
                    >
                        <n-form-item path="username" label="Username">
                            <n-input
                                v-model:value="formData.username"
                                placeholder="Enter your username"
                                :disabled="authStore.isLoading"
                            />
                        </n-form-item>

                        <n-form-item path="password" label="Password">
                            <n-input
                                v-model:value="formData.password"
                                type="password"
                                placeholder="Enter your password"
                                :disabled="authStore.isLoading"
                                @keyup.enter="handleLogin"
                            />
                        </n-form-item>

                        <n-form-item>
                            <n-button
                                type="primary"
                                block
                                size="large"
                                :loading="authStore.isLoading"
                                @click="handleLogin"
                            >
                                Login
                            </n-button>
                        </n-form-item>
                    </n-form>

                    <div v-if="authStore.error" class="error-message">
                        <n-alert type="error" :show-icon="true">
                            {{ authStore.error }}
                        </n-alert>
                    </div>
                </div>

                <!-- Authenticated State -->
                <div v-else class="user-dashboard">
                    <div class="user-info">
                        <div class="user-avatar">
                            <span>{{ getUserInitials() }}</span>
                        </div>
                        <div class="user-details">
                            <h2>{{ authStore.user?.username || 'Unknown User' }}</h2>
                            <p>{{ authStore.user?.email || 'No email provided' }}</p>
                            <div class="user-badges">
                                <n-tag v-if="authStore.isStaff" type="success" size="small">
                                    Staff
                                </n-tag>
                                <n-tag v-if="authStore.isAdmin" type="warning" size="small">
                                    Admin
                                </n-tag>
                                <n-tag type="info" size="small">Authenticated</n-tag>
                            </div>
                            <div class="login-time">
                                <small>Logged in at {{ formatLoginTime() }}</small>
                            </div>
                        </div>
                    </div>

                    <div class="user-actions">
                        <n-button type="error" size="large" @click="handleLogout">Logout</n-button>
                    </div>
                </div>
            </n-card>

            <!-- Protected Pages Information -->
            <n-card class="protected-pages-card" :bordered="false">
                <template #header>
                    <div class="pages-header">
                        <h3>Protected Database Features</h3>
                        <n-tag
                            :type="authStore.isAuthenticated ? 'success' : 'warning'"
                            size="small"
                        >
                            {{ authStore.isAuthenticated ? 'All Accessible' : 'Login Required' }}
                        </n-tag>
                    </div>
                </template>

                <div class="protected-pages-content">
                    <p class="description">
                        The following TranscriptHub pages require authentication to access:
                    </p>

                    <div class="pages-grid">
                        <div
                            v-for="page in protectedPages"
                            :key="page.path"
                            class="page-item"
                            :class="{ accessible: authStore.isAuthenticated }"
                        >
                            <div class="page-icon">
                                {{ page.icon }}
                            </div>
                            <div class="page-info">
                                <h4>{{ page.title }}</h4>
                                <p>{{ page.description }}</p>
                                <div class="page-path">{{ page.path }}</div>
                            </div>
                            <!-- <div class="page-status">
                                <n-tag
                                    :type="authStore.isAuthenticated ? 'success' : 'default'"
                                    size="small"
                                >
                                    {{
                                        authStore.isAuthenticated ? 'Accessible' : 'Login Required'
                                    }}
                                </n-tag>
                            </div> -->
                            <div class="page-action">
                                <n-button
                                    v-if="authStore.isAuthenticated"
                                    type="primary"
                                    size="small"
                                    @click="navigateToPage(page.path)"
                                >
                                    Access
                                </n-button>
                                <n-button v-else type="default" size="small" disabled>
                                    Login Required
                                </n-button>
                            </div>
                        </div>
                    </div>
                </div>
            </n-card>

            <!-- Show redirect option if there was a redirect path -->
            <div v-if="redirectPath && authStore.isAuthenticated" class="redirect-option">
                <n-alert type="success" :show-icon="true">
                    <template #header>Login Successful!</template>
                    You can now access all protected features.
                    <br />
                    <div style="margin-top: 0.5rem">
                        <n-button type="primary" size="small" @click="navigateToPage(redirectPath)">
                            Continue to {{ getPageTitle(redirectPath) }}
                        </n-button>
                        <n-button
                            type="default"
                            size="small"
                            style="margin-left: 0.5rem"
                            @click="clearRedirect"
                        >
                            Stay Here
                        </n-button>
                    </div>
                </n-alert>
            </div>

            <!-- Info for direct access -->
            <div v-if="redirectPath && !authStore.isAuthenticated" class="redirect-info">
                <n-alert type="info" :show-icon="true">
                    After login, you can choose to continue to
                    <strong>{{ getPageTitle(redirectPath) }}</strong>
                    or stay on this page.
                </n-alert>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NForm, NFormItem, NInput, NButton, NAlert, NTag } from 'naive-ui'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const formRef = ref()

const formData = ref({
    username: '',
    password: '',
})

const rules = {
    username: [{ required: true, message: 'Username is required', trigger: 'blur' }],
    password: [{ required: true, message: 'Password is required', trigger: 'blur' }],
}

const redirectPath = computed(() => route.query.redirect as string)

const protectedPages = ref([
    {
        path: '/database/transcripthub/assembly',
        title: 'Transcript Assembly',
        description: 'Access transcript assembly in the database',
        icon: '📝',
    },
    {
        path: '/database/transcripthub/annotation',
        title: 'Transcript Annotation',
        description: 'Access transcript annotations in the database',
        icon: '📝',
    },
])

const getUserInitials = () => {
    const username = authStore.user?.username || 'U'
    return username.substring(0, 2).toUpperCase()
}

const formatLoginTime = () => {
    return new Date().toLocaleString()
}

const getPageTitle = (path: string) => {
    const page = protectedPages.value.find(p => p.path === path)
    return page ? page.title : path
}

const handleLogin = async () => {
    try {
        await formRef.value?.validate()

        const result = await authStore.login(formData.value)

        if (result.success) {
            ElMessage.success('Login successful!')

            // Clear form
            formData.value = { username: '', password: '' }

            // DO NOT AUTO-REDIRECT - Let user choose
            // Just stay on the current page and show options
        } else {
            ElMessage.error(result.error || 'Login failed')
        }
    } catch (error) {
        console.error('Login validation failed:', error)
    }
}

const handleLogout = async () => {
    try {
        await authStore.logout()
        ElMessage.success('Logged out successfully')
        // Clear any redirect path when logging out
        if (route.query.redirect) {
            router.replace('/login')
        }
    } catch (error) {
        console.error('Logout error:', error)
        ElMessage.error('Logout failed')
    }
}

const navigateToPage = (path: string) => {
    router.push(path)
}

const clearRedirect = () => {
    // Remove redirect query parameter
    router.replace('/login')
}

onMounted(() => {
    // Don't do anything special on mount - just let the component render
})
</script>

<style scoped>
.user-management-container {
    min-height: calc(100vh - 80px);
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 2rem;
}

.user-management-content {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.page-header {
    text-align: center;
    margin-bottom: 1rem;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
}

.page-header p {
    font-size: 1.1rem;
    color: #64748b;
    margin: 0;
}

.auth-card {
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.login-section {
    max-width: 400px;
    margin: 0 auto;
}

.login-header {
    text-align: center;
    margin-bottom: 2rem;
}

.login-header h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
}

.login-header p {
    color: #64748b;
    margin: 0;
}

.error-message {
    margin-top: 1rem;
}

.user-dashboard {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
}

.user-avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.25rem;
}

.user-details h2 {
    margin: 0 0 0.25rem 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
}

.user-details p {
    margin: 0 0 0.5rem 0;
    color: #64748b;
}

.user-badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.login-time {
    color: #9ca3af;
}

.protected-pages-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.pages-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.pages-header h3 {
    margin: 0;
}

.description {
    color: #64748b;
    margin-bottom: 1.5rem;
}

.pages-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.page-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    transition: all 0.2s;
}

.page-item:hover {
    border-color: #cbd5e1;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.page-item.accessible {
    border-color: #10b981;
    background-color: #f0fdf4;
}

.page-icon {
    font-size: 1.5rem;
}

.page-info h4 {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: #1e293b;
}

.page-info p {
    margin: 0 0 0.5rem 0;
    color: #64748b;
    font-size: 0.875rem;
}

.page-path {
    font-family: monospace;
    font-size: 0.75rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
}

.redirect-info,
.redirect-option {
    margin-top: 1rem;
}

@media (max-width: 768px) {
    .user-management-container {
        padding: 1rem;
    }

    .page-header h1 {
        font-size: 2rem;
    }

    .user-dashboard {
        flex-direction: column;
        align-items: stretch;
    }

    .page-item {
        grid-template-columns: 1fr;
        gap: 0.5rem;
        text-align: center;
    }

    .pages-header {
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }
}
</style>
