'use server'

import {createClient} from "@/utils/supabase/server";
import {RaceFormValues, raceSchema} from "@/schemas/raceSchema";

export async function createRaceAction(data: RaceFormValues) {
    const supabase = await createClient();

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
        statusId,
        registrations,
        volunteers
    } = validatedFields.data;

    const { error } = await supabase
        .from('races')
        .insert({
            name: name,
            slug: slug,
            distance_meters: Math.round(distanceMeters * 1000),
            start_time: startTime,
            event_id: eventId,
            status_id: statusId,
            registrations: registrations,
            volunteers: volunteers
        });

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}

export async function updateRaceAction({ raceId, data }: { raceId: string, data: RaceFormValues }) {
    const supabase = await createClient();

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
        statusId,
        registrations,
        volunteers
    } = validatedFields.data;

    const { error } = await supabase
        .from('races')
        .update({
            name: name,
            slug: slug,
            distance_meters: Math.round(distanceMeters * 1000),
            start_time: startTime,
            event_id: eventId,
            status_id: statusId,
            registrations: registrations,
            volunteers: volunteers
        })
        .eq('id', raceId);

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}

export async function deleteRacesAction(ids: string[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('races')
        .delete()
        .in('id', ids);

    return { error: error?.message };
}
