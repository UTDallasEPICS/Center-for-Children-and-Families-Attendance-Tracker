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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

interface AttendanceCardInstance extends ComponentPublicInstance {
  handleCheckout: () => void
}

const showCheckoutModal = ref(false)
const attendanceCardRef = ref<AttendanceCardInstance | null>(null)

const handleCheckout = () => {
  if (attendanceCardRef.value) {
    attendanceCardRef.value.handleCheckout()
  }
  showCheckoutModal.value = false
}
</script>

