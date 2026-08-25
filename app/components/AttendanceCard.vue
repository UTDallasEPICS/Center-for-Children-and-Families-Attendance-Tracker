<template>
  
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from "vue"

  const emit = defineEmits<{
    checkout: []
    showModal: []
    showPinModal: []
  }>()

  const STORAGE_KEY = "attendance_checkin_data"
  const status = ref<"not-checked" | "checked" | "checked-out">("not-checked")
  const checkInTimestamp = ref<number | null>(null)
  const checkinTime = ref<string>("")
  const elapsedTime = ref<string>("")
  let elapsedInterval: ReturnType<typeof setInterval> | null = null

  const formattedDate = ref("")

  const statusText = computed(() => {
    switch (status.value) {
      case "checked":
        return "Checked In"
      case "checked-out":
        return "Checked Out"
      default:
        return "Not Checked In"
    }
  })

  function updateLiveDate() {
    const now = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    formattedDate.value = now.toLocaleDateString("en-US", options)
  }

  function formatElapsed(ms: number): string {
    const totalSec = Math.floor(ms / 1000)
    const hours = Math.floor(totalSec / 3600)
    const minutes = Math.floor((totalSec % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  function getTodayDateString(): string {
    const now = new Date()
    return now.toDateString() // Returns format like "Mon Jan 01 2024"
  }

  function saveToLocalStorage() {
    if (typeof window === "undefined") return

    const data = {
      checkInTimestamp: checkInTimestamp.value,
      checkinTime: checkinTime.value,
      status: status.value,
      elapsedTime: elapsedTime.value,
      date: getTodayDateString(),
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  }

  function loadFromLocalStorage() {
    if (typeof window === "undefined") return null

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) return null

      const data = JSON.parse(stored)

      // Check if the stored data is from today
      if (data.date !== getTodayDateString()) {
        // Clear old data if it's from a different day
        localStorage.removeItem(STORAGE_KEY)
        return null
      }

      return data
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
      return null
    }
  }

  function startElapsedTimer() {
    if (!checkInTimestamp.value) return

    elapsedInterval = setInterval(() => {
      if (checkInTimestamp.value) {
        const diff = Date.now() - checkInTimestamp.value
        elapsedTime.value = `Elapsed: ${formatElapsed(diff)}`
      }
    }, 1000)
  }

  function handleCheckIn() {
    emit("showPinModal")
  }

  function processCheckIn() {
    checkInTimestamp.value = Date.now()

    const now = new Date()
    checkinTime.value = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    })

    status.value = "checked"
    startElapsedTimer()
    saveToLocalStorage()
  }

  function handleCheckOutClick() {
    emit("showModal")
  }

  function handleCheckout() {
    if (elapsedInterval) {
      clearInterval(elapsedInterval)
      elapsedInterval = null
    }

    if (checkInTimestamp.value) {
      const diff = Date.now() - checkInTimestamp.value
      elapsedTime.value = `Total Time Worked: ${formatElapsed(diff)}`
    }

    status.value = "checked-out"
    saveToLocalStorage()
    emit("checkout")
  }

  function restoreCheckInState() {
    const storedData = loadFromLocalStorage()

    if (storedData && storedData.status === "checked" && storedData.checkInTimestamp) {
      // Restore check-in state
      checkInTimestamp.value = storedData.checkInTimestamp
      checkinTime.value = storedData.checkinTime
      status.value = "checked"

      // Start the elapsed timer
      startElapsedTimer()
    } else if (storedData && storedData.status === "checked-out") {
      // Restore checked-out state
      status.value = "checked-out"
      if (storedData.checkInTimestamp) {
        checkInTimestamp.value = storedData.checkInTimestamp
        checkinTime.value = storedData.checkinTime

        // Restore the stored elapsed time if available, otherwise calculate it
        if (storedData.elapsedTime) {
          elapsedTime.value = storedData.elapsedTime
        } else if (storedData.checkInTimestamp) {
          // Fallback: calculate total time worked (though this shouldn't happen if we saved it)
          const diff = Date.now() - storedData.checkInTimestamp
          elapsedTime.value = `Total Time Worked: ${formatElapsed(diff)}`
        }
      }
    }
  }

  onMounted(() => {
    updateLiveDate()
    restoreCheckInState()
  })

  onUnmounted(() => {
    if (elapsedInterval) {
      clearInterval(elapsedInterval)
    }
  })

  // Expose functions to parent
  defineExpose({
    handleCheckout,
    processCheckIn,
  })
</script>
