<template>
  <div class="mx-auto min-h-screen max-w-[800px] bg-neutral-50 px-4 pb-10 pt-6">
    <h1 class="mb-3 text-2xl font-medium text-neutral-900">Intern Home</h1>

    <div class="flex items-center gap-2">
      <AvatarComponent
        avatar-url="https://i.pravatar.cc/150?img=69"
        initials="JD"
        status="green"
        :checked-in="checkedIn"
      />
      <div
        class="relative flex h-10 items-center rounded-2xl bg-white px-4 text-xs text-neutral-900 shadow-sm">
        <div class="absolute -left-[5px] bottom-0 h-3 w-3 rounded-full bg-white"></div>
        {{ checkedIn ? 'Checked in' : 'Not checked in' }}
      </div>
    </div>

    <div v-if="timePending" class="mt-4 space-y-2">
      <div class="h-4 w-40 animate-pulse rounded bg-neutral-200"></div>
      <div class="h-9 w-64 animate-pulse rounded bg-neutral-200"></div>
    </div>

    <p v-else-if="shiftTime" class="mt-4 text-sm text-neutral-500">
      No Shift Scheduled Today
    </p>"

    <div class="mt-4 flex items-center gap-1.5 text-sm text-neutral-600"> 
      <span class="font-medium text-neutral-900"> {{ isToday ? 'Today' : 'Next shift' }}</span>
      <span class="h-1 w-1 rounded-full bg-neutral-400"></span>
      <span>{{  formattedDate }}</span>
    </div>

    <div class=""mt-1 text-[26px] font-medium text-neutral-900 sm:text-4x1>
      {{ shiftTime }}
    </div>

    <button
      class="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-[#E87500] text-sm font-medium text-white hover:bg-[#E5E5E5] transition-colors duration-300 sm:h-14 sm:text-base"
      @click="openPopup"
    >
      {{ checkedIn ? 'Check Out' : 'Check In' }}
    </button>

    <PopupModals v-model="showPopup">
      <CheckInPinModal
        :show="showPopup"
        @cancel="closePopup"
        @click="closePopup"
      />
     </PopupModals>
    

    <h2 class="mt-10 text-xl font-medium text-neutral-900">Attendance Progress</h2>
    <p class="text-xs text-neutral-500">Session: 02/03/2026 - 05/15/2026</p>

    <!-- CALENDAR SECTION -->
    <CalendarSection class="mt-3" />
  </div>
</template>


<script setup lang="ts">
const formattedDate = new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const formattedTime = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
})

const internInfo = ref({ user_name: '', user_email: '', user_phone: '', location_ID: 1,})

const { data : intern, pending : internPending, error : internError, } = useFetch(`/api/intern`, { 
               method : 'POST',
               body: { internInfo }
             })

// placeholder for intern ID, because betterauth isn't implemented yet
const internID = ref('001') 

interface Shift {
  shift: { clock_in_time: string | null, clock_out_time: string } | null
  shift_ID: string
  clock_in_time: string | null
  clock_out_time: string | null
}

// no implementation for authorization, so a placeholder value for user_id is here
const  { data : timeEntries, pending : timePending, error : timeError, } = useFetch<Shift>(`/api/intern/time/${internID.value}`, {
               method : 'GET', 
             })

const shiftTime = computed(() => {
  const s = timeEntries.value
  if (!s?.clock_in_time || !s?.clock_out_time) { return null }
  return `${formattedTime.format(new Date(s.clock_in_time))} - ${formattedTime.format(new Date(s.clock_out_time))}`
})

const dateFormat = computed(() =>  
  timeEntries.value?.clock_in_time ? formattedDate.format(new Date(timeEntries.value.clock_in_time)) : ''
)

const isToday = computed(() => {
  const s = timeEntries.value?.clock_in_time
  return s ? new Date(s).toDateString() === new Date().toDateString() : false
})
             
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
    await $fetch(`/api/intern/time/${internID.value}`, {
            method: 'POST',
            body: { shift_ID: timeEntries.value.shift_ID, internID: internID.value, clock_in_time: clockIn, clock_out_time: clockOut }, 
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
