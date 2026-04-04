'use server'

import {createClient} from "@/utils/supabase/client";
import {transformParticipant} from "@/utils/transformers";

const supabase = createClient();

export async function getParticipantsByRaceId(raceId: string) {
    const { data, error } = await supabase
        .from('participants')
        .select('*')
        .eq('race_id', raceId)
        .order('runnet_id', { ascending: true });

    if (error) throw new Error(error.message);
    return (data.map(transformParticipant)) || [];
}