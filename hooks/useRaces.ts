import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {createClient} from "@/utils/client";
import {RaceFormValues} from "@/schemas/raceSchema";

const supabase = createClient();

export function useRaces() {
    return useQuery({
        queryKey: ["races"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("races")
                .select(`
                    id,
                    name,
                    events ( name ),
                    race_statuses ( id, label )
                `);

            if (error) throw error;

            return (data || []).map((race) => ({
                id: race.id,
                name: race.name,
                eventName: (Array.isArray(race.events) ? race.events[0]?.name : race.events?.name) ?? "不明",
                status: (Array.isArray(race.race_statuses) ? race.race_statuses[0]?.label : race.race_statuses?.label) ?? "不明",
                statusId: (Array.isArray(race.race_statuses) ? race.race_statuses[0]?.id : race.race_statuses?.id) ?? "",
            }));
        },
    });
}

export function useDeleteRaces() {
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

export function useCreateRace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (race: RaceFormValues) => {
            const {error} = await supabase.from('races').insert([
                {
                    name: race.name,
                    event_id: race.eventId,
                    status_id: race.statusId
                }
            ]);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["races"] });
        },
    })
}