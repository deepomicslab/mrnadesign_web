<template>
    <AuthWrapper
        auth-title="Transcript Database Access Required"
        auth-message="Access to the Transcript Database requires authentication."
        auth-sub-message="Please log in with your authorized account to continue."
    >
        <MainComponent />
    </AuthWrapper>
</template>
<script setup lang="ts">
import MainComponent from './main.vue'
// eslint-disable-next-line import/extensions
import AuthWrapper from '@/components/auth/AuthWrapper.vue'
</script>
