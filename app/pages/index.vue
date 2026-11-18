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

    <PopupModals v-if="showPopup" @close="closePopup">
      <div
        class="max-h-[90vh] w-full max-w-[320px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-w-sm sm:rounded-3xl sm:p-6 md:max-w-md md:p-8"
      >
        <p class="text-center text-sm text-neutral-900 sm:text-base md:text-lg">
          Enter 4-digit PIN to {{ actionType === 'checkin' ? 'check in' : 'check out' }}
        </p>

        <div class="mt-4 flex justify-center gap-2 sm:mt-5 sm:gap-3 md:mt-6 md:gap-4">
          <input class="h-12 w-12 rounded-lg border border-neutral-300 text-center text-lg font-medium text-neutral-900 focus:border-[#E87500] focus:ring focus:ring-[#E87500]/30 sm:h-14 sm:w-14 sm:text-xl md:h-16 md:w-16 md:text-2xl"
            v-for="(_, index) in 4"
            :key="index"
            :id="'pin-' + index"
            type="text"
            maxlength="1"
            autocomplete="off"
            v-model="pins[index]"
            @input="handleInput(index)"
            @keydown.backspace="handleBackspace(index)"
          />
        </div>

        <p v-if="checkError" class="mt-3 text-center text-xs text-red-600 sm:text-sm">
          {{ checkError }}
        </p>

        <button
          type="button"
          :disabled="submitting || !pinComplete"
          class="mt-5 h-12 w-full rounded-lg bg-[#E87500] text-sm font-medium text-white disabled:opacity-50 sm:mt-6 md:h-14 md:text-base"
          @click="handleClick"
        >
          {{ submitting ? 'Submitting...' : actionType === 'checkin' ? 'Check In' : 'Check Out' }}
        </button>
      </div>
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
             })

// placeholder for intern ID, because betterauth isn't implemented yet
const internID = "001" 

// no implementation for authorization, so a placeholder value for user_id is here
const  { data : timeEntries, pending : timePending, error : timeError, } = useFetch<any>(`/api/intern/time/${internID}`, {
               method : 'GET', 
             })
             
const checkedIn = ref(false)
const actionType = ref<'checkin' | 'checkout'>('checkin')
const showPopup = ref(false)
const checkError = ref<string | null>(null)
const submitting = ref(false)

const pins = ref<string[]>(['', '', '', ''])
const pinComplete = computed(() => pins.value.every((d) => d !== ''))

function openPopup() {
  actionType.value = checkedIn.value ? 'checkout' : 'checkin'
  checkError.value = null
  pins.value = [ '', '', '', '']
  showPopup.value = true
  console.log('showPopup:', showPopup.value)
  
  nextTick(() => { document.getElementById('pin-0')?.focus() })
}

function closePopup() {
  showPopup.value = false
  checkError.value = null
  pins.value = [ '', '', '', '']
  checkError.value = null
}

function handleInput(index: number) {
  pins.value[index] = (pins.value[index] ?? '').replace(/\D/g, '') 

  if (pins.value[index] && index < 3) {
    document.getElementById('pin-' + (index + 1))?.focus()
  }
}

function handleBackspace(index: number) {
  if (!pins.value[index] && index > 0) {
    document.getElementById('pin-' + (index - 1))?.focus()
  }
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
