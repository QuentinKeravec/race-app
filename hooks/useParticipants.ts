'use client';

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getParticipantCount, getParticipantsByRaceId} from "@/utils/participants/queries";
import {deleteParticipantsAction, upsertParticipantsAction} from "@/utils/participants/actions";
import {addToast} from "@heroui/toast";

export function useParticipants(raceId: string) {
    return useQuery({
        queryKey: ["participants", raceId, "list"],
        queryFn: () => getParticipantsByRaceId(raceId),
        enabled: !!raceId,
    });
}

export function useUpsertParticipants() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: upsertParticipantsAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: result.error,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["participants", variables.raceId] });

            addToast({
                title: "インポート完了",
                description: `${variables.data.length} 件のデータを処理しました。`,
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

export function useDeleteParticipants() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteParticipantsAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: `${result.error}`,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["participants", variables.raceId] });

            addToast({
                title: "削除完了",
                description: `${variables.ids.length}名の参加者を削除しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({ title: "エラー", description: "通信エラーが発生しました", color: "danger" });
        }
    });
}

export function useParticipantCount(raceId: string) {
    return useQuery({
        queryKey: ["participants", raceId, "count"],
        queryFn: () => getParticipantCount(raceId),
        enabled: !!raceId,
    });
}