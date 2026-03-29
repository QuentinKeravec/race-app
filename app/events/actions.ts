'use server'

import { createClient } from "@/utils/client";
import { revalidatePath } from "next/cache";
import { eventSchema } from "@/schemas/eventSchema";

export async function createEventAction(formData: any) {
    const supabase = createClient();

    const validatedFields = eventSchema.safeParse(formData);
    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" }
    };

    const data = validatedFields.data;

    const { error } = await supabase
        .from('events')
        .insert([{
            name: data.name,
            slug: data.slug,
        }]);

    if (error) {
        return { error: "データベースへの保存中にエラーが発生しました" }
    };

    revalidatePath('/events');

    return { success: true };
}

export async function deleteEventsAction(ids: string[]) {
    const supabase = await createClient();

    const { error } = await supabase
        .from('events')
        .delete()
        .in('id', ids);

    if (!error) {
        revalidatePath('/events')
    };
    return { error };
}