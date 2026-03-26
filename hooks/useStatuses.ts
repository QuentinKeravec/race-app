import {useQuery} from "@tanstack/react-query";
import {createClient} from "@/utils/client";

const supabase = createClient();

export function useStatuses() {
    return useQuery({
        queryKey: ["race_statuses"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("race_statuses")
                .select(`
                    id,
                    label
                `);

            if (error) throw error;
            return data;
        },
    });
}