import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {createClient} from "@/utils/client";

const supabase = createClient();

export function useEvents() {
    return useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("events")
                .select("id, name");

            if (error) throw error;
            return data;
        },
    });
}

export function useDeleteEvents() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ids: (string | number)[]) => {
            const cleanIds = ids.map(id => String(id));

            const { error } = await supabase
                .from("events")
                .delete()
                .in("id", cleanIds);

            if (error) throw error;
            return ids;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}