<script setup lang="ts">

import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight} from 'lucide-vue-next'

const current = ref(new Date())

const {data, pending, error } = await useFetch('/api/intern/schedule/${user_id}')

const selectedDay = ref<Date>(new Date())
  
const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

type shift = {
  date: string ,
  site: string,
  status: 'good' | 'late' | 'absent' 
  checkin_time: string,
  checkout_time: string,
}

type schedule = {
  past_shifts: shift[],
  upcoming_shifts: shift[], 
}

const scheduleData = ref<schedule>({
  past_shifts: [],
  upcoming_shifts: []
})

const attendanceCounts = computed(() => {
  const counts = { good: 0, late: 0, absent: 0 }

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  for (let i = scheduleData.value.past_shifts.length - 1; i >= 0; i--) {
    const shift = scheduleData.value.past_shifts[i]

    const [year, month, day] = shift.date.split('-').map(Number)
    const d = new Date(year, month - 1, day)

    if (
      d.getMonth() === currentMonth &&
      d.getFullYear() === currentYear
    ) {
      if (shift.status === 'good') counts.good++
      else if (shift.status === 'late') counts.late++
      else if (shift.status === 'absent') counts.absent++
    }
  }

  return counts
})
  
function getShiftTimesByDate(targetDate: Date) {
  const target = targetDate.toISOString().split('T')[0]

  const shift = scheduleData.value.past_shifts.find(
    s => s.date === target
  )

  if (!shift) return null

  return {
    checkin: shift.checkin_time,
    checkout: shift.checkout_time
  }
}
function selectNewDay(day: Date) {
  selectedDay.value = day
}

function formatDateLocal(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const selectedShiftTimes = computed(() => {
  const target = formatDateLocal(selectedDay.value)

  const shift = scheduleData.value.past_shifts.find(
    s => s.date === target
  )

  return shift
    ? {
        checkin: shift.checkin_time,
        checkout: shift.checkout_time
      }
    : null
})

function prevMonth() {
  current.value = new Date(
    current.value.getFullYear(),
    current.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  current.value = new Date(
    current.value.getFullYear(),
    current.value.getMonth() + 1,
    1
  )
}

const monthLabel = computed(() => {
  return `${monthNames[current.value.getMonth()]} ${current.value.getFullYear()}`
})

const daysInMonth = computed(() => {
  return new Date(
    current.value.getFullYear(),
    current.value.getMonth() + 1,
    0
  ).getDate()
})

const startDay = computed(() => {
  return new Date(
    current.value.getFullYear(),
    current.value.getMonth(),
    1 //date is one
  ).getDay()
})

const calendarDays = computed(() => {
  const days = []
    
  for (let i = 0; i < startDay.value; i++) {
    days.push(null)
  }

  for (let d = 1; d <= daysInMonth.value; d++) {
    days.push(d)
  }

  return days
})

//makes shift color on a dates satus
function getDotClass(day) {
  const date = getDateString(day)
  const status = shiftsByDate.value[date]

  if (status === 'good') return '--color-success'
  if (status === 'late') return '--color-warning'
  if (status === 'absent') return '--color-error'

  return null // no shift
}

function getDateString(day) {
  const year = current.value.getFullYear()
  const month = current.value.getMonth() + 1

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}


const shiftsByDate = computed(() => {
  const map = {}

  const all = [
    ...(data.value?.past_shifts ?? []),
    ...(data.value?.upcoming_shifts ?? [])
  ]

  all.forEach(shift => {
    map[shift.date] = shift.status
  })

  return map
})

</script>


<template>
  <div class="bg-white w-[340px] min-h-[451px] max-h-[495px] p-5 m-5 rounded-xl flex flex-col items-center border-gray-200 border">
          
    <!-- Stats -->
    <div class="flex text-sm justify-between w-full text-gray-600 mb-2">
      <span>Good</span>
      <span class="text-green-600 mb-[2px]">{{attendanceCounts.good}}</span>
    </div>

    <div class="flex text-sm justify-between w-full text-gray-600 mb-2">
      <span>Late</span>
      <span class="text-orange-500 mb-[2px]">{{attendanceCounts.late}}</span>
    </div>

    <div class="flex text-sm justify-between w-full text-gray-600 mb-2">
      <span>Absent</span>
      <span class="text-red-600 mb-[2px]">{{attendanceCounts.absent}}</span>
    </div>

    <!-- Divider -->
    <div class="w-full border-t border-gray-200 mt-2 mb-3"></div>

    <!-- Header -->
    <div class="flex justify-between items-center w-full h-12 mb-2">
      <span class="text-gray-900 text-base"> {{ monthLabel }}</span>

      <div class="flex gap-9">
        <button @click="prevMonth" class="cursor-pointer text-lg hover:text-gray-00">  
          <ChevronLeft/>
        </button>
        <button @click="nextMonth" class="cursor-pointer text-lg hover:text-gray-600">
          <ChevronRight/>
        </button>
      </div>
    </div>

    <!-- Calendar -->
    <table>
      <thead>
        <tr class="text-[rgb(115,115,115)] text-sm ">
          <th class="w-11 h-5 font-normal">Sun</th>
          <th class="w-11 h-5 font-normal">Mon</th>
          <th class="w-11 h-5 font-normal">Tue</th>
          <th class="w-11 h-5 font-normal">Wed</th>
          <th class="w-11 h-5 font-normal">Thu</th>
          <th class="w-11 h-5 font-normal">Fri</th>
          <th class="w-11 h-5 font-normal">Sat</th>
        </tr>
      </thead>
      </table>
<div class="grid grid-cols-7">
<div
  v-for="(day, i) in calendarDays"
  :key="i"
  class="text-base text-gray-900 w-11 h-11 text-center relative hover:bg-gray-200 hover:rounded-lg cursor-pointer flex items-center justify-center cursor-pointer rounded-lg transition"
  :class="selectedDay === day ? 'bg-orange-100 rounded-full' : ''"
  @click="selectNewDay(day)"
>
  <span>{{ day }}</span>

  <div
    v-if="getDotClass(day) !== 'hidden'"
    class="absolute bottom-1 w-2 h-2 rounded-full"
    :class="getDotClass(day)"
  ></div>
</div>

  </div>

    <div class="w-full border-t border-gray-200 "></div>

    <!-- Shift Info -->
    <div class="flex justify-between w-full text-gray-600 text-sm mt-2">
      <div v-if="selectedShiftTimes">
  <p>{{ selectedShiftTimes.checkin }} - {{ selectedShiftTimes.checkout }}</p>
</div>
    </div>

  </div>
</template>