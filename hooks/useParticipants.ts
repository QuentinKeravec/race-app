import {useQuery} from "@tanstack/react-query";
import {getParticipantsByRaceId} from "@/utils/participants/queries";

export function useParticipants(raceId: string) {
    return useQuery({
        queryKey: ["participants", raceId],
        queryFn: () => getParticipantsByRaceId(raceId),
        enabled: !!raceId,
    });
}