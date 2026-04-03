'use server'

import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export async function getEvents() {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}