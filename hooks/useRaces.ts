'use client'

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addToast} from "@heroui/toast";
import {TransformedRace} from "@/types/race";
import {createRaceAction, deleteRacesAction, getParticipantsAction, getRacesAction} from "@/app/races/actions";
import {transformRace, transformParticipant} from "@/utils/transformers";

export function useRaces(initialRaces?: TransformedRace[]) {
    return useQuery({
        queryKey: ["races"],
        queryFn: async () => {
            const rawRaces = await getRacesAction();
            return rawRaces.map(transformRace);
        },
        initialData: initialRaces,
    });
}

export function useCreateRace() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createRaceAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: result.error,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["races"] });

            addToast({
                title: "作成完了",
                description: `${variables.name} を作成しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({
                title: "エラー",
                description: "予期せぬエラーが発生しました",
                color: "danger",
            });
        },
    });
}

export function useDeleteRaces() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteRacesAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: `${result.error}`,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["races"] });

            addToast({
                title: "削除完了",
                description: `${variables.length}件のイベントを削除しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({ title: "エラー", description: "通信エラーが発生しました", color: "danger" });
        }
    });
}

export function useParticipants(raceId: string) {
    return useQuery({
        queryKey: ["participants", raceId],
        queryFn: async () => {
            const rawParticipants = await getParticipantsAction();
            return rawParticipants.map(transformParticipant);
        }
    });
}