'use server'

import {createClient} from "@/utils/supabase/server";

export async function getStatuses() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('race_statuses')
        .select(`
            id,
            label
        `)
    ;

    if (error) throw new Error(error.message);
    return data || [];
}