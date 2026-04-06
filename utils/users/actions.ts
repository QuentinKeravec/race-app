import {TransformedUser} from "@/types/profile";
import {UserFormValues} from "@/schemas/userSchema";
import {createClient} from "@/utils/supabase/client";

export async function createUserAction(values: UserFormValues) {
    const supabase = createClient();

    let avatarUrl = "";

    if (values.avatar_url?.[0]) {
        const file = values.avatar_url[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file);

        if (uploadError) throw new Error("エラー : " + uploadError.message);

        const { data: urlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        avatarUrl = urlData.publicUrl;
    }

    const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...values,
            avatarUrl,
        }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error);
    return result;
}


export async function deleteUserAction(users: TransformedUser[]) {
    const userIds = users.map(u => u.id);
    const imagePaths = users
        .map(u => u.avatarUrl?.split('/').pop())
        .filter(Boolean);

    const response = await fetch('/api/admin/delete-users', {
        method: 'POST',
        body: JSON.stringify({ userIds, imagePaths }),
    });

    if (!response.ok) throw new Error("一括削除エラー");
}