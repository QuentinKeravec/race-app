import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {UserFormValues} from "@/schemas/userSchema";
import {createClient} from "@/utils/client";

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
                    username,
                    full_name,
                    avatar_url
                `);

            if (error) throw error;
            return data;
        },
    });
}

export function useDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: (string | number)[]) => {
            const cleanIds = ids.map(id => String(id));

            const { error } = await supabase
                .from("races")
                .delete()
                .in("id", cleanIds);

            if (error) throw error;
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["races"] });
        },
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (values: UserFormValues) => {
            const response = await fetch('/api/admin/create-user', {
                method: 'POST',
                body: JSON.stringify(values),
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });
        }
    });
}