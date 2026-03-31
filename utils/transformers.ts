import {TransformedRace} from "@/types/race";

export const jaDateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
});

export function transformRace(race: any): TransformedRace {
    const event = Array.isArray(race.events) ? race.events[0] : race.events;
    const status = Array.isArray(race.race_statuses) ? race.race_statuses[0] : race.race_statuses;

    return {
        id: race.id,
        name: race.name,
        slug: race.slug,
        distanceMeters: race.distance_meters
            ? (race.distance_meters / 1000).toFixed(3)
            : "0",
        startTime: race.start_time
            ? jaDateTimeFormatter.format(new Date(race.start_time))
            : "不明",
        eventName: event?.name ?? "不明",
        status: status?.label ?? "不明",
        statusId: status?.id ?? "",
    };
}