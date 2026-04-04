'use server'

import {createClient} from "@/utils/supabase/client";
import { revalidatePath } from 'next/cache';

const supabase = createClient();

export async function deleteParticipantsAction(ids: string[]) {
    const { error } = await supabase
        .from('participants')
        .delete()
        .in('id', ids);

    if (!error) {
        revalidatePath('/races/[slug]', 'page');
    }

    return { error: error?.message };
}

export async function upsertParticipantsAction(data: any) {
    const { error } = await supabase
        .from('participants')
        .upsert(data, { onConflict: 'race_id, runnet_id' });

    if (!error) {
        revalidatePath('/races/[slug]', 'page');
    }

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}