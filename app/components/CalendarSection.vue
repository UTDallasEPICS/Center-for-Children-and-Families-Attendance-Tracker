<template>
  <div class="bg-[#e5e5e5] px-4 py-[22px] rounded-[20px] mt-6">
    <div class="max-w-[420px] mx-auto">
      <h3 class="font-bold mb-1 text-left">Attendance & Schedule</h3>
      <p class="text-left text-[#666] text-[13px] mb-3">View your attendance, upcoming work days, and request absences.</p>

      <div class="bg-white rounded-[20px] p-[10px_4px] shadow-[0_2px_5px_rgba(0,0,0,0.08)]">
        <div ref="calendarEl" class="min-h-[420px] overflow-visible"></div>
      </div>

      <!-- Legend -->
      <div class="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-green-400"></div>
          <span>Present</span>
        </div>
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded bg-blue-400"></div>
          <span>Upcoming Work Day</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue"
  import { Calendar } from "@fullcalendar/core"
  import dayGridPlugin from "@fullcalendar/daygrid"

  const calendarEl = ref<HTMLElement>()
  let calendar: Calendar | null = null

  // Sample data - in a real app, this would come from an API or store
  const presentDays = ref<string[]>(["2025-10-03", "2025-10-07", "2025-10-09", "2025-10-14", "2025-10-15"])

  const upcomingWorkDays = ref<string[]>(["2025-10-22", "2025-10-23", "2025-10-24"])

  function formatDateKey(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function getDayClass(date: Date): string[] {
    const dateKey = formatDateKey(date)
    const classes: string[] = []

    if (presentDays.value.includes(dateKey)) {
      classes.push("present-day")
    }

    if (upcomingWorkDays.value.includes(dateKey)) {
      classes.push("upcoming-work-day")
    }

    return classes
  }

  onMounted(() => {
    if (calendarEl.value) {
      calendar = new Calendar(calendarEl.value, {
        plugins: [dayGridPlugin],
        initialView: "dayGridMonth",
        headerToolbar: {
          left: "prev",
          center: "title",
          right: "next",
        },
        dayHeaderContent(info) {
          return info.date
            .toLocaleDateString("en-US", {
              weekday: "short",
            })
            .slice(0, 2)
        },
        dayCellClassNames(info) {
          return getDayClass(info.date)
        },
        contentHeight: "auto",
        fixedWeekCount: false,
      })

      calendar.render()

      // Add custom styles for colored days
      const style = document.createElement("style")
      style.id = "calendar-custom-styles"
      style.textContent = `
      .present-day .fc-daygrid-day-frame {
        background-color: #dcfce7 !important;
      }
      .present-day .fc-daygrid-day-number {
        color: #166534 !important;
        font-weight: 600 !important;
      }
      .upcoming-work-day .fc-daygrid-day-frame {
        background-color: #dbeafe !important;
      }
      .upcoming-work-day .fc-daygrid-day-number {
        color: #1e40af !important;
        font-weight: 600 !important;
      }
    `
      // Remove existing style if present
      const existingStyle = document.getElementById("calendar-custom-styles")
      if (existingStyle) {
        existingStyle.remove()
      }
      document.head.appendChild(style)
    }
  })

  onUnmounted(() => {
    // Clean up calendar instance
    if (calendar) {
      calendar.destroy()
      calendar = null
    }

    // Clean up custom styles
    const style = document.getElementById("calendar-custom-styles")
    if (style) {
      style.remove()
    }
  })
</script>
