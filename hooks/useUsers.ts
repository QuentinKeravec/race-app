import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {UserFormValues} from "@/schemas/userSchema";
import {createClient} from "@/utils/supabase/client";
import {UserProfile} from "@/types/profile";
import {addToast} from "@heroui/toast";

const supabase = createClient();

export function useUsers() {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select(`
                    id,
                    email,
                    full_name,
                    avatar_url
                `);

            if (error) throw error;
            return data;
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: UserFormValues) => {
            let avatarUrl = "";

            if (values.avatar_url?.[0]) {
                const file = values.avatar_url[0];
                const fileExt = file.name.split('.').pop();
                const fileName = `${crypto.randomUUID()}.${fileExt}`;

                const { data, error: uploadError } = await supabase.storage
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
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            addToast({
                title: "作成完了",
                description: `${variables.fullName} を作成しました。`,
                color: "success",
            });
        }
    });
}

export function useDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ users }: { users: UserProfile[] }) => {
            const userIds = users.map(u => u.id);
            const imagePaths = users
                .map(u => u.avatar_url?.split('/').pop())
                .filter(Boolean);

            const response = await fetch('/api/admin/delete-users', {
                method: 'POST',
                body: JSON.stringify({ userIds, imagePaths }),
            });

            if (!response.ok) throw new Error("一括削除エラー");
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
            addToast({
                title: "削除完了",
                description: `${variables.users.length}名のユーザーを削除しました。`,
                color: "success",
            });
        },
    });
}
