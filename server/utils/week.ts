// server/utils/week.ts
import { useRuntimeConfig } from "#imports"

export function getWeekEventName(date: Date, explicitWeek?: string) {
    const config = useRuntimeConfig()
    const startStr = (config.programStartDate as string) || "2025-01-12"
    const programStart = new Date(startStr + "T00:00:00")

    if (explicitWeek) {
        return `week_${explicitWeek}_arm_1`
    }

    const msPerWeek = 7 * 24 * 60 * 60 * 1000
    const diff = date.getTime() - programStart.getTime()
    const rawWeek = Math.floor(diff / msPerWeek) + 1
    const week = Math.max(1, Math.min(8, rawWeek))

    return `week_${week}_arm_1`
}

// nice convenience wrapper
export function getCurrentWeekEvent(explicitWeek?: string) {
    const now = new Date()
    const eventName = getWeekEventName(now, explicitWeek)

    // Optional: pull week number back out if you ever need it
    const parts = eventName.split("_") // ['week', '1', 'arm', '1']
    const weekNumber = Number(parts[1]) || 1

    return { eventName, weekNumber }
}
