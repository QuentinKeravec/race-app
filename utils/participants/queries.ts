'use server'

import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export async function getParticipants() {
    const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('runnet_id', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}
