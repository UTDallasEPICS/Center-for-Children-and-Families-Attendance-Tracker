export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const recordId = query.record_id as string | undefined
  const explicitWeek = query.week as string | undefined

  if (!recordId) {
    throw createError({ statusCode: 400, statusMessage: 'record_id is required' })
  }

  // Use current date + optional ?week=X override
  const today = new Date()
  const eventName = getWeekEventName(today, explicitWeek)

  // IMPORTANT: Only fields that actually exist in your REDCap project
  const fields = [
    'record_id',
    'id',
    'chname_reg',
    'chlname_reg',
    'chdob_reg',
    'mphone_reg',
    'memail_reg',

    // attendance
    'childatt_checkin',
    'absence_checkin',

    // guardians (checkboxes)
    'parent_checkin___1',
    'parent_checkin___2',
    'parent_checkin___3',
    'parent_checkin___4',
    'parent_checkin___5',
    'parent_checkin___6',
    'parent_checkin___7',
    'parent_checkin___8',
    'parent_other_checkin',

    // extra child
    'otherchild_checkin',
    'otherkidrel_checkin',

    // agency + notes
    'agency_checkin',
    'notes_checkin'
  ]

  const redcapData = await postToRedcap({
    content: 'record',
    action: 'export',
    format: 'json',
    type: 'flat',
    records: recordId,
    events: eventName,
    fields: fields.join(','), // ✅ comma-separated
    rawOrLabel: 'raw',
    rawOrLabelHeaders: 'raw',
    exportSurveyFields: 'false',
    exportDataAccessGroups: 'false',
    returnFormat: 'json'
  })

  if (!Array.isArray(redcapData) || redcapData.length === 0) {
    // No record for this event; you can return null or throw
    return null
  }

  const row = redcapData[0]

  // Build full name
  const first = (row.chname_reg ?? '').trim()
  const last = (row.chlname_reg ?? '').trim()
  const fullName = [first, last].filter(Boolean).join(' ')

  // Map parent_checkin___X → human labels
  const guardianMap: Record<string, string> = {
    parent_checkin___1: 'Mother',
    parent_checkin___2: 'Father',
    parent_checkin___3: 'Grandparent',
    parent_checkin___4: 'Aunt/uncle',
    parent_checkin___5: 'Foster parent',
    parent_checkin___6: 'Nanny',
    parent_checkin___7: 'Friend',
    parent_checkin___8: 'Other'
  }

  const guardians: string[] = []
  Object.entries(guardianMap).forEach(([field, label]) => {
    if (row[field] === '1') {
      guardians.push(label)
    }
  })

  return {
    // IDs / identity
    recordId: String(row.record_id),
    childId: row.id || null,
    eventName,

    name: fullName || '(No name)',
    dob: row.chdob_reg || '',
    phone: row.mphone_reg || '',
    email: row.memail_reg || '',

    // attendance
    attendanceValue: row.childatt_checkin || '',
    absenceReason: row.absence_checkin || '',

    // guardians
    guardians,
    guardianOther: row.parent_other_checkin || '',

    // extra child
    extraChildCode: row.otherchild_checkin || '',
    extraChildRelationship: row.otherkidrel_checkin || '',

    // agency + notes
    agency: row.agency_checkin || '',
    notes: row.notes_checkin || ''
  }
})
