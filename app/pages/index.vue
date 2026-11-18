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

    <div class="mt-4 flex items-center gap-1.5 text-sm text-neutral-600">
      <span class="font-medium text-neutral-900">Today</span>
      <span class="h-1 w-1 rounded-full bg-neutral-400"></span>
      <span>{{ formattedDate }}</span>
    </div>

    <div class="mt-1 text-[26px] font-medium text-neutral-900 sm:text-4xl">
      11:00 AM - 12:30 PM
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
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})



const { data : intern, pending : internPending, error : internError, } = useFetch(`/api/intern`, { 
               method : 'POST',
               body: { }
             })

// placeholder for intern ID, because betterauth isn't implemented yet
const internID = "001" 

// no implementation for authorization, so a placeholder value for user_id is here
const  { data : timeEntries, pending : timePending, error : timeError, } = useFetch<any>(`/api/intern/time/${internID}`, {
               method : 'GET', 
               body: { }
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

async function handleClick() 
{
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
            body: { shift_ID: timeEntries.value.shift_ID, internID: internID, clock_in_time: clockIn, clock_out_time: clockOut }, 
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
