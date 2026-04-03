'use client'

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addToast} from "@heroui/toast";
import {Event} from "@/types/event";
import {createEventAction, deleteEventsAction} from "@/utils/events/actions";
import {getEvents} from "@/utils/events/queries";

export function useEvents(initialEvents?: Event[]) {
    return useQuery({
        queryKey: ["events"],
        queryFn: () => getEvents(),
        initialData: initialEvents,
    });
}

export function useCreateEvent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createEventAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: result.error,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["events"] });

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

export function useDeleteEvents() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteEventsAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: `${result.error}`,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["events"] });

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