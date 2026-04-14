'use server'

import {createClient} from "@/utils/supabase/server";
import {transformCountRace, transformParticipant} from "@/utils/transformers";

export async function getParticipantById(participantId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('participants')
        .select(`
            *,
            races (
                name
            )
        `)
        .eq('id', participantId)
        .single();

    if (error) throw new Error(error.message);

    const transformed = transformParticipant(data);

    return {
        ...transformed,
        raceName: data.races?.name || data.race_id
    };
}

export async function getParticipantsByRaceId(raceId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('race_id', raceId)
        .order('runnet_id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data.map(transformParticipant)) || [];
}

export async function getParticipantCount(raceId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('races')
        .select(`
                registrations,
                participants:participants(count)
        `)
        .eq('id', raceId)
        .single();

    if (error) throw new Error(error.message);
    return transformCountRace(data);
}

export async function getCheckedInParticipantCount(raceId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('races')
        .select(`
                registrations,
                participants:participants(count)
        `)
        .eq('participants.checked_in', true)
        .eq('id', raceId)
        .single();

    if (error) throw new Error(error.message);
    return transformCountRace(data);
}