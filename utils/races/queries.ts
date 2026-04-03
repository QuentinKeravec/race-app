'use server'

import {cache} from 'react';
import {createClient} from "@/utils/supabase/client";
import {transformRace} from "@/utils/transformers";

const supabase = createClient();

export async function getRaces() {
    const { data, error } = await supabase
        .from('races')
        .select(`
                *,
                events ( id, name ),
                race_statuses ( id, label )
        `)
    ;

    if (error) throw new Error(error.message);
    return data.map(transformRace) || [];
}

export const getRaceBySlug = cache(async function getRaceBySlug(slug: string) {
    const { data, error } = await supabase
        .from('races')
        .select(`
                *,
                events ( id, name ),
                race_statuses ( id, label )
        `)
        .eq('slug', slug)
        .single()
    ;

    if (error) throw new Error(error.message);
    return transformRace(data) || [];
});