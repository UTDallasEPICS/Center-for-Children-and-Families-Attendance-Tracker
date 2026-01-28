<!-- pages/participant.vue -->
<script setup lang="ts">
  import { ref, computed, onMounted } from "vue"
  import { useRoute } from "vue-router"

  type Participant = {
    recordId: string
    childId?: string
    eventName?: string
    name: string
    dob: string
    phone: string
    email: string
  }

  type ParticipantSummary = {
    recordId: string
    name: string
    dob: string
    phone: string
    email: string
    status: "checked-in" | "pending" | "unknown"
  }

  // --- List + search state ---

  // Start with some mock data; will be replaced by real REDCap data on mount
  const participants = ref<ParticipantSummary[]>([
    {
      recordId: "1",
      name: "test Test",
      dob: "2025-05-18",
      phone: "9999999999",
      email: "test@utdallas.edu",
      status: "checked-in",
    },
    {
      recordId: "2",
      name: "Chase Gibson",
      dob: "2025-11-04",
      phone: "1234567890",
      email: "",
      status: "pending",
    },
    {
      recordId: "3",
      name: "Viknesh Venkatachalam",
      dob: "2025-08-22",
      phone: "1231234567",
      email: "email@gmail.com",
      status: "unknown",
    },
    {
      recordId: "4",
      name: "test Test",
      dob: "2025-05-18",
      phone: "9999999999",
      email: "",
      status: "checked-in",
    },
  ])

  const search = ref("")

  const filteredParticipants = computed(() => {
    const term = search.value.trim().toLowerCase()
    if (!term) return participants.value

    return participants.value.filter((p) => {
      const name = p.name?.toLowerCase() ?? ""
      const id = p.recordId ?? ""
      return name.includes(term) || id.includes(term)
    })
  })

  // --- Selected participant & form state ---

  const currentParticipant = ref<Participant | null>(null)

  const guardianOptions = ["Mother", "Father", "Grandparent", "Aunt/uncle", "Foster parent", "Nanny", "Friend", "Other"]

  // Vue handles checkbox ↔ array automatically with v-model
  const selectedGuardians = ref<string[]>([])
  const broughtExtraChild = ref<"yes" | "no" | null>(null)
  const otherPersonnel = ref("") // relationship / info of other personnel
  const externalAgency = ref("") // name of external agency
  const additionalNotes = ref("")
  const attendanceValue = ref("1") // "1" present, "0" absent (if you hook this up later)
  const absenceReason = ref("") // if you decide to expose this

  const route = useRoute()

  // --- Helpers ---

  // Load full participant details by recordId
  const loadParticipantByRecordId = async (recordId: string) => {
    console.log("Loading participant from REDCap for recordId:", recordId)

    try {
      const data: any = await $fetch("/api/redcap/participant", {
        params: { record_id: recordId },
      })

      console.log("Participant API response:", data)

      if (!data) {
        alert("No data returned for this participant.")
        currentParticipant.value = null
        return
      }

      currentParticipant.value = {
        recordId: data.recordId,
        childId: data.childId,
        email: data.email,
        eventName: data.eventName,
        name: data.name,
        dob: data.dob,
        phone: data.phone,
      }

      // form state from REDCap
      selectedGuardians.value = data.guardians ?? []
      externalAgency.value = data.agency ?? ""
      additionalNotes.value = data.notes ?? ""
      attendanceValue.value = data.attendanceValue || "1"
      absenceReason.value = data.absenceReason || ""
      otherPersonnel.value = data.extraChildRelationship || ""

      if (data.extraChildCode && data.extraChildCode !== "0") {
        broughtExtraChild.value = "yes"
      } else if (data.extraChildCode === "0") {
        broughtExtraChild.value = "no"
      } else {
        broughtExtraChild.value = null
      }
    } catch (error) {
      console.error("Error loading participant from REDCap:", error)
      alert("Error loading participant from REDCap. Check server logs / console.")
      currentParticipant.value = null
    }
  }

  const onSelectParticipant = (recordId: string) => {
    console.log("onSelectParticipant got recordId:", recordId)
    loadParticipantByRecordId(recordId)
  }

  // Submit to REDCap
  const submitForm = async () => {
    if (!currentParticipant.value) {
      alert("No participant loaded.")
      return
    }

    const extraChildCode = broughtExtraChild.value === "yes" ? "2" : broughtExtraChild.value === "no" ? "0" : ""

    const payload = {
      recordId: currentParticipant.value.recordId,
      childId: currentParticipant.value.childId,
      eventName: currentParticipant.value.eventName, // e.g. "week_1_arm_1" if your /participant endpoint sends it
      attendanceValue: attendanceValue.value,
      absenceReason: absenceReason.value,
      guardians: selectedGuardians.value,
      guardianOther: "", // wire up a dedicated "Other (specify)" input later if needed
      extraChildCode,
      extraChildRelationship: otherPersonnel.value || "",
      agency: externalAgency.value,
      notes: additionalNotes.value,
    }

    try {
      const res = await $fetch("/api/redcap/attendance", {
        method: "POST",
        body: payload,
      })
      console.log("REDCap response:", res)
      alert("Attendance submitted successfully.")
    } catch (err) {
      console.error(err)
      alert("Error submitting attendance. Please try again.")
    }
  }

  // --- Initial load ---

  onMounted(async () => {
    // 1) Load participants list from REDCap
    try {
      const data = await $fetch<ParticipantSummary[]>("/api/redcap/participants")
      if (Array.isArray(data) && data.length) {
        participants.value = data
      }
    } catch (err) {
      console.error("Failed to load participants from REDCap, using mock data.", err)
    }

    // 2) If ?record_id= is in the URL, load that specific record
    const record_id = route.query.record_id as string | undefined
    const first = participants.value[0]
    if (record_id) {
      await loadParticipantByRecordId(record_id)
    } else if (first !== undefined) {
      // Otherwise default to first participant
      await loadParticipantByRecordId(first.recordId)
    }
  })
