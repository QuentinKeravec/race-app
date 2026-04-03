import {createClient} from "@/utils/supabase/client";

const supabase = createClient();

export async function getStatuses() {
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