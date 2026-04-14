'use server'

import {createClient} from "@/utils/supabase/server";
import {transformCountVolunteer, transformVolunteer, transformUser, transformVolunteer2} from "@/utils/transformers";

export async function getUsers() {
    const supabase = await createClient();

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
    const supabase = await createClient();

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
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('race_volunteers')
        .select(`
                *,
                profiles ( full_name, avatar_url, email )  
            `)
        .eq('race_id', raceId)
        .order('profiles(full_name)', { ascending: true });

    if (error) throw new Error(error.message);
    return (data.map(transformVolunteer)) || [];
}

export async function getVolunteersExceptRaceId(raceId: string) {
    const supabase = await createClient();

    const { data: alreadyRegistered } = await supabase
        .from('race_volunteers')
        .select('volunteer_id')
        .eq('race_id', raceId);

    const excludedIds = alreadyRegistered?.map(r => r.volunteer_id) || [];

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            id,
            full_name,
            avatar_url,
            email
        `)
        .not('id', 'in', `(${excludedIds.join(',')})`)
        .eq('role_id', 'volunteer')
        .order('full_name', { ascending: true });

    if (error) throw new Error(error.message);

    return (data.map(transformVolunteer2) || []) ;
}

