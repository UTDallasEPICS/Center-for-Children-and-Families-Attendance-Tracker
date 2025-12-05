<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
          <div class="flex items-center justify-center mb-6">
          <img
            :src="logo"
            alt="Center for Children and Families Logo"
          />
        </div>

        <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Sign in</h1>
        <p class="text-lg font-normal text-gray-600">to CCF</p>
      </div>

      <!-- Card -->
      <div class="shadow-lg border border-gray-200 bg-white rounded-xl">
        <div class="p-8 space-y-6">
          <!-- University Button -->
          <button
            @click="handleSSOLogin('University')"
            class="w-full h-12 border border-gray-300 rounded-lg flex items-center justify-center gap-3
            text-gray-700 font-medium bg-white
            hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900
            transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <LockIcon class="w-4 h-4" />
            <span class="font-medium">Sign in with University Account</span>
          </button>

          <!-- Divider -->
          <div class="relative">
            <hr class="border-t border-gray-200" />
            <div class="absolute inset-0 flex justify-center items-center">
              <span class="bg-white px-3 text-sm text-gray-500">Or continue with</span>
            </div>
          </div>

          <!-- Google -->
          <button
            @click="handleSSOLogin('Google')"
            class="w-full h-12 border border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-gray-700 font-medium">Continue with Google</span>
          </button>

          <!-- Microsoft -->
          <button
            @click="handleSSOLogin('Microsoft')"
            class="w-full h-12 border border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1V1z"/>
              <path fill="#00A4EF" d="M13 1h10v10H13V1z"/>
              <path fill="#7FBA00" d="M1 13h10v10H1V13z"/>
              <path fill="#FFB900" d="M13 13h10v10H13V13z"/>
            </svg>
            <span class="text-gray-700 font-medium">Continue with Microsoft</span>
          </button>

          <!-- Facebook -->
          <button
            @click="handleSSOLogin('Facebook')"
            class="w-full h-12 border border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg flex items-center justify-center gap-3"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073C0 18.063 4.388 23.027 10.125 23.927v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="text-gray-700 font-medium">Continue with Facebook</span>
          </button>

          <!-- Help -->
          <div class="text-center pt-4">
            <button class="text-sm text-gray-500 hover:text-gray-700 font-medium">Need help signing in?</button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <div class="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <UserIcon class="w-4 h-4" />
          <span>Powered by CCF</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LockIcon, UserIcon } from 'lucide-vue-next'
import logo from '../assets/images/logo.svg'

const handleSSOLogin = (provider) => {
  console.log(`Login with ${provider}`)
}
</script>
