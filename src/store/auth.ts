/* eslint-disable camelcase */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

interface User {
    id: number
    username: string
    email: string
    is_staff?: boolean
    is_superuser?: boolean
}

interface LoginCredentials {
    username: string
    password: string
}

export const useAuthStore = defineStore(
    'auth',
    () => {
        const router = useRouter()

        // State
        const user = ref<User | null>(null)
        const token = ref<string | null>(null)
        const isLoading = ref(false)
        const error = ref<string | null>(null)

        // Computed
        const isAuthenticated = computed(() => !!token.value && !!user.value)

        const canAccessTranscript = computed(() => {
            return isAuthenticated.value
        })

        const isStaff = computed(() => {
            return user.value?.is_staff || false
        })

        const isAdmin = computed(() => {
            return user.value?.is_superuser || false
        })

        // Helper methods for redirect handling
        const getRedirectPath = (): string | null => {
            if (typeof window === 'undefined') return null

            const urlParams = new URLSearchParams(window.location.search)
            return urlParams.get('redirect')
        }

        const getPostLoginRedirectPath = (): string => {
            const redirectPath = getRedirectPath()

            if (redirectPath && redirectPath.startsWith('/database/transcripthub/')) {
                return redirectPath
            }

            // Default redirect path
            return '/database/transcripthub/annotation'
        }

        // Get list of protected pages
        const getProtectedPages = () => {
            return [
                {
                    path: '/database/transcripthub/annotation',
                    title: 'Transcript Annotation',
                    description: 'View and manage transcript annotations',
                },
                {
                    path: '/database/transcripthub/assembly',
                    title: 'Transcript Assembly',
                    description: 'Access transcript assembly tools',
                },
            ]
        }

        // Actions
        const login = async (credentials: LoginCredentials) => {
            try {
                isLoading.value = true
                error.value = null

                const response = await axios.post('/auth/login/', credentials, {
                    baseURL: '/api',
                })

                const { token: authToken, user: userData } = response.data

                // Store auth data
                token.value = authToken
                user.value = userData

                // Persist to localStorage
                localStorage.setItem('auth_token', authToken)
                localStorage.setItem('auth_user', JSON.stringify(userData))

                // Set default axios header
                axios.defaults.headers.common.Authorization = `Bearer ${authToken}`

                return { success: true }
            } catch (err: any) {
                error.value = err.response?.data?.message || 'Login failed'
                return { success: false, error: error.value }
            } finally {
                isLoading.value = false
            }
        }

        const clearAuthData = () => {
            user.value = null
            token.value = null
            error.value = null

            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')

            delete axios.defaults.headers.common.Authorization
        }

        const logout = async () => {
            try {
                if (token.value) {
                    await axios.post(
                        '/auth/logout/',
                        {},
                        {
                            baseURL: '/api',
                            headers: { Authorization: `Bearer ${token.value}` },
                        }
                    )
                }
            } catch (err) {
                console.warn('Logout API call failed:', err)
            } finally {
                clearAuthData()
                router.push('/login')
            }
        }

        const initializeAuth = () => {
            const storedToken = localStorage.getItem('auth_token')
            const storedUser = localStorage.getItem('auth_user')

            if (storedToken && storedUser) {
                try {
                    token.value = storedToken
                    user.value = JSON.parse(storedUser)
                    axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`
                } catch (err) {
                    console.error('Failed to parse stored user data:', err)
                    clearAuthData()
                }
            }
        }

        return {
            // State
            user,
            token,
            isLoading,
            error,

            // Computed
            isAuthenticated,
            canAccessTranscript,
            isStaff,
            isAdmin,

            // Actions
            login,
            logout,
            clearAuthData,
            initializeAuth,
            getRedirectPath,
            getPostLoginRedirectPath,
            getProtectedPages,
        }
    },
    {
        persist: true,
    }
)
