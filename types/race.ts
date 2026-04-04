export interface Race {
    id: string
    name: string
    slug: string
    distance_meters: number
    event_id: string
    start_time: string
    status_id: string
    events: {
        id: string,
        name: string
    } | null
    race_statuses: {} | null
}

export interface TransformedRace {
    id: string
    name: string
    slug: string
    distanceMeters: number
    startTime: string
    displayDate: string
    eventId: string
    eventName: string
    status: string
    statusId: string
}