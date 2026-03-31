'use server'

import {createClient} from "@/utils/client";
import {raceSchema} from "@/schemas/raceSchema";

export async function getRacesAction() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('races')
        .select(`
                *,
                events ( name ),
                race_statuses ( id, label )
        `)
    ;

    if (error) throw new Error(error.message);
    return data || [];
}


export async function createRaceAction(data: any) {
    const supabase = createClient();

    const validatedFields = raceSchema.safeParse(data);
    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" };
    }

    const {
        name,
        slug,
        distanceMeters,
        startTime,
        eventId,
        statusId
    } = validatedFields.data;

    const { error } = await supabase
        .from('races')
        .insert([{
            name: name,
            slug: slug,
            distance_meters: distanceMeters,
            start_time: startTime,
            event_id: eventId,
            status_id: statusId
        }]);

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}

export async function deleteRacesAction(ids: string[]) {
    const supabase = createClient();

    const { error } = await supabase
        .from('races')
        .delete()
        .in('id', ids);

    return { error: error?.message };
}

