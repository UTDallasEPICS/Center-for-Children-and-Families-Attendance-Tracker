<template>
  <div class="mx-auto min-h-screen max-w-[800px] bg-neutral-50 px-4 pb-10 pt-6">
    <h1 class="mb-3 text-2xl font-medium text-neutral-900">Intern Home</h1>

    <!-- Avatar + speech bubble -->
    <div class="flex items-center gap-2">
      <AvatarComponent
        avatar-url="https://i.pravatar.cc/150?img=69"
        initials="JD"
        status="green"
        :checked-in="checkedIn"
      />
      <div
        class="relative flex h-10 items-center rounded-2xl bg-white px-4 text-xs text-neutral-900 shadow-sm"
      >
        <div class="absolute -left-[5px] bottom-0 h-3 w-3 rounded-full bg-white"></div>
        {{ checkedIn ? 'Checked in' : 'Not checked in' }}
      </div>
    </div>

    <!-- Date -->
    <div class="mt-4 flex items-center gap-1.5 text-sm text-neutral-600">
      <span class="font-medium text-neutral-900">Today</span>
      <span class="h-1 w-1 rounded-full bg-neutral-400"></span>
      <span>{{ formattedDate }}</span>
    </div>

    <!-- Shift time -->
    <div class="mt-1 text-[26px] font-medium text-neutral-900 sm:text-4xl">
      11:00 AM - 12:30 PM
    </div>

    <!-- Main button: opens the popup, no request yet -->
    <button
      class="mt-4 flex h-12 w-full items-center justify-center rounded-lg bg-[#E87500] text-sm font-medium text-white transition-colors duration-300 hover:bg-orange-600 sm:h-14 sm:text-base"
      @click="openPopup"
    >
      {{ checkedIn ? 'Check Out' : 'Check In' }}
    </button>

    <!-- PopupModals is the shell; the card design lives here -->
    <PopupModals v-if="showPopup" @close="closePopup">
      <div
        class="max-h-[90vh] w-full max-w-[320px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-w-sm sm:rounded-3xl sm:p-6 md:max-w-md md:p-8"
      >
        <p class="text-center text-sm text-neutral-900 sm:text-base md:text-lg">
          Enter 4-digit PIN to {{ actionType === 'checkin' ? 'check in' : 'check out' }}
        </p>

        <div class="mt-4 flex justify-center gap-2 sm:mt-5 sm:gap-3 md:mt-6 md:gap-4">
          <input
            v-for="(pin, index) in pins"
            :key="index"
            type="text"
            maxlength="1"
            class="h-12 w-12 rounded-lg border border-neutral-300 text-center text-lg font-medium text-neutral-900 focus:border-[#E87500] focus:ring focus:ring-[#E87500]/30 sm:h-14 sm:w-14 sm:text-xl md:h-16 md:w-16 md:text-2xl"
            v-model="pins[index]"
            @input="() => { if (pins[index] && index < pins.length - 1) focusBox(index + 1) }"
            @keydown.backspace="() => { if (!pins[index] && index > 0) focusBox(index - 1) }"
            ref="el => pinRefs[index] = el"
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

    <!-- Attendance -->
    <h2 class="mt-10 text-xl font-medium text-neutral-900">Attendance Progress</h2>
    <p class="text-xs text-neutral-500">Session: 02/03/2026 - 05/15/2026</p>

    <CalendarSection class="mt-3" />
  </div>
</template>


<script setup lang="ts">
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const route = useRoute()

// fetching intern email, number, and name data
const { data : intern, pending : internPending, error : internError, } = useFetch(`/api/intern`, { 
               method : 'POST',
               body : computed(() => ({id : route.params.id })), // need to implement body still
             })

// placeholder for intern ID, because betterauth isn't implemented yet
const internID = "001" 

// fetching intern clock in and clock out times
// no implementation for authorization, so a placeholder value for user_id is here
const  { data : timeEntries, pending : timePending, error : timeError, } = useFetch(`/api/intern/time/${internID}`, {
               method : 'GET', 
               query : computed(() => ({ id : route.params.id })),
             })
             
const checkedIn = ref(false)
const actionType = ref<'checkin' | 'checkout'>('checkin')
const showPopup = ref(false)
const checkError = ref<string | null>(null)
const submitting = ref(false)

const pins = ref<string[]>(['', '', '', ''])
const pinRefs = ref<HTMLInputElement[]>([])
const pinComplete = computed(() => pins.value.every((d) => d !== ''))

function focusBox(index : number) {
  pinRefs.value[index]?.focus() 
}


function openPopup() {
  actionType.value = checkedIn.value ? 'checkout' : 'checkin'
  checkError.value = null
  pins.value = [ '', '', '', '']
  showPopup.value = true
  nextTick(() => focusBox(0))
}

function closePopup() {
  showPopup.value = false
  checkError.value = null
  pins.value = [ '', '', '', '']
  checkError.value = null
}


async function handleClick() 
{
  const action = checkedIn.value ? 'checkout' : 'checkin'
  checkedIn.value = false 
  actionType.value = 'checkin' 
  checkError.value = null
  submitting.value = true

  try {
    await $fetch(`/api/intern/time/${internID}`, {
            method: 'POST',
            body: { action }, 
          }) 
  
  checkedIn.value = action === 'checkin'
  await refreshTimes()

  } catch {
    checkError.value = action === 'checkin' ? 'Check-in failed. Please try again.' : 'Check-out failed. Please try again.'
  } finally {
    submitting.value = false
  }

  showPopup.value = true
}



</script>
