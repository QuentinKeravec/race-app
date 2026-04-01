export interface Race {
    id: string
    name: string
    slug: string
    distance_meters: number | null
    event_id: string | null
    start_time: string | null
    status_id: string | null
    events: {
        name: string
    } | null
    race_statuses: {} | null
}

export interface TransformedRace {
    id: string;
    name: string;
    slug: string;
    distanceMeters: string | null;
    startTime: string | null;
    eventName: string;
    status: string;
    statusId: string | number;
}