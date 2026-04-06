'use server'

import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export async function getRoles() {
    const { data, error } = await supabase
        .from('roles')
        .select("*");

    if (error) throw new Error(error.message);
    return data || [];
}
