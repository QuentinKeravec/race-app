'use server'

import {createClient} from "@/utils/supabase/client";
import {transformCountVolunteer, transformVolunteer, transformUser} from "@/utils/transformers";

const supabase = createClient();

export async function getUsers() {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
                *,
                roles (id, label)
        `);

    if (error) throw new Error(error.message);
    return data.map(transformUser) || [];
}

export async function getVolunteerCount(raceId: string) {
    const { data, error } = await supabase
        .from('races')
        .select(`
                volunteers,
                race_volunteers:race_volunteers(count)
        `)
        .eq('id', raceId)
        .single();

    if (error) throw new Error(error.message);
    return transformCountVolunteer(data);
}

export async function getVolunteersByRaceId(raceId: string) {
    const { data, error } = await supabase
        .from('race_volunteers')
        .select(`
                *,
                profiles ( full_name, avatar_url, email )  
            `)
        .eq('race_id', raceId)
        .order('full_name', { ascending: true });

    if (error) throw new Error(error.message);
    return (data.map(transformVolunteer)) || [];
}
