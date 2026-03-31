'use server'

import { createClient } from "@/utils/client";
import { eventSchema } from "@/schemas/eventSchema";

export async function getEventsAction() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('events')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
}

export async function createEventAction(data: any) {
    const supabase = createClient();

    const validatedFields = eventSchema.safeParse(data);
    if (!validatedFields.success) {
        return { error: "入力内容が正しくありません" };
    }

    const { name, slug } = validatedFields.data;

    const { error } = await supabase
        .from('events')
        .insert([{ name, slug }]);

    if (error) {
        console.error(error);
        return { error: "データベースへの保存中にエラーが発生しました" };
    }

    return { success: true };
}

export async function deleteEventsAction(ids: string[]) {
    const supabase = createClient();
    const { error } = await supabase
        .from('events')
        .delete()
        .in('id', ids);

    return { error: error?.message };
}