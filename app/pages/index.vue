<template>
  <div class="min-h-screen w-full bg-neutral-50">

    <div class="mx-auto w-full max-w-[800px] px-4 pb-10 pt-6 md:max-w-6xl md:px-8 md:pt-12">
      <h1 class="mb-3 text-2xl font-medium text-neutral-900 md:hidden">Intern Home</h1>

      <div class="grid grid-cols-1 gap-y-4 md:grid-cols-2 md:items-center md:gap-x-12 md:gap-y-0">

        <div class="md:hidden">
          <div class="flex items-center gap-2">
            <AvatarComponent
              avatar-url="https://i.pravatar.cc/150?img=69"
              initials="JD"
              status="green"
              :checked-in="checkedIn"
            />
            <div class="relative flex h-10 items-center rounded-2xl bg-white px-4 text-xs text-neutral-900 shadow-sm">
              <div class="absolute -left-[5px] bottom-0 h-3 w-3 rounded-full bg-white"></div>
              {{ checkedIn ? 'Checked in' : 'Not checked in' }}
            </div>
          </div>

          <div class="mt-4 flex items-center gap-1.5 text-sm text-neutral-600">
            <span class="font-medium text-neutral-900">Today</span>
            <span class="h-1 w-1 rounded-full bg-neutral-400"></span>
            <span>{{ formattedDate }}</span>
          </div>

          <div class="mt-1 text-[26px] font-medium text-neutral-900 sm:text-4xl">
            <span v-if="timePending" class="inline-block h-9 w-64 animate-pulse rounded bg-neutral-200"></span>
            <span v-else>{{ !timeError && formattedTime ? formattedTime : 'No Shift Scheduled Today' }}</span>
          </div>
        </div>

        <div class="md:flex md:flex-col">

          <section class="hidden rounded-lg border border-neutral-200 bg-white p-5 md:block md:h-[266px] md:w-[512px]">
            <h2 class="mb-4 text-center text-[24px] font-medium leading-[1.4] text-neutral-900">Upcoming Shifts</h2>
            <ul class="space-y-4">
              <li v-for="(shift, i) in upcomingShifts" :key="shift.date">
                <div
                  class="flex items-center gap-2 text-[20px] font-medium leading-[1.4]"
                  :class="i === 0 ? 'text-green-600' : 'text-emerald-900'"
                >
                  <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  {{ shift.date }}
                </div>
                <div
                  class="mt-1 flex items-center gap-2 pl-8 text-[18px] leading-[1.4]"
                  :class="i === 0 ? 'text-green-600' : 'text-neutral-800'"
                >
                  <svg class="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="13" r="8" />
                    <path d="M12 9v4l2 2M5 3 2 6M22 6l-3-3" />
                  </svg>
                  {{ shift.time }}
                </div>
              </li>
            </ul>
          </section>

          <section class="hidden rounded-lg border border-neutral-200 bg-white p-5 md:mt-[30px] md:block md:h-[187px] md:w-[513px]">
            <h2 class="mb-4 text-center text-[24px] font-medium leading-[1.4] text-neutral-900">Current Shift</h2>
            <div class="flex min-h-[3rem] items-center gap-4 px-6">
              <svg class="h-6 w-6 shrink-0 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span v-if="timePending" class="inline-block h-7 w-48 animate-pulse rounded bg-neutral-200"></span>
              <span v-else class="text-xl font-medium text-neutral-900">
                {{ !timeError && formattedTime ? formattedTime : 'No Shift Scheduled Today :(' }}
              </span>
            </div>
          </section>

          <button
            class="flex h-12 w-full items-center justify-center rounded-lg bg-[#E87500] text-sm font-medium text-white transition-colors duration-300 hover:bg-[#cf6800]
                   md:mt-[34px] md:h-[87px] md:w-[274px] md:self-center md:rounded-full md:text-[24px] md:leading-[1.4]"
            @click="openPopup"
          >
            {{ checkedIn ? 'Check out' : 'Check in' }}
          </button>
        </div>

        <div class="mt-6 md:mt-0">
          <div class="md:hidden">
            <h2 class="text-xl font-medium text-neutral-900">Attendance Progress</h2>
            <p class="text-xs text-neutral-500">Session: 02/03/2026 - 05/15/2026</p>
          </div>
          <div class="mt-3 md:mt-0">
            <CalendarSection />
          </div>
        </div>
      </div>
    </div>

    <PopupModals v-model="showPopup">
      <CheckInPinModal
        :show="showPopup"
        @cancel="closePopup"
        @click="closePopup"
      />
    </PopupModals>
  </div>
</template>


<script setup lang="ts">
interface Shift {
  shift: { clock_in_time: string; clock_out_time: string} | null
  clock_in_time: string | null
  clock_out_time: string | null
}

const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const formattedTime = computed(() => {
  const s = timeEntries.value
  
  if (!s?.clock_in_time || !s?.clock_out_time) { return null }

  const clock_in_time = new Date(s.clock_in_time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  const clock_out_time = new Date(s.clock_out_time).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  // will always return "no shift scheduled" because betterauth is not initiliazed
  // once betterauth is made, shift times will be different
  return `${clock_in_time} - ${clock_out_time}`
})

const internInfo = ref({ user_name: '', user_email: '', user_phone: '', location_ID: 1,})

const { data : intern, pending : internPending, error : internError, } = useFetch(`/api/intern`, { 
               method : 'POST',
               body: { internInfo }
             })

// placeholder for intern ID, because betterauth isn't implemented yet
const internID = "001" 

// no implementation for authorization, so a placeholder value for user_id is here
const  { data : timeEntries, pending : timePending, error : timeError, } = useFetch<Shift>(`/api/intern/time/${internID}`, {
               method : 'GET', 
             })


const upcomingShifts = ref([
  { date: '3/24/2026', time: '1:15pm → 6:45pm' },
  { date: '3/28/2026', time: '4:00pm → 8:00pm' },
])
             
const checkedIn = ref(false)
const actionType = ref<'checkin' | 'checkout'>('checkin')
const showPopup = ref(false)
const checkError = ref<string | null>(null)
const submitting = ref(false)

const openPopup = () => {
  actionType.value = checkedIn.value ? 'checkout' : 'checkin'
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
  checkError.value = null
}

async function handleClick() {
  if (!timeEntries.value) {
    return
  }

  submitting.value = true
  checkError.value = null

  const now = new Date().toLocaleDateString('en-US')

  let clockIn = null
  let clockOut = null

  if (actionType.value === 'checkin') {
    clockIn = now
  } else {
    clockIn = timeEntries.value.clock_in_time
    clockOut = now
  }

  try {
    await $fetch(`/api/intern/time/${internID}`, {
            method: 'POST',
            body: { shift_ID: timeEntries.value.shift, internID: internID, clock_in_time: clockIn, clock_out_time: clockOut }, 
          }) 
  
  await refreshShift()
  closePopup()
  } catch (err) {
    checkError.value = actionType.value === 'checkin' ? 'Check-in failed. Please try again.' : 'Check-out failed. Please try again.'
  } finally {
    submitting.value = false
  }
}

</script>
