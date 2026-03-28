import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {createClient} from "@/utils/client";
import {addToast} from "@heroui/toast";
import {EventFormValues} from "@/schemas/eventSchema";

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

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (event: EventFormValues) => {
            const {error} = await supabase.from('events').insert([
                {
                    name: event.name,
                }
            ]);
            if (error) throw error;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            addToast({
                title: "作成完了",
                description: `${variables.name} を作成しました。`,
                color: "success",
            });
        },
    })
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
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            addToast({
                title: "削除完了",
                description: `${variables.length}件のイベントを削除しました。`,
                color: "success",
            });
        },
    });
}