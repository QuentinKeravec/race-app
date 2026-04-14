'use server'

import {createClient} from "@/utils/supabase/server";
import {cache} from "react";

export async function getEvents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export const getEventBySlug = cache(async function getEventBySlug(slug: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('events')
        .select(`*`)
        .eq('slug', slug)
        .single();

    if (error) throw new Error(error.message);
    return data || [];
});