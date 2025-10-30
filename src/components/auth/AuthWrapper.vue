<template>
    <div v-if="authStore.isAuthenticated" class="auth-wrapper">
        <!-- Show content when authenticated -->
        <slot />
    </div>

    <div v-else class="auth-redirect">
        <!-- Show loading while redirecting -->
        <div class="redirect-container">
            <div class="redirect-content">
                <div class="spinner">
                    <div class="spinner-circle"></div>
                </div>
                <h2>{{ authTitle }}</h2>
                <p>{{ authMessage }}</p>
                <p class="sub-message">{{ authSubMessage }}</p>
                <p class="redirect-message">Redirecting to User Management...</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/auth'

interface Props {
    authTitle?: string
    authMessage?: string
    authSubMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
    authTitle: 'Authentication Required',
    authMessage: 'This page requires authentication to access.',
    authSubMessage: 'Please log in to continue.',
})

// eslint-disable-next-line vue/no-setup-props-destructure
const { authTitle, authMessage, authSubMessage } = props

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(() => {
    if (!authStore.isAuthenticated) {
        // Redirect to user management with current path as redirect parameter
        const redirectPath = route.fullPath
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
})
</script>

<style scoped>
.auth-wrapper {
    /* Content wrapper - no special styling needed */
}

.auth-redirect {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.redirect-container {
    max-width: 500px;
    padding: 2rem;
}

.redirect-content {
    text-align: center;
    background: white;
    padding: 3rem 2rem;
    border-radius: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.spinner {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
}

.spinner-circle {
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #2563eb;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.redirect-content h2 {
    font-size: 1.75rem;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 1rem 0;
}

.redirect-content p {
    color: #64748b;
    margin: 0 0 0.5rem 0;
    line-height: 1.6;
}

.sub-message {
    font-size: 0.875rem;
}

.redirect-message {
    font-weight: 500;
    color: #2563eb;
    margin-top: 1.5rem !important;
}
</style>
