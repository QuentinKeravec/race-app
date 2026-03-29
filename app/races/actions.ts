'use server'

import { createClient } from "@/utils/client";
import { revalidatePath } from "next/cache";
import { raceSchema } from "@/schemas/raceSchema";

export async function createRaceAction(formData: any) {
    const supabase = createClient();

    const validatedFields = raceSchema.safeParse(formData);
    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" }
    };

    const data = validatedFields.data;

    const { error } = await supabase
        .from('races')
        .insert([{
            name: data.name,
            slug: data.slug,
            distance_meters: data.distanceMeters,
            start_time: data.startTime,
            event_id: data.eventId,
            status_id: data.statusId
        }]);

    if (error) {
        return { error: "データベースへの保存中にエラーが発生しました" }
    };

    revalidatePath('/races');

    return { success: true };
}

export async function deleteRacesAction(ids: string[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('races')
        .delete()
        .in('id', ids);

    if (!error) {
        revalidatePath('/races')
    };
    return { error };
}

