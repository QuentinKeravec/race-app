'use server'

import {createClient} from "@/utils/supabase/server";

export async function getRoles() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('roles')
        .select("*");

    if (error) throw new Error(error.message);
    return data || [];
}
