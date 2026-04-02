export type Participant = {
    full_name: string | null
    id: string
    race_id: string | null
    runnet_id: string | null
    tshirt_size: string | null
    checked_in: boolean | null
}

export type TransformedParticipant = {
    id: string;
    runnetId: string | null;
    fullName: string | null;
    tshirtSize: string | null;
    checkedIn: boolean | null;
    raceId: string | null;
}

export type ParticipantCSV = {
    runnet_id: string;
    full_name: string;
    tshirt_size: string;
    checked_in: string;
}