<template>
  <div class="  max-w-[800px] mx-auto px-4 py-5 pt-10 bg-neutral-50">
    <h1 class="text-4xl mb-4 justify-self-start">Intern Home</h1>

    <div class=" pl-5 flex items center gap-8">  
      <AvatarComponent
        avatar-url="https://i.pravatar.cc/150?img=69"
        initials="JD"
        status="green"
        :checked-in="true"
      />
      <div class="pt-2 flex flex-col gap-2 "> 
        <div class="relative flex justify-center  w-[200px] h-[60px] rounded-xl bg-white text-neutral-900 text-xl items-center"> 
          <div class=" absolute bottom-0 -left-[7px] bg-white w-4 h-4 rounded-full"> </div>  
          checked in 
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
    class="bg-[#E87500] ml-5 mr-6 text-white rounded-lg w-[590px] h-24 text-center flex items-center justify-center text-2xl mt-4 hover:bg-neutral-200 transition-colors duration-300">
        checked in
    </button>

    <div class="pt-15 pl-5 flex items-center text-nuetral-900 text-3xl gap-2">
      Attendence Progress
    </div>
    <div class="pl-5 ">
      Session: 02/03/2026 - 05/15/2026
    </div>


    <section class="flex items-center justify-center min-h-screen">

      <!-- CALENDAR SECTION -->
      <CalendarSection />
      
    </section>
  </div>

</template>

<script setup lang="ts">
const formattedDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

const handleClick = () => {
  // decide what action we're about to confirm
 console.log('clicked')
  if (checkedIn.value) {
    actionType.value = 'checkout'
  } else {
    actionType.value = 'checkin'
  }
  showPopup.value = true
}

</script>
