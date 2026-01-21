<template>
  <div class="max-w-[480px] mx-auto px-4 py-5 mt-[calc(65px+env(safe-area-inset-top))]">
    <!-- WELCOME SECTION -->
    <section>
      <p class="text-center text-black font-bold mb-2.5">
        Welcome back! Mark your attendance and view your record.
      </p>

      <AttendanceCard 
        ref="attendanceCardRef"
        @show-modal="showCheckoutModal = true"
        @show-pin-modal="showCheckInPinModal = true"
      />

      <!-- CALENDAR SECTION -->
      <CalendarSection />
    </section>
  </div>

  <!-- CHECK OUT CONFIRMATION MODAL -->
  <CheckoutModal 
    :show="showCheckoutModal"
    @confirm="handleCheckout"
    @cancel="showCheckoutModal = false"
  />

  <!-- CHECK IN PIN MODAL -->
  <CheckInPinModal 
    :show="showCheckInPinModal"
    @confirm="handleCheckInPin"
    @cancel="showCheckInPinModal = false"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface AttendanceCardInstance extends ComponentPublicInstance {
  handleCheckout: () => void
  processCheckIn: () => void
}

const showCheckoutModal = ref(false)
const showCheckInPinModal = ref(false)
const attendanceCardRef = ref<AttendanceCardInstance | null>(null)

const handleCheckout = () => {
  if (attendanceCardRef.value) {
    attendanceCardRef.value.handleCheckout()
  }
  showCheckoutModal.value = false
}

const handleCheckInPin = (pin: string) => {
  // Here you can add PIN validation logic if needed
  // For now, we'll just proceed with check-in after PIN is entered
  if (attendanceCardRef.value) {
    attendanceCardRef.value.processCheckIn()
  }
  showCheckInPinModal.value = false
}
</script>

