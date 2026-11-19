<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const isModalOpen = ref(false)

const items = ref<NavigationMenuItem[]>([
  { label: 'Dashboard', to: '/' },
  { label: 'Participant Check-In', to: '/participant' },
  { label: 'Site Management', to: '/siteManager' },
])
</script>

<template>
  <header
    class="w-full bg-[var(--color-brand-orange)] h-[100px] lg:h-[64px] pl-4 flex items-center"
  >
    <!-- Left: Logo -->
    <div class="flex items-center shrink-0 pr-6">
      <NuxtImg
        src="/UTD-Logo.svg"
        alt="UTD Mobile Logo"
        class="block h-10 lg:h-15 w-auto xl:hidden"
      />

      <NuxtImg
        src="/UTD-Logo-expanded.svg"
        alt="UTD Desktop Logo"
        class="hidden h-10 w-auto xl:block"
      />
    </div>

    <!-- Mobile: Hamburger menu -->
    <div class="flex md:hidden ml-auto pr-4">
      <UModal v-model:open="isModalOpen" fullscreen>
        <UButton
          icon="i-lucide-menu"
          color="neutral"
          variant="ghost"
          class="text-white"
          size="xl"
        />

        <template #body>
          <div class="flex flex-col gap-6 p-6">
            <NuxtLink
              v-for="item in items"
              :key="item.to"
              :to="item.to"
              @click="isModalOpen = false"
              class="text-lg text-gray-800 hover:underline hover:text-[var(--color-brand-orange)] border-b border-gray-200 pb-4"
            >
              {{ item.label }}
            </NuxtLink>
          </div>
        </template>
      </UModal>
    </div>

    <!-- Desktop: Tabs -->
  <div class="hidden md:block flex-1 h-full pl-4 min-w-0">
    <UNavigationMenu
      :items="items"
      color="neutral"
      variant="link"
      class="w-full h-full [&>div]:w-full [&>div]:h-full"
      :ui="{
        root: 'w-full h-full max-w-none',
        list: 'w-full h-full flex items-stretch justify-start gap-0',
        item: 'flex-none flex',
        link: 'w-full h-full flex items-end justify-start text-lg px-6 pt-4 pb-2.5 whitespace-nowrap text-white hover:underline hover:bg-transparent hover:text-white/75 data-[active]:bg-transparent data-[active]:text-white transition-colors'
      }"
    />
  </div>
  </header>
</template>