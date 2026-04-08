
<template>
  <UDashboardPanel>
    <template #header>
      <div class = "w-full bg-[#E87500]">
      <UDashboardNavbar toggle-side="right">
        <template #toggle>
          <UDropdownMenu 
          :ui="{
            itemLabel: 'text-xl',
            item: 'py-1'
          }"
          :items="[
          [{ label: 'Dashboard'}],
          [{ label: 'Messages'}],
          [{ label: 'Participant Check-In'}],
          [{ label: 'Site Management'}],
          [{ label: 'Intern Information'}],
          [{ label: 'Participant Information'}],
        ]"
        >
            <UButton
            size="xl"
            color = "neutral"
            variant = "ghost"
            icon = "i-lucide-user"
            class = "rounded-full !text-white hover:!bg-white/20"
            />
          </UDropdownMenu>
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
  </template>
  </UDashboardPanel>
  <NuxtPage/>
</template>