// app/utils/redcap.ts
export async function postToRedcap(body: Record<string, any>) {
    const config = useRuntimeConfig()
    const form = new URLSearchParams()

    form.set("token", config.redcapApiToken)
    form.set("format", body.format || "json")
    form.set("content", body.content)
    form.set("action", body.action)

    for (const [key, value] of Object.entries(body)) {
        if (["token", "format", "content", "action"].includes(key)) continue
        if (value === undefined || value === null || value === "") continue
        form.set(key, String(value))
    }

    const res = await fetch(config.redcapApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
    })

    const text = await res.text()

    if (!res.ok) {
        console.error("REDCap error:", res.status, text)
        throw new Error(`REDCap error ${res.status}`)
    }

    try {
        return JSON.parse(text)
    } catch {
        return text
    }
}
