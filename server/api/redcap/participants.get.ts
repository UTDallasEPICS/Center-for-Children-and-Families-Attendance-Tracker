export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const explicitWeek = query.week as string | undefined

  // Compute which REDCap event to export
  const today = new Date()
  const eventName = getWeekEventName(today, explicitWeek)

  // Fields that we KNOW exist in your REDCap project
  const fields = [
    'record_id',
    'id',
    'chname_reg',
    'chlname_reg',
    'chdob_reg',
    'mphone_reg',
    'memail_reg',
    'childatt_checkin'
  ]

  const redcapData = await postToRedcap({
    content: 'record',
    action: 'export',
    format: 'json',
    type: 'flat',
    fields: fields.join(','),     // "record_id,id,chname_reg,..."
    //events: eventName,            // filters to current week
    rawOrLabel: 'raw',
    rawOrLabelHeaders: 'raw',
    exportSurveyFields: 'false',
    exportDataAccessGroups: 'false',
    returnFormat: 'json'
  })

  // Transform REDCap rows -> frontend-friendly summary objects
  const participants = (redcapData as any[]).map((row) => {
    const first = (row.chname_reg ?? '').trim()
    const last = (row.chlname_reg ?? '').trim()
    const fullName = [first, last].filter(Boolean).join(' ')

    const status =
      row.childatt_checkin === '1'
        ? 'checked-in'
        : row.childatt_checkin === '0'
        ? 'pending'
        : 'unknown'

    return {
      recordId: String(row.record_id),
      name: fullName || '(No name)',
      dob: row.chdob_reg || '',
      phone: row.mphone_reg || '',
      email: row.memail_reg || '',
      status
    }
  })

  return participants
})
