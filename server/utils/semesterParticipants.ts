import {postToRedcap} from './redcap';
export async function getSemesterParticipants(semester: number) {
    // Implementation for fetching semester participants
    const fields = ["record_id", "sem", "chname_reg", "chlname_reg", "chdob_reg", "mphone_reg", "memail_reg", "childatt_checkin"];

    //since semester only exists in the first week
    const redcapData = await postToRedcap({
        content: "record",
        action: "export",
        format: "json",
        type: "flat",
        fields: fields.join(","),
        filterLogic: `[sem] = ${semester}`,
        rawOrLabel: "raw",
        rawOrLabelHeaders: "raw",
        exportSurveyFields: "false",
        exportDataAccessGroups: "false",
        returnFormat: "json",
    });

    return (redcapData as any[]).filter((row) => Number(row.sem) === semester).map((row) => {
        return {
            recordId: String(row.record_id),
            name: `${row.chname_reg} ${row.chlname_reg}`,
            dob: row.chdob_reg,
            phone: row.mphone_reg,
            email: row.memail_reg,
        };
    });
}