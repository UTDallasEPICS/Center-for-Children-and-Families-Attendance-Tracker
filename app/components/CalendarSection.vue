<script setup lang="ts">
import { CalendarDate } from '@internationalized/date'
import { Dot } from 'lucide-vue-next'

interface Shift {
  datetime: string
  attendance_status: string | null
  clock_in_time: string
  clock_out_time: string | null
}

interface AttendanceResponse {
  attendance_history: {
    previous_shifts: Shift[]
    future_shifts: Shift[]
  }
}
const now = new Date()
const todayDate = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())

const modelValue = shallowRef(todayDate)
const placeholder = shallowRef(todayDate)


//user id needs to passed from the better auth
//so using this as a temp user info for now
const userID = 'intern-seed-001'

const { data: attendanceData, error, status } = await useFetch<AttendanceResponse>(
  () => `/api/intern/schedule/${userID}`
)

const allShifts = computed(() => {
  const history = attendanceData.value.attendance_history
  return [...history.previous_shifts, ...history.future_shifts]
})

const shiftCount = computed(() => {
  const shifts = allShifts.value

  return {
    present: shifts.filter(s => s.attendance_status === 'present').length,
    absent: shifts.filter(s => s.attendance_status === 'absent').length,
    late: shifts.filter(s => s.attendance_status === 'late').length,
    pending: shifts.filter(s => s.attendance_status === null).length,
    total: shifts.length
  }
})

function formatTime(datetime: string) {
  return new Date(datetime).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const selectedDayWorkTime = computed(() => {
  const selectedDate = modelValue.value.toString()

  return allShifts.value
    .filter((shift) => shift.datetime.substring(0, 10) === selectedDate)
    .map((shift) => {
      const clockIn = new Date(shift.clock_in_time)
      const clockOut = shift.clock_out_time ? new Date(shift.clock_out_time) : null

      let duration = ''

      if (
        shift.attendance_status !== 'absent' &&
        clockOut &&
        !isNaN(clockIn.getTime()) &&
        !isNaN(clockOut.getTime()) &&
        clockOut >= clockIn
      ) {
        const totalMinutes = Math.floor(
          (clockOut.getTime() - clockIn.getTime()) / 60000
        )
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60
        duration = `${hours}h ${minutes}m`
      }

      return {
        clockIn: formatTime(shift.clock_in_time),
        clockOut: shift.clock_out_time ? formatTime(shift.clock_out_time) : null,
        duration,
        status: shift.attendance_status
      }
    })
})

function getColorByDate(date: Date) {
  const shift = allShifts.value.find((s) => {
    const shiftDate = new Date(s.datetime)
    return (
      shiftDate.getUTCFullYear() === date.getUTCFullYear() &&
      shiftDate.getUTCMonth() === date.getUTCMonth() &&
      shiftDate.getUTCDate() === date.getUTCDate()
    )
  })

  if (!shift) return undefined

  switch (shift.attendance_status) {
    case 'present':
      return 'success'
    case 'absent':
      return 'error'
    case 'late':
      return 'warning'
    default:
      return undefined
  }
}
</script>

<template>
  <div class="w-[340px] h-[491px] sm:w-[364px] sm:h-[466px] xl:w-[733px] xl:h-[700px] border rounded-lg drop-shadow-md">
    
    <div class="w-[340px] h-[108px] sm:w-[364px] sm:h-[92px] xl:mt-[16px] xl:w-[733px] xl:h-[124px] xl:text-[28px] flex flex-col justify-center pr-[14px] mt-[16px]">
      <div class="flex items-center justify-between">
        <span class="flex items-center">
          <Dot :size="36" class="text-[var(--color-success)]" />
          Good
        </span>
        <span class="text-[var(--color-success)]">{{ shiftCount.present }}</span>
      </div>

      <div class="flex items-center justify-between">
        <span class="flex items-center">
          <Dot :size="36" class="text-[var(--color-warning)]" />
          Late
        </span>
        <span class="text-[var(--color-warning)]">{{ shiftCount.late }}</span>
      </div>

      <div class="flex items-center justify-between mb-[16px]">
        <span class="flex items-center">
          <Dot :size="36" class="text-[var(--color-error)]" />
          Absent
        </span>
        <span class="text-[var(--color-error)]">{{ shiftCount.absent }}</span>
      </div>
    </div>

    <USeparator class="my-1" />

    <UCalendar
      v-model="modelValue"
      v-model:placeholder="placeholder"
      :year-controls="false"
      :month-controls="false"
      :view-control="false"
      weekday-format="short"
      variant="outline"
      :ui="{
        header: 'flex items-center justify-between [&>button]:hidden ',
        heading: 'mr-auto',
        cell: 'h-[40px] xl:h-[70px]',
        cellTrigger: [
          '[&>div>span]:text-[16px] xl:[&>div>span]:text-[28px]',
          'hover:not-data-selected:bg-[var(--color-warning)]',
          'data-selected:hover:!bg-transparent',
          'data-[selected]:!ring-[var(--color-brand-orange)]',
          'data-selected:!text-[var(--color-brand-orange)]',
        ],
      }"
    >
      <template #heading="{ value, date, setPlaceholder }">
        <div class="flex md:text-[18px] xl:text-[24px] h-[33px] xl:h-[44px] w-full items-center justify-between pl-[8px] xl:pt-[20px] text-[16px] font-bold">
          <span>{{ value }}</span>

          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-chevron-left"
              color="neutral"
              variant="ghost"
              size="xl"
              aria-label="Previous month"
              @click.stop="setPlaceholder(date.add({ months: -1 }))"
            />

            <UButton
              icon="i-lucide-chevron-right"
              color="neutral"
              variant="ghost"
              size="xl"
              aria-label="Next month"
              @click.stop="setPlaceholder(date.add({ months: 1 }))"
            />
          </div>
        </div>
      </template>

      <template #week-day="{ day }">
        <span class="flex h-[20px] justify-center items-center pt-[10px] sm:text-[16px] font-normal text-[var(--color-text-sub-light)]">
          {{ day }}
        </span>
      </template>

      <template #day="{ day }">
        <UChip
          position="top-right"
          :class="[
                    'text-[var(--color-text-main)]',
                    { 'opacity-40': day.month !== placeholder.month }
                  ]"    
          :show="!!getColorByDate(day.toDate('UTC'))"
          :color="getColorByDate(day.toDate('UTC'))"
          size="md"
        >
          <span>{{ day.day }}</span>
        </UChip>
      </template>
    </UCalendar>

    <USeparator class="mt-1" />

    <div>
      <template v-if="selectedDayWorkTime.length">
        <div
          v-for="(shift, index) in selectedDayWorkTime"
          :key="index"
          class="flex flex-wrap items-center justify-between  py-1"
        >
          <div>
            <p class="flex items-center text-sm xl:text-[22px] ">
              <Dot :size="24" />
              <span>{{ shift.clockIn }} – {{ shift.clockOut ?? 'In progress' }}</span>
            </p>
          </div>

          <span class="text-sm xl:text-[22px] pr-[10px]">
            {{ shift.duration }}
          </span>
        </div>
      </template>

      <p v-else class="text-sm text-gray-500 p-2">
        No shift
      </p>
    </div>

  </div>
</template>