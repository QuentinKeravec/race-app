'use server'

import {createClient} from "@/utils/supabase/client";
import {ParticipantImport} from "@/types/participants";

const supabase = createClient();

export async function deleteParticipantsAction({
    raceId,
    ids
}: {
    raceId: string,
    ids: string[]
}) {
    const { error } = await supabase
        .from('participants')
        .delete()
        .in('id', ids);

    return { error: error?.message };
}

export async function upsertParticipantsAction({
    raceId,
    data
}: {
    raceId: string,
    data: ParticipantImport[]
}) {
    const { error } = await supabase
        .from('participants')
        .upsert(data, { onConflict: 'race_id, runnet_id' });

    if (error) {
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return {
        success: true,
    };
}