'use server'

import {cache} from 'react';
import {createClient} from "@/utils/supabase/server";
import {transformRace} from "@/utils/transformers";

export async function getRaces() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('races')
        .select(`
                *,
                participants:participants(count),
                events ( id, name ),
                race_statuses ( id, label )
        `);

    if (error) throw new Error(error.message);
    return data.map(transformRace) || [];
}

export const getRaceBySlug = cache(async function getRaceBySlug(slug: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('races')
        .select(`
                *,
                participants:participants(count),
                events ( id, name ),
                race_statuses ( id, label )
        `)
        .eq('slug', slug)
        .single();

    if (error) throw new Error(error.message);
    return transformRace(data) || [];
});