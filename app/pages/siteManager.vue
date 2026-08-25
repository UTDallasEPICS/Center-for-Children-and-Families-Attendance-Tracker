<script setup lang="ts">
import { dropdownMenu } from '#build/ui'
import { Calendar, Filter } from 'lucide-vue-next'
const filterTypes = [
  { id: 'all', label: 'All' },
  { id: 'present', label: 'Present' },
  { id: 'late', label: 'Late' },
  { id: 'calledOff', label: 'Called Off' },
  { id: 'absent', label: 'Absent' },
]
const items = [
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

const allItems: ListItem[] = [
  {
    id: 1,
    label: 'John Doe',
    sublabel: '9:00 AM',
    initials: 'JD',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 2,
    label: 'Emily Carter',
    sublabel: '8:59 AM',
    initials: 'EC',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 3,
    label: 'Daniel Kim',
    sublabel: '9:00 AM',
    initials: 'DK',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 4,
    label: 'Ava Martinez',
    sublabel: '9:01 AM',
    initials: 'AM',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 5,
    label: 'Chris Brown',
    sublabel: '9:02 AM',
    initials: 'CB',
    status: 'green',
    needsCheckIn: false,
    action: { type: 'view', label: 'View' },
  },
  {
    id: 6,
    label: 'Sophia Lee',
    sublabel: 'N/A',
    initials: 'SL',
    status: 'yellow',
    needsCheckIn: true,
    action: { type: 'checkin', label: 'Check In' },
  },
  {
    id: 7,
    label: 'Michael Scott',
    sublabel: 'Called Off',
    initials: 'MS',
    status: 'red',
    needsCheckIn: true,
    action: { type: 'checkin', label: 'Check In' },
  },
]


</script>

<template class="px-6">

    <div class="flex py-4 justify-center">
      <Dropdown 
      v-model:current="selectedItem"
      :items="items"
      width-class="w-80"
      />
    </div>
   <div class=" px-5 flex pt-4 items-center gap-2 text-[#A1A1A1]">
        <Calendar class="w-8 h-8" />
        <span class="text-xl">Wednesday, May, 2026</span>
    </div>

    <div class="px-13">
        <button class="mt-4 w-full py-2 h-15 bg-brand-orange text-white rounded-xl hover:bg-orange-300 transition">
            Show daily check-in code
        </button>
    </div>

    <div class="flex justify-center gap-6 py-6">
        <AttendanceBox :count="3" att-type="Present" />
        <AttendanceBox :count="2" att-type="Late" />
        <AttendanceBox :count="1" att-type="CalledOff" />
        <AttendanceBox :count="1" att-type="Absent" />
    </div>
    <div class="px-5">
        <SearchBarComponent 
            placeholder="Search intern by name or ID"
        />
    </div>

    <div class="px-10 py-5 flex items-center text-[#737373] gap-6">
        <Filter class="w-5 h-5 text-[#737373]" />

        <Dropdown
            v-model:current="selectedItem"
            :items="filterTypes"
            width-class="w-80"
        />

        <span>7 workers</span>
    </div>
    <div class="px-5">
        <ListComponent 
        :items="allItems"/>
    </div>
</template>