<template>
  <div class="  max-w-[800px] mx-auto px-4 py-5 pt-10 bg-neutral-50">
    <h1 class="text-4xl mb-4 justify-self-start">Intern Home</h1>

    <div class=" pl-5 flex items center gap-8">  
      <AvatarComponent
        avatar-url="https://i.pravatar.cc/150?img=69"
        initials="JD"
        status="green"
        :checked-in="checkedIn"
      />
      <div class="pt-2 flex flex-col gap-2 "> 
        <div class="relative flex justify-center  w-[200px] h-[60px] rounded-xl bg-white text-neutral-900 text-xl items-center"> 
          <div class=" absolute bottom-0 -left-[7px] bg-white w-4 h-4 rounded-full"> </div>  
          {{ checkedIn ? 'not checked in' : 'checked in' }}        
        </div>
      </div>
    </div>
    
    <div class="pt-2 pl-5 flex items-center gap-2">
      <span class="text-[#525252] text-xl">Today</span>
      <div class="w-1 h-1 bg-neutral-300 rounded-full"></div>
      <span class="text-[#525252] text-xl">{{ formattedDate }}</span>
    </div>
    <div class="pl-5 text-5xl">
      11:00 AM - 12:30 PM
    </div>  

    <button 
  @click="handleClick"
  class="bg-[#E87500] ml-5 mr-6 text-white rounded-lg w-[590px] h-24 text-center flex items-center justify-center text-2xl mt-4 hover:bg-orange-300 transition-colors duration-300"
>
  {{ checkedIn ? 'not checked in' : 'checked in' }}
</button>
<PopupModals v-if="showPopup" 
  :type="actionType"
  @close="showPopup = false"
/>
    <div class="max-h-[90vh] w-full max-w-[320px] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:max-w-sm sm:rounded-3xl sm:p-6 md:max-w-md md:p-8">

      <p class="text-center pt-15 pl-5 text-[171717] text-xl">
        Enter 4-digit PIN to check in {{  actionType === 'checkin' ? 'or check out' : '' }}
      </p>

      <div class="relative mt-4 flex justify-center gap-2 sm:mt-5 sm:gap-3 md:mt-6 md:gap-4"
        
    </div>


    <div class="pt-15 pl-5 flex items-center text-nuetral-900 text-3xl gap-2">
      Attendence Progress
    </div>
    <div class="pl-5 ">
      Session: 02/03/2026 - 05/15/2026
    </div>

    <div class="flex justify-center gap-3 w-10 h-12 bg-[#FFFFFF] border border-[#E5E5E5] rounded-[4px] flex items-center justify-center text-[20px] font-[400] text-[#171717]"
      v-for="(digit, index) in 4"
      :key="index"
    ></div>

    <button 
      type="button"
      class="w-[271px] h-[48px] bg-[#E87500] rounded-[8px] text-white text-[14px] text-[#FFFFFF]"
    > 
      Check In
  </button>

      <!-- CALENDAR SECTION -->
      <CalendarSection class="mt-8"/>
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
