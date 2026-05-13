<!-- pages/participant.vue -->
<script setup lang="ts">const items = [
  { id: 1, label: 'Prairie Creek Branch Library' },
  { id: 2, label: 'Bachman Lake Library' },
  { id: 3, label: 'Hampton-Illinois Branch Library' }
]

 interface ListItem {
  id: string | number
  label: string
  sublabel?: string
  initials?: string
  avatarUrl?: string
  status?: 'green' | 'yellow' | 'red'
  needsCheckIn?: boolean
  action?: { type: string; label: string }
}

interface ListGroup {
  title: string
  items: ListItem[]
}

const allItems: ListItem[] = [
  //  CHECKED IN (5)
  {
    id: 1,
    label: 'John Doe',
    sublabel: 'Frontend Intern',
    initials: 'JD',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 2,
    label: 'Emily Carter',
    sublabel: 'Product Intern',
    initials: 'EC',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 3,
    label: 'Daniel Kim',
    sublabel: 'Backend Intern',
    initials: 'DK',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 4,
    label: 'Ava Martinez',
    sublabel: 'UI Designer',
    initials: 'AM',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 5,
    label: 'Chris Brown',
    sublabel: 'QA Intern',
    initials: 'CB',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },

  // NOT CHECKED IN (2)
  {
    id: 6,
    label: 'Sophia Lee',
    sublabel: 'UX Intern',
    initials: 'SL',
    status: 'yellow',
    needsCheckIn: true,
    action: { type: 'checkin', label: 'Check In' },
  },
  {
    id: 7,
    label: 'Michael Scott',
    sublabel: 'Office Intern',
    initials: 'MS',
    status: 'red',
    needsCheckIn: true,
    action: { type: 'checkin', label: 'Check In' },
  },
]

const groups: ListGroup[] = [
  {
    title: 'Checked In',
    items: allItems.filter(i => !i.needsCheckIn),
  },
  {
    title: 'Not Checked In',
    items: allItems.filter(i => i.needsCheckIn),
  },
]


</script>

<template class="px-6">

  <div class="flex pt-4 justify-center">
      <Dropdown 
      v-model:current="selectedItem"
      :items="items"
      width-class="w-162"
      />
    </div>
  <div class="px-4 pt-2">  
    <SearchBarComponent />
    <div class="text-[#737373`] text-xl font-medium mt-4 mb-2"> 
      week 4
    </div>
  <div class="">
    <div class="text-[#737373] text-xl">
      <span class="text-5xl text-brand-orange "> 5 </span> of 7 checked in
    </div>

    </div>
      <div>
        <ProgressBar
        :value="5"
        :max="7"
      />
    </div>

    <div class="text-[#737373] text-xl pt-10 mt-2 flex items-center gap-2">
      <span>Needs Check-In</span>

      <div class="w-1 h-1 bg-neutral-300 rounded-full"></div>

      <span>2</span>
    </div>



    
    <ListComponent
      :groups="groups"
    />

  </div>
</template>
