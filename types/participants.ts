export type Participant = {
    full_name: string,
    id: string,
    race_id: string,
    runnet_id: string | null,
    tshirt_size: string | null,
    checked_in: boolean,
    email: string | null,
    confirmation_sent_at: string | null
}

export type TransformedParticipant = {
    id: string,
    runnetId: string | null,
    fullName: string,
    tshirtSize: string | null,
    checkedIn: boolean,
    raceId: string,
    email: string | null,
    confirmationSentAt: string | null
    displayDate: string | null
}

export type ParticipantCSV = {
    runnet_id: string,
    full_name: string,
    tshirt_size: string,
    email: string
}

export type ParticipantImport = {
    full_name: string,
    race_id: string,
    runnet_id: string | null,
    tshirt_size: string | null,
    email: string
}