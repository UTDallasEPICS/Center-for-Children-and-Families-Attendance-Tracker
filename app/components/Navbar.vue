<script setup lang="ts">
const isOpen = ref(false)
import type { NavigationMenuItem } from '@nuxt/ui'

const items = ref<NavigationMenuItem[]>([
  { label: 'Dashboard', to: '/' },
  { label: 'Messages', to: '/' },
  { label: 'Participant Check-In', to: '/' },
  { label: 'Site Management', to: '/' },
  { label: 'Intern Information', to: '/' },
  { label: 'Participant Information', to: '/' }
])
</script>

<template>
  <div class="w-full bg-[#E87500] py-2">
    <UDashboardNavbar toggle-side="right">
      <template #toggle>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            class="rounded-full !text-white hover:!bg-white/20"
            size="xl"
            @click="isOpen = true"
          />
        </template>
      <template #title>
        <div class = "bg-transparent">
          <img  
            src="/UTD-Logo-2.png"
            alt="UTD Logo"
            class="h-8 object-contain "
          />
        </div>
      </template>
    </UDashboardNavbar>
  </div>

   <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] bg-white flex flex-col p-6 gap-4"
    >
      <UButton
        variant="ghost"
        icon="i-lucide-x"
        class="self-end"
        @click="isOpen = false"
      />
      <UButton variant="ghost" label="Dashboard" to="/" size="xl" class="w-full justify-center"/>
      <UButton variant="ghost" label="Messages" to="/" size="xl" class="w-full justify-center"/>
      <UButton variant="ghost" label="Participant Check-In" to="/" size="xl" class="w-full justify-center"/>
      <UButton variant="ghost" label="Site Management" to="/" size="xl" class="w-full justify-center"/>
      <UButton variant="ghost" label="Intern Information" to="/" size="xl" class="w-full justify-center"/>
      <UButton variant="ghost" label="Participant Information" to="/" size="xl" class="w-full justify-center"/>
    </div>
  </Teleport>


 <div class="w-full bg-white shadow sticky top-0 z-50 hidden md:block">
    <UNavigationMenu
      :items="items"
      color="neutral"
      variant="link"
      class="w-full justify-center"
      :ui="{
        list: 'isolate min-w-0 flex items-center gap-[clamp(2rem,17vw,20rem)]',
        linkLabel: 'text-[clamp(0.5rem,1.75vw,2rem)]'
      }"
    />
  </div>
</template>
