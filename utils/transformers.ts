import {Race, TransformedRace} from "@/types/race";
import {Participant, TransformedParticipant} from "@/types/participants";
import {TransformedUser, UserProfile, Volunteer, TransformedVolunteer} from "@/types/profile";

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
    const participants = Array.isArray(race.participants) ? race.participants[0] : race.participants;

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
        registrations: race.registrations,
        volunteers: race.volunteers,
        participants: participants?.count,
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

export function transformCountRace(race: { registrations: number, participants: { count: number }[] }): { registrations: number, participants: number } {
    const participants = Array.isArray(race.participants) ? race.participants[0] : race.participants;

    return {
        registrations: race.registrations,
        participants: participants?.count,
    };
}

export function transformUser(user: UserProfile): TransformedUser {
    const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;

    return {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        avatarUrl: user.avatar_url,
        roleId: user.role_id,
        userRole: role.label ?? "不明",
    };
}

export function transformCountVolunteer(race: { volunteers: number, race_volunteers: { count: number }[] }): { volunteers: number, raceVolunteers: number } {
    const raceVolunteers = Array.isArray(race.race_volunteers) ? race.race_volunteers[0] : race.race_volunteers;

    return {
        volunteers: race.volunteers,
        raceVolunteers: raceVolunteers?.count,
    };
}

export function transformVolunteer(volunteer: Volunteer): TransformedVolunteer {
    const volunteerData = Array.isArray(volunteer.profiles) ? volunteer.profiles[0] : volunteer.profiles;

    return {
        id: volunteer.id,
        raceId: volunteer.race_id,
        volunteerId: volunteer.volunteer_id,
        fullName: volunteerData.full_name,
        email: volunteerData.email,
        avatarUrl: volunteerData.avatar_url,
    };
}
