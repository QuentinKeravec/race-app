export type Participant = {
    full_name: string
    id: string
    race_id: string
    runnet_id: string | null
    tshirt_size: string | null
    checked_in: boolean
}

export type TransformedParticipant = {
    id: string;
    runnetId: string | null
    fullName: string
    tshirtSize: string | null
    checkedIn: boolean
    raceId: string
}

export type ParticipantCSV = {
    runnet_id: string
    full_name: string
    tshirt_size: string
    checked_in: string
}

export type ParticipantImport = {
    full_name: string
    race_id: string
    runnet_id: string | null
    tshirt_size: string | null
    checked_in: boolean
}