type AttendanceBody = {
    recordId: string
    childId?: string
    eventName?: string
    attendanceValue: string // "1" present, "0" absent
    absenceReason?: string
    guardians: string[] // ["Mother", "Nanny", ...]
    guardianOther?: string
    extraChildCode?: string // "2" yes, "0" no, "" unknown
    extraChildRelationship?: string
    agency?: string
    notes?: string
}

// Map guardian labels to REDCap checkbox variables
const GUARDIAN_FIELD_MAP: Record<string, string> = {
    Mother: "parent_checkin___1",
    Father: "parent_checkin___2",
    Grandparent: "parent_checkin___3",
    "Aunt/uncle": "parent_checkin___4",
    "Foster parent": "parent_checkin___5",
    Nanny: "parent_checkin___6",
    Friend: "parent_checkin___7",
    Other: "parent_checkin___8",
}

export default defineEventHandler(async (event) => {
    const body = await readBody<AttendanceBody>(event)

    if (!body.recordId) {
        throw createError({
            statusCode: 400,
            statusMessage: "recordId is required",
        })
    }

    // If frontend doesn't send eventName, compute from current week
    const eventName = body.eventName || getWeekEventName(new Date())

    const record: any = {
        record_id: body.recordId,
        redcap_event_name: eventName,
        // attendance
        childatt_checkin: body.attendanceValue ?? "",
        absence_checkin: body.absenceReason ?? "",
        // extra child
        otherchild_checkin: body.extraChildCode ?? "",
        otherkidrel_checkin: body.extraChildRelationship ?? "",
        // agency + notes
        agency_checkin: body.agency ?? "",
        notes_checkin: body.notes ?? "",
        // mark weekly_attendance form complete
        weekly_attendance_complete: "2",
    }

    // Guardian checkboxes
    const selected = new Set(body.guardians || [])
    for (const [label, field] of Object.entries(GUARDIAN_FIELD_MAP)) {
        record[field] = selected.has(label) ? "1" : "0"
    }

    if (body.guardianOther) {
        record.parent_other_checkin = body.guardianOther
    }

    // REDCap import expects JSON array in "data"
    const dataJson = JSON.stringify([record])

    const redcapResult = await postToRedcap({
        content: "record",
        action: "import",
        format: "json",
        type: "flat",
        overwriteBehavior: "overwrite",
        data: dataJson,
        returnContent: "count",
        returnFormat: "json",
    })

    return {
        ok: true,
        redcap: redcapResult,
    }
})