</script>

<template>
  <div class="min-h-screen bg-[#EFEFEF]">
    <!-- Reusable nav bar -->
    <NavBar />

    <main class="max-w-[394px] mx-auto px-2 pt-3 pb-24">
      <!-- Search bar -->
      <div class="mt-4 px-2">
        <div class="flex items-center gap-2 bg-[#E7E7E7] border border-[rgba(120,120,120,0.54)] rounded-[7px] px-3 h-[31px] w-full max-w-[380px] mx-auto">
          <span class="text-gray-500 text-sm">🔍</span>
          <input
            v-model="search"
            type="text"
            class="flex-1 bg-transparent text-[11px] font-semibold text-[#787878] placeholder-[#787878] outline-none"
            placeholder="search by name or ID..."
          />
        </div>
      </div>

      <!-- Main participant card + form -->
      <section class="mt-4 border border-[#9F9F9F] rounded-[12px] bg-[rgba(223,223,223,0.29)] px-4 pt-4 pb-6">
        <!-- Participant header -->
        <h1 class="text-[16px] font-semibold text-black">
          {{ currentParticipant?.name || "Loading participant..." }}
        </h1>

        <!-- Basic info -->
        <div class="mt-3 space-y-2 text-[13px]">
          <div class="flex items-center gap-2">
            <div class="w-[17px] h-[17px] flex items-center justify-center border-2 border-black text-[10px]">#</div>
            <span class="font-semibold text-black"> ID: {{ currentParticipant?.recordId || "—" }} </span>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-[17px] h-[17px] flex items-center justify-center border-2 border-black text-[10px]">📅</div>
            <span class="font-normal text-black"> DOB: {{ currentParticipant?.dob || "—" }} </span>
          </div>

          <div class="flex items-center gap-2">
            <div class="w-[17px] h-[17px] flex items-center justify-center border-2 border-black text-[10px]">📞</div>
            <span class="font-medium text-black"> Contact: {{ currentParticipant?.phone || "—" }} </span>
          </div>

          <div v-if="currentParticipant?.email" class="flex items-center gap-2">
            <div class="w-[17px] h-[17px] flex items-center justify-center border-2 border-black text-[10px]">✉️</div>
            <span class="font-medium text-black">
              {{ currentParticipant.email }}
            </span>
          </div>
        </div>

        <!-- Guardian selection -->
        <section class="mt-5">
          <p class="text-[13px] font-medium text-black mb-2">please indicate guardian for today's session*:</p>

          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-[13px]">
            <label v-for="label in guardianOptions" :key="label" class="flex items-center gap-2">
              <input type="checkbox" class="w-[13px] h-[13px] border border-black rounded-sm" :value="label" v-model="selectedGuardians" />
              <span class="font-medium text-black">
                {{ label }}
              </span>
            </label>
          </div>
        </section>

        <!-- Info of other personnel -->
        <section class="mt-5">
          <p class="text-[13px] font-medium text-black mb-1">information of other personnel:</p>
          <textarea
            v-model="otherPersonnel"
            class="w-full max-w-[288px] h-[30px] bg-[#D9D9D9] border border-[rgba(0,0,0,0.18)] rounded-[6px] text-[13px] px-2 py-1 resize-none"
          />
        </section>

        <!-- Extra child question -->
        <section class="mt-5">
          <p class="text-[13px] font-semibold text-black mb-2 leading-5">did the guardian bring an additional Child outside of the program*?:</p>

          <div class="space-y-1 text-[13px]">
            <label class="flex items-center gap-2">
              <span class="font-semibold">Yes:</span>
              <input type="radio" name="extra-child" class="w-[17px] h-[17px] border border-black" value="yes" v-model="broughtExtraChild" />
            </label>

            <label class="flex items-center gap-2">
              <span class="font-semibold">No:</span>
              <input type="radio" name="extra-child" class="w-[17px] h-[17px] border border-black" value="no" v-model="broughtExtraChild" />
            </label>
          </div>
        </section>

        <!-- External agency -->
        <section class="mt-5">
          <p class="text-[13px] font-medium text-black mb-2 leading-5">
            if applicable, please indicate the name of external agency that joined today’s session.
          </p>
          <textarea
            v-model="externalAgency"
            class="w-full max-w-[288px] h-[39px] bg-[#D9D9D9] border border-[rgba(0,0,0,0.18)] rounded-[6px] text-[13px] px-2 py-1 resize-none"
          />
        </section>

        <!-- Additional notes -->
        <section class="mt-5">
          <p class="text-[13px] font-medium text-black mb-1">Additional Notes:</p>
          <textarea
            v-model="additionalNotes"
            class="w-full max-w-[289px] h-[40px] bg-[#D9D9D9] border border-[rgba(0,0,0,0.18)] rounded-[6px] text-[13px] px-2 py-1 resize-none"
          />
        </section>

        <!-- Submit button -->
        <div class="mt-6 flex justify-center">
          <button type="button" class="w-[282px] h-[67px] bg-[#154734] rounded-[13px] flex items-center justify-center shadow-md" @click="submitForm">
            <span class="text-white text-[16px] font-semibold leading-[22px] text-center drop-shadow-md"> Submit attendance </span>
          </button>
        </div>
      </section>
    </main>

    <!-- Recent / other participants -->
    <section class="mt-5 space-y-3 max-w-[394px] mx-auto px-2 pb-8">
      <ParticipantCard
        v-for="p in filteredParticipants"
        :key="p.recordId"
        :record-id="p.recordId"
        :name="p.name"
        :dob="p.dob"
        :phone="p.phone"
        :email="p.email"
        :status="p.status"
        @select="onSelectParticipant"
      />
    </section>
  </div>
</template>
