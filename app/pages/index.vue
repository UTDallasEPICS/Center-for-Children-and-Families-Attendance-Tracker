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

    <div class="pt-15 pl-5 flex items-center text-nuetral-900 text-3xl gap-2">
      Attendence Progress
    </div>
    <div class="pl-5 ">
      Session: 02/03/2026 - 05/15/2026
    </div>

    // Digit boxes for PIN
    <div class="flex justify-center gap-3 w-10 h-12 bg-[#FFFFFF] border border-[#E5E5E5] rounded-[4px] flex items-center justify-center text-[20px] font-[400] text-[#171717]"
      v-for="(digit, index) in 4"
      :key="index"
    ></div>

    // Text instruction for popup
    <div class="flex flex-col items-center">
      <h1 class="pt-15 pl-5 flex items-center text-[171717] text-xl gap-2">
      Enter 4-digit PIN to check in
      </h1>
    </div>

    // Check in button
    <button 
      type="button"
      class="w-[271px] h-[48px] bg-[#E87500] rounded-[8px] text-white text-[14px] text-[#FFFFFF]"
    > 
      Check In
  </button>

      <!-- CALENDAR SECTION -->
      <CalendarSection />
      
    </section>
  </div>

</template>


// remember to fix format + apis (intern->time)
<script setup lang="ts">
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const route = useRoute()

const // fetching intern email, number, and name data
{
  data : intern,
  pending : internPending,
  error : internError,
} = useFetch(`/api/intern`, // useFetch because it's something that's done immediately when hosting a server
             { 
               method : 'POST', // the post file is what contains the data, so the method must be POST
               body : computed(() => ({id : route.params.id })),
             })

const  // fetching intern clock in and clock out times
{
  data : timeEntries,
  pending : timePending,
  error : timeError,
} = useFetch(`/api/intern/schedule/001`, // no implementation for authorization, so a placeholder value for user_id is here
             {
               method : 'GET', // the method is GET because it is get
               query : computed(() => ({ id : route.params.id })),
             })
             
const checkedIn = ref(false)
const actionType = ref<'checkin' | 'checkout'>('checkin')
const showPopup = ref(false)
const checkError = ref<string>(null)

function handleClick() // function for updating the checked in option
{
  checkedIn.value = false // starts off as not checked in
  actionType = 'checkin' // needs to check in at base

  try 
  {
    $fetch(`/api/intern/002`, // fetches update api to update status
          {
            method: 'PUT' // PUT because it's updating the entire clocked in
          }) 
  } catch(err : any) 
  {

    checkError.value = 'Could not check in.' // throws an error
  } finally 
  {

    checkedIn.value = true // is checked in
    actionType = 'checkout' // once checked in, the only option is to check out
  }

  showPopup.value = true
}



const handleClick = () => {
  console.log('clicked')
  console.log('checkedIn:', checkedIn.value)

  if (checkedIn.value) {
    console.log('Entering checkout branch')
    checkedIn.value = false
  } else {
    console.log('Entering checkin branch')
    checkedIn.value = true
  }

  showPopup.value = true
}

</script>
