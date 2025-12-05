<template>
  <Toaster position="top-right" richColors />
  <div class="flex flex-col min-h-screen bg-[#f8f9fb]">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10 shadow-sm">
      <div class="flex items-center justify-center mb-2">
        <img :src="logoImage" alt="Center for Children and Families" class="h-12" />
      </div>
      <h1 class="text-center font-semibold text-2xl bg-gradient-to-r from-[#e87500] via-[#226644] to-[#7fdac0] bg-clip-text text-transparent tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)] mt-3">
        Site Manager Overview
      </h1>
      <div class="flex justify-center mt-1">
        <div class="relative w-[200px]">
          <Select v-model="selectedSite">
            <SelectTrigger
              class="w-full h-10 rounded-md border border-slate-300 bg-white px-3 text-left text-sm text-slate-900 shadow-sm flex items-center justify-between gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-1"
            >
              <SelectValue placeholder="Choose site" class="truncate" />
            </SelectTrigger>

            <SelectContent
              class="z-50 w-[200px] rounded-b-md rounded-t-none border border-slate-200 bg-white shadow-lg"
            >
              <SelectItem
                value="north"
                class="text-sm py-2.5 px-3 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
              >
                North Campus Site
              </SelectItem>
              <SelectItem
                value="south"
                class="text-sm py-2.5 px-3 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
              >
                South Campus Site
              </SelectItem>
              <SelectItem
                value="east"
                class="text-sm py-2.5 px-3 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
              >
                East Campus Site
              </SelectItem>
              <SelectItem
                value="west"
                class="text-sm py-2.5 px-3 data-[highlighted]:bg-emerald-50 data-[highlighted]:text-emerald-700"
              >
                West Campus Site
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <!-- Date and Stats Summary -->
    <div class="bg-white border-b border-gray-200 px-4 py-3">
      <div class="flex items-center justify-between mb-3">
          <!-- Date Picker Button -->
          <button 
            @click="showCalendarModal = true"
            class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <CalendarIcon class="size-4 text-gray-500" />
            <span>{{ formattedCurrentDate }}</span>
            <ChevronDownIcon class="size-3 text-gray-400" />
          </button>

          <!-- Manual Calendar Modal -->
          <!-- Manual Calendar Modal -->
          <!-- Manual Calendar Modal -->
          <div v-if="showCalendarModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm" @click="showCalendarModal = false">
            <div 
              @click.stop 
              class="bg-white w-full rounded-t-2xl sm:rounded-xl p-4 sm:p-6 shadow-2xl sm:max-w-md animate-in slide-in-from-bottom duration-300 sm:duration-200 sm:fade-in sm:zoom-in-95"
            >
              <!-- Grab Handle (Mobile Only) -->
              <div class="mx-auto mt-2 h-1.5 w-10 rounded-full bg-slate-300 sm:hidden" />

              <!-- Modal Header -->
              <div class="flex items-center justify-between mt-2 mb-4">
                <h3 class="text-base font-medium text-gray-900">Select Date</h3>
                <button 
                  @click="showCalendarModal = false" 
                  class="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XIcon class="size-5" />
                </button>
              </div>

              <!-- Calendar -->
              <div class="flex justify-center">
                <Calendar
                  v-model="selectedDate"
                  mode="single"
                  class="p-0 border-none w-full max-w-[340px] [&_[data-radix-vue-calendar-day]]:h-10 [&_[data-radix-vue-calendar-day]]:w-10 [&_[data-radix-vue-calendar-day]]:p-0 [&_[data-radix-vue-calendar-day]]:rounded-full [&_[data-radix-vue-calendar-day]]:leading-none [&_[data-radix-vue-calendar-day]]:text-sm [&_[data-radix-vue-calendar-day]]:font-medium [&_[data-radix-vue-calendar-day][data-state=selected]]:bg-emerald-600 [&_[data-radix-vue-calendar-day][data-state=selected]]:text-white [&_[data-radix-vue-calendar-day][data-today]]:border [&_[data-radix-vue-calendar-day][data-today]]:border-emerald-600 [&_[data-radix-vue-calendar-day][data-today]]:text-emerald-700"
                  @update:model-value="showCalendarModal = false"
                >
                  <template #header>
                    <CalendarHeader class="flex w-full items-center justify-between mb-3">
                      <CalendarPrevButton class="h-8 w-8 rounded-full border border-slate-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center" />

                      <div class="flex flex-col items-center gap-1">
                        <CalendarHeading class="text-base font-semibold text-gray-900" />
                        <button
                          type="button"
                          class="text-xs font-medium text-emerald-700 hover:underline"
                          @click="selectedDate = today(getLocalTimeZone())"
                        >
                          Jump to today
                        </button>
                      </div>

                      <CalendarNextButton class="h-8 w-8 rounded-full border border-slate-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center" />
                    </CalendarHeader>
                  </template>
                </Calendar>
              </div>
            </div>
          </div>
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <ClockIcon class="size-4" />
          <span>{{ currentTime }}</span>
        </div>
      </div>

      <!-- Daily Check-In Code Button -->
      <div class="mb-3">
        <button
          @click="showCodeModal = true"
          class="w-full bg-[#226644] hover:bg-[#1a5034] text-white h-10 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <ShieldIcon class="size-4" />
          Show Daily Check-In Code
        </button>
      </div>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-4 gap-2">
        <div class="bg-green-50 rounded-lg p-2 text-center">
          <div class="text-green-700">{{ presentCount }}</div>
          <div class="text-xs text-green-600">Present</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-2 text-center">
          <div class="text-orange-700">{{ lateCount }}</div>
          <div class="text-xs text-orange-600">Late</div>
        </div>
        <div class="bg-blue-50 rounded-lg p-2 text-center">
          <div class="text-blue-700">{{ calledOffCount }}</div>
          <div class="text-xs text-blue-600">Called Off</div>
        </div>
        <div class="bg-gray-50 rounded-lg p-2 text-center">
          <div class="text-gray-700">{{ absentCount }}</div>
          <div class="text-xs text-gray-600">Absent</div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <div class="px-4 py-3 bg-white border-b border-gray-200">
        <!-- Search Bar -->
        <div class="relative mb-3">
          <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workers..."
            v-model="searchQuery"
            class="w-full pl-9 bg-gray-50 border-gray-200 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Status Filter -->
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-1">
            <FilterIcon class="size-4 text-gray-500" />
            <div class="relative flex-1">
              <select 
                v-model="statusFilter" 
                class="w-full h-9 bg-gray-50 border-gray-200 rounded-md border px-3 text-sm appearance-none cursor-pointer"
              >
                <option value="all">All Workers</option>
                <option value="present">Present Only</option>
                <option value="late">Late Only</option>
                <option value="called-off">Called Off Only</option>
                <option value="absent">Absent Only</option>
              </select>
              <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          
          <!-- Worker Count Indicator -->
          <div class="text-xs text-gray-600 tabular-nums">
            <span v-if="statusFilter !== 'all' || searchQuery">
              <span class="text-gray-900">{{ filteredWorkers.length }}</span>
              <span class="text-gray-400 mx-0.5">/</span>
              <span>{{ workers?.length || 0 }}</span>
            </span>
            <span v-else class="text-gray-900">{{ workers?.length || 0 }} workers</span>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto">
        <div class="px-4 py-2 space-y-1">
          <div 
            v-for="worker in filteredWorkers" 
            :key="worker.id" 
            class="bg-white rounded border border-gray-200 overflow-hidden"
          >
            <!-- Compact Worker Row -->
            <button
              @click="toggleWorker(worker.id)"
              class="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2 flex-1 min-w-0">
                  <!-- Status Indicator Dot -->
                  <div :class="['size-2 rounded-full flex-shrink-0', getStatusConfig(worker.status).color]"></div>
                  
                  <!-- Name -->
                  <span class="text-sm truncate">{{ worker.name }}</span>
                  
                  <!-- Late Alert -->
                  <span v-if="worker.status === 'late'" class="inline-flex items-center rounded-md border border-transparent bg-destructive text-white px-1 py-0 text-xs font-medium h-4">!</span>
                </div>

                <div class="flex items-center gap-2 flex-shrink-0">
                  <!-- Check-in Time or Status Info -->
                  <span v-if="worker.checkIn" class="text-xs text-gray-600">{{ worker.checkIn }}</span>
                  <span v-else :class="['inline-flex items-center justify-center rounded-md border px-1.5 py-0 text-xs font-medium h-5', getBadgeClasses(getStatusConfig(worker.status).variant)]">
                    {{ getStatusConfig(worker.status).label }}
                  </span>
                  
                  <!-- Expand Chevron -->
                  <ChevronRightIcon :class="['size-4 text-gray-400 transition-transform', selectedWorker === worker.id ? 'rotate-90' : '']" />
                </div>
              </div>
            </button>

            <!-- Expanded Details -->
            <div v-if="selectedWorker === worker.id" class="border-t border-gray-200 bg-gray-50 px-3 py-3 space-y-3">
              <!-- Worker Info Header -->
              <div class="flex items-start justify-between pb-2 border-b border-gray-200">
                <div>
                  <h4 class="text-sm">{{ worker.name }}</h4>
                  <p class="text-xs text-gray-500">{{ worker.role }}</p>
                </div>
                <span :class="['inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium', getBadgeClasses(getStatusConfig(worker.status).variant)]">
                  {{ getStatusConfig(worker.status).label }}
                </span>
              </div>

              <!-- Status-specific Info -->
              <div v-if="worker.checkIn" class="flex items-center gap-2 text-sm bg-white rounded px-2 py-1.5">
                <ClockIcon class="size-3.5 text-gray-500" />
                <span class="text-gray-600">Checked in at {{ worker.checkIn }}</span>
              </div>
              
              <div v-if="worker.status === 'called-off' && worker.callOffReason" class="flex items-start gap-2 text-sm bg-blue-50 rounded px-2 py-1.5">
                <span class="text-blue-700">Reason: {{ worker.callOffReason }}</span>
              </div>

              <!-- Contact Information -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <MailIcon class="size-3.5 text-gray-500 flex-shrink-0" />
                  <a :href="`mailto:${worker.email}`" class="text-xs text-blue-600 break-all">
                    {{ worker.email }}
                  </a>
                </div>
                
                <div class="flex items-center gap-2">
                  <PhoneIcon class="size-3.5 text-gray-500 flex-shrink-0" />
                  <a :href="`tel:${worker.phone}`" class="text-xs text-blue-600">
                    {{ worker.phone }}
                  </a>
                </div>

                <div v-if="worker.office" class="flex items-center gap-2">
                  <MapPinIcon class="size-3.5 text-gray-500 flex-shrink-0" />
                  <span class="text-xs text-gray-700">{{ worker.office }}</span>
                </div>
              </div>

              <!-- Attendance Rate -->
              <div class="pt-2 border-t border-gray-200">
                <div class="flex items-center justify-between mb-1.5">
                  <span class="text-xs text-gray-600">Attendance Rate</span>
                  <span :class="['text-xs', worker.attendanceRate >= 90 ? 'text-green-600' : 'text-orange-600']">
                    {{ worker.attendanceRate }}%
                  </span>
                </div>
                <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    :class="['h-full rounded-full', worker.attendanceRate >= 90 ? 'bg-green-500' : 'bg-orange-500']"
                    :style="{ width: `${worker.attendanceRate}%` }"
                  ></div>
                </div>
              </div>

              <!-- View Attendance History Button -->
              <div class="pt-2">
                <button
                  @click.stop="handleViewHistory(worker.id)"
                  class="w-full text-xs h-8 gap-2 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 hover:bg-gray-50 transition-colors font-medium"
                >
                  <FileTextIcon class="size-3.5" />
                  View Attendance History
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredWorkers.length === 0" class="text-center py-12 text-gray-500">
            <p class="text-sm">No workers found matching your search.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Check-In Code Display Modal -->
    <div v-if="showCodeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="showCodeModal = false">
      <div @click.stop class="bg-[#226644] rounded-lg shadow-xl max-w-sm w-full mx-4 overflow-hidden">
        <div class="px-8 py-12 text-center">
          <div class="mb-8">
            <div class="bg-white rounded-full size-20 mx-auto mb-4 flex items-center justify-center">
              <ShieldIcon class="size-10 text-[#226644]" />
            </div>
            <h3 class="text-white text-lg">Daily Check-In Code</h3>
          </div>
          
          <div class="mb-10">
            <div class="font-mono text-white flex justify-center gap-4" style="font-size: 5rem; line-height: 1; font-weight: 300;">
              <span v-for="(digit, index) in dailyCode.split('')" :key="index">{{ digit }}</span>
            </div>
          </div>

          <p class="text-white/90 text-sm mb-8 px-4">
            Interns must enter this code to check in
          </p>

          <div class="flex gap-3">
            <button
              @click="showCodeModal = false"
              class="flex-1 bg-white text-[#226644] hover:bg-gray-100 shadow-lg h-11 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              @click="handleRegenerateCode"
              class="bg-[#e87500] text-white hover:bg-[#d66a00] h-11 w-11 p-0 rounded-md transition-colors flex items-center justify-center"
            >
              <RefreshCwIcon class="size-5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance History Modal -->
    <div v-if="historyModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click="historyModalOpen = false">
      <div
        @click.stop
        class="bg-white shadow-xl flex flex-col w-full h-full rounded-none max-w-md mx-auto sm:rounded-lg sm:h-auto sm:w-full"
        style="max-height: 100vh;"
      >
        <div class="px-6 pt-6 pb-4 border-b border-gray-200 relative">
          <h2 class="text-lg font-semibold text-center">Attendance History</h2>
          <button @click="historyModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <XIcon class="size-5" />
          </button>
        </div>

        <div v-if="historyWorkerData" class="px-6 py-5 border-b border-gray-200">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="text-base">{{ historyWorkerData.name }}</h3>
              <p class="text-sm text-gray-500 mt-0.5">{{ historyWorkerData.role }}</p>
            </div>
            <div class="text-right">
              <div :class="[historyWorkerData.attendanceRate >= 90 ? 'text-[#006747]' : 'text-[#B34700]']">
                {{ historyWorkerData.attendanceRate }}%
              </div>
              <p class="text-xs text-gray-500 mt-0.5">Attendance</p>
            </div>
          </div>

          <div v-if="historyWorkerData.office" class="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <MapPinIcon class="size-4 text-gray-400 flex-shrink-0" />
            <span>{{ historyWorkerData.office }}</span>
          </div>

          <div class="flex items-center gap-3">
            <a 
              :href="`mailto:${historyWorkerData.email}`" 
              class="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MailIcon class="size-4" />
              <span>Email</span>
            </a>
            <a 
              :href="`tel:${historyWorkerData.phone}`" 
              class="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <PhoneIcon class="size-4" />
              <span>Call</span>
            </a>
          </div>
        </div>

        <div class="flex-1 flex flex-col overflow-hidden">
          <div class="px-6 pt-4 pb-2">
            <h4 class="text-xs text-gray-500 uppercase tracking-wider">Recent Records</h4>
          </div>
          <div class="flex-1 px-6 pb-6 overflow-y-auto custom-overflow">
            <div class="space-y-3 pr-1">
              <div 
                v-for="(record, index) in workerHistory" 
                :key="index"
                class="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-2 text-gray-700">
                    <CalendarIcon class="size-4 text-gray-400" />
                    <span class="text-sm">{{ formatDate(record.date) }}</span>
                  </div>
                  <span :class="['inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium', getBadgeClasses(getStatusConfig(record.status).variant)]">
                    {{ getStatusConfig(record.status).label }}
                  </span>
                </div>

                <div v-if="record.checkIn && record.checkOut" class="grid grid-cols-3 gap-3">
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Check In</p>
                    <p class="text-sm text-gray-900">{{ record.checkIn }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Check Out</p>
                    <p class="text-sm text-gray-900">{{ record.checkOut }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500 mb-1">Hours</p>
                    <p class="text-sm text-gray-900">{{ record.hours.toFixed(1) }}</p>
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500">No attendance recorded</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h, watch } from 'vue';
import { toast, Toaster } from 'vue-sonner';
import { Calendar, CalendarHeader, CalendarPrevButton, CalendarNextButton, CalendarHeading } from '../../components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
// Removed Dialog imports
import { getLocalTimeZone, today, DateFormatter } from '@internationalized/date';

// Date state
const showCalendarModal = ref(false);
const selectedDate = ref(today(getLocalTimeZone()));
const df = new DateFormatter('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Daily code logic
const generateDailyCode = (date) => {
  const dateStr = date.toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = ((hash << 5) - hash) + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const code = (absHash % 10000).toString().padStart(4, '0');
  return code;
};

const dailyCode = ref('');
const codeRegenerateKey = ref(0);
const showCodeModal = ref(false);

watch(codeRegenerateKey, () => {
  dailyCode.value = generateDailyCode(new Date());
});

onMounted(() => {
  dailyCode.value = generateDailyCode(new Date());
});

function handleRegenerateCode() {
  codeRegenerateKey.value++;
  toast.success('New check-in code generated!');
}

// Logo
const logoImage = 'https://bpb-us-e2.wpmucdn.com/sites.utdallas.edu/dist/8/1525/files/2024/11/ccf-logo-transparent.png';

// State
const searchQuery = ref('');
const selectedWorker = ref(null);
const statusFilter = ref('all');
const historyModalOpen = ref(false);
const historyWorkerId = ref(null);
const selectedSite = ref('north');
const currentTime = ref('');

// Data Fetching
// Data Fetching
const queryDate = computed(() => selectedDate.value.toString());
const { data: workers, refresh: refreshWorkers } = await useFetch('/api/workers', {
  query: { date: queryDate }
});
const workerHistory = ref([]);

// Robust body scroll lock for modals
watch([historyModalOpen, showCodeModal, showCalendarModal], ([historyOpen, codeOpen, calendarOpen]) => {
  if (historyOpen || codeOpen || calendarOpen) {
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  } else {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }
});

// Helper functions
const getStatusConfig = (status) => {
  const configs = {
    present: { label: 'Present', variant: 'default', color: 'bg-green-500' },
    late: { label: 'Late', variant: 'destructive', color: 'bg-orange-500' },
    absent: { label: 'Absent', variant: 'secondary', color: 'bg-gray-400' },
    'called-off': { label: 'Called Off', variant: 'outline', color: 'bg-blue-500' },
  };
  return configs[status] || configs.absent;
};

const getBadgeClasses = (variant) => {
  const variants = {
    default: 'border-transparent bg-primary text-primary-foreground bg-[#030213] text-white',
    destructive: 'border-transparent bg-destructive text-white bg-[#d4183d]',
    secondary: 'border-transparent bg-secondary text-secondary-foreground bg-[#ececf0] text-[#030213]',
    outline: 'text-foreground border-[rgba(0,0,0,0.1)] text-[#030213]',
  };
  return variants[variant] || variants.default;
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Computed properties
const filteredWorkers = computed(() => {
  if (!workers.value) return [];
  return workers.value.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = statusFilter.value === 'all' || worker.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const formattedCurrentDate = computed(() => {
  return df.format(selectedDate.value.toDate(getLocalTimeZone()));
});

const presentCount = computed(() => workers.value?.filter(w => w.status === 'present').length || 0);
const lateCount = computed(() => workers.value?.filter(w => w.status === 'late').length || 0);
const absentCount = computed(() => workers.value?.filter(w => w.status === 'absent').length || 0);
const calledOffCount = computed(() => workers.value?.filter(w => w.status === 'called-off').length || 0);

const historyWorkerData = computed(() => {
  return historyWorkerId.value ? workers.value?.find(w => w.id === historyWorkerId.value) : null;
});

// Methods
const toggleWorker = (workerId) => {
  selectedWorker.value = selectedWorker.value === workerId ? null : workerId;
};

const handleViewHistory = async (workerId) => {
  historyWorkerId.value = workerId;
  historyModalOpen.value = true;
  const { data } = await useFetch(`/api/attendance/${workerId}`);
  workerHistory.value = data.value || [];
};

// Lifecycle & SSE
let timeInterval;
let eventSource;

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);

  // Setup SSE
  eventSource = new EventSource('/api/sse');
  
  eventSource.onopen = () => {
    console.log('SSE Connected');
  };

  eventSource.onmessage = (event) => {
    // Heartbeat or simple message
    console.log('SSE Message:', event.data);
  };

  eventSource.addEventListener('worker:update', (event) => {
    const updatedWorker = JSON.parse(event.data);
    if (workers.value) {
      const index = workers.value.findIndex(w => w.id === updatedWorker.id);
      if (index !== -1) {
        workers.value[index] = updatedWorker;
        toast.info(`Updated status for ${updatedWorker.name}`);
      }
    }
  });

  eventSource.onerror = (err) => {
    console.error('SSE Error:', err);
    eventSource.close();
  };
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
  if (eventSource) {
    eventSource.close();
  }
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
});

// Icon components (inline SVG) - All Lucide icons rendered with render() so runtime-only Vue builds work
const SearchIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: 11, cy: 11, r: 8 }),
      h('path', { d: 'm21 21-4.3-4.3' }),
    ]);
  }
};

const PhoneIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' }),
    ]);
  }
};

const MailIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('rect', { width: 20, height: 16, x: 2, y: 4, rx: 2 }),
      h('path', { d: 'm22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7' }),
    ]);
  }
};

const MapPinIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z' }),
      h('circle', { cx: 12, cy: 10, r: 3 }),
    ]);
  }
};

const ClockIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('circle', { cx: 12, cy: 12, r: 10 }),
      h('polyline', { points: '12 6 12 12 16 14' }),
    ]);
  }
};

const ChevronRightIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'm9 18 6-6-6-6' }),
    ]);
  }
};

const ChevronDownIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'm6 9 6 6 6-6' }),
    ]);
  }
};

const CalendarIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M8 2v4' }),
      h('path', { d: 'M16 2v4' }),
      h('rect', { width: 18, height: 18, x: 3, y: 4, rx: 2 }),
      h('path', { d: 'M3 10h18' }),
    ]);
  }
};

const FilterIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('polygon', { points: '22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3' }),
    ]);
  }
};

const FileTextIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z' }),
      h('path', { d: 'M14 2v4a2 2 0 0 0 2 2h4' }),
      h('path', { d: 'M10 9H8' }),
      h('path', { d: 'M16 13H8' }),
      h('path', { d: 'M16 17H8' }),
    ]);
  }
};

const XIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M18 6 6 18' }),
      h('path', { d: 'm6 6 12 12' }),
    ]);
  }
};

const ShieldIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' })
    ]);
  }
};

const RefreshCwIcon = {
  render() {
    return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, [
      h('path', { d: 'M21 2v6h-6' }),
      h('path', { d: 'M3 12a9 9 0 0 1 15-6.7L21 8' }),
      h('path', { d: 'M3 22v-6h6' }),
      h('path', { d: 'M21 12a9 9 0 0 1-15 6.7L3 16' })
    ]);
  }
};
</script>

<style scoped>
.custom-overflow {
  overflow-y: auto;
  scrollbar-width: none;
}

.custom-overflow::-webkit-scrollbar {
  display: none;
}
</style>
