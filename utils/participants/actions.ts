'use server'

import {createClient} from "@/utils/supabase/server";
import {ParticipantImport} from "@/types/participants";

export async function deleteParticipantsAction({
    raceId,
    ids
}: {
    raceId: string,
    ids: string[]
}) {
    const supabase = await createClient();

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
    const supabase = await createClient();

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

export const markAsEmailSent = async (id: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('participants')
        .update({ confirmation_sent_at: new Date().toISOString() })
        .eq('id', id);

    if (error) {
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return data;
};

export const updateCheckInParticipant = async (id: string, userId: string) => {
    const supabase = await createClient();

    const { error } = await supabase
        .from('participants')
        .update({
            checked_in: true,
            checked_at: new Date().toISOString(),
            checked_by: userId
        })
        .eq('id', id);

    return { error: error?.message };
};