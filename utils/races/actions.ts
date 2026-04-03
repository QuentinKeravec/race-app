'use server'

import {createClient} from "@/utils/supabase/client";
import {RaceFormValues, raceSchema} from "@/schemas/raceSchema";

export async function createRaceAction(data: RaceFormValues) {
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
        .insert({
            name: name,
            slug: slug,
            distance_meters: distanceMeters,
            start_time: startTime,
            event_id: eventId,
            status_id: statusId
        });

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}

export async function updateRaceAction({ raceId, data }: { raceId: string, data: RaceFormValues }) {
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
        .update({
            name: name,
            slug: slug,
            distance_meters: distanceMeters,
            start_time: startTime,
            event_id: eventId,
            status_id: statusId
        })
        .eq('id', raceId);

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
