import {useQuery} from "@tanstack/react-query";
import {getParticipants} from "@/utils/participants/queries";
import {transformParticipant} from "@/utils/transformers";

export function useParticipants(raceId: string) {
    return useQuery({
        queryKey: ["participants", raceId],
        queryFn: async () => {
            const rawParticipants = await getParticipants();
            return rawParticipants.map(transformParticipant);
        }
    });
}