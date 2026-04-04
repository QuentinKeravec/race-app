import {Race, TransformedRace} from "@/types/race";
import {Participant, TransformedParticipant} from "@/types/participants";

export const jaDateTimeFormatter = new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Tokyo',
});

export function transformRace(race: Race): TransformedRace {
    const event = Array.isArray(race.events) ? race.events[0] : race.events;
    const status = Array.isArray(race.race_statuses) ? race.race_statuses[0] : race.race_statuses;

    return {
        id: race.id,
        name: race.name,
        slug: race.slug,
        distanceMeters: race.distance_meters
            ? race.distance_meters / 1000
            : 0,
        startTime: new Date(race.start_time).toISOString(),
        displayDate: jaDateTimeFormatter.format(new Date(race.start_time)),
        eventId: race.events?.id ? String(race.events.id) : "",
        eventName: event?.name ?? "不明",
        status: status?.label ?? "不明",
        statusId: status?.id ?? "",
    };
}

export function transformParticipant(participant: Participant): TransformedParticipant {
    return {
        id: participant.id,
        runnetId: participant.runnet_id,
        fullName: participant.full_name,
        tshirtSize: participant.tshirt_size,
        checkedIn: participant.checked_in,
        raceId: participant.race_id,
    };
}