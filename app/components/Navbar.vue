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
  <div class="w-full bg-[#E87500] py-2 pt-4">
    <UDashboardNavbar toggle-side="left" :ui="{ root: 'relative border-none'} ">
      <template #toggle>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-menu"
            class="rounded-full !text-white hover:!bg-white/20"
            size="xl"
            :ui="{ leadingIcon: 'size-8' }"
            @click="isOpen = true"
          />
      </template>

      <template #right>
        <UDropdownMenu 
          :items="[
            [{ label: 'Profile', icon: 'i-lucide-user' }],
            [{ label: 'Settings', icon: 'i-lucide-settings' }],
            [{ label: 'Logout', icon: 'i-lucide-log-out' }]
          ]"
        >
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-user"
            class="rounded-full !text-white hover:!bg-white/20"
            size="xl"
            :ui="{ leadingIcon: 'size-8' }"
          />
        </UDropdownMenu>
      </template>

      <template #left>
        <div class = "absolute left-1/2 -translate-x-1/2 bg-transparent">
          <img  
            src="/UTD-Logo-2.png"
            alt="UTD Logo"
            class="h-16 object-contain mx-auto "
          />
        </div>
      </template>
    </UDashboardNavbar>
  </div>

   <Teleport to="body">
   <div v-if="isOpen" class="fixed inset-0 z-[100] bg-white flex flex-col p-6 gap-4 items-start" >
      <UButton
        variant="ghost"
        icon="i-lucide-x"
        class="self-start !text-black"
        @click="isOpen = false"
        
      />
      <UButton variant="ghost" label="Dashboard" to="/" size="xl" class="!text-black"/>
      <UButton variant="ghost" label="Messages" to="/" size="xl" class="!text-black"/>
      <UButton variant="ghost" label="Participant Check-In" to="/" size="xl" class="!text-black"/>
      <UButton variant="ghost" label="Site Management" to="/" size="xl" class="!text-black"/>
      <UButton variant="ghost" label="Intern Information" to="/" size="xl" class="!text-black"/>
      <UButton variant="ghost" label="Participant Information" to="/" size="xl" class="!text-black"/>
    </div>
  </Teleport>


 <div class="w-full bg-white shadow sticky top-0 z-50 hidden md:block">
    <UNavigationMenu
      :items="items"
      color="neutral"
      variant="link"
      class="w-full justify-center"
      :ui="{
        list: 'isolate min-w-0 flex items-center gap-[clamp(4rem,4vw,6rem)]',
        linkLabel: 'text-[clamp(.75rem,1.25vw,1.5rem)] !text-black'
      }"
    />
  </div>
</template>
