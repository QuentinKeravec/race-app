import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TransformedUser} from "@/types/profile";
import {addToast} from "@heroui/toast";
import {getUsers, getVolunteerCount, getVolunteersByRaceId, getVolunteersExceptRaceId} from "@/utils/users/queries"
import {createUserAction, createVolunteerAction, deleteUserAction, deleteVolunteersAction} from "@/utils/users/actions";

export function useUsers(users: TransformedUser[]) {
    return useQuery({
        queryKey: ["profiles"],
        queryFn: getUsers,
        initialData: users,
    });
}

export function useCreateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createUserAction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });

            addToast({
                title: "作成完了",
                description: `${variables.fullName} を作成しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({ title: "エラー", description: "通信エラーが発生しました", color: "danger" });
        }
    });
}

export function useDeleteUsers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUserAction,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["profiles"] });

            addToast({
                title: "削除完了",
                description: `${variables.length}名のユーザーを削除しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({ title: "エラー", description: "通信エラーが発生しました", color: "danger" });
        }
    });
}

export function useVolunteersByRaceId(raceId: string) {
    return useQuery({
        queryKey: ["volunteers", raceId, "list"],
        queryFn: () => getVolunteersByRaceId(raceId),
        enabled: !!raceId,
    });
}

export function useVolunteerCount(raceId: string) {
    return useQuery({
        queryKey: ["volunteers", raceId, "count"],
        queryFn: () => getVolunteerCount(raceId),
        enabled: !!raceId,
    });
}


export function useVolunteers(raceId: string) {
    return useQuery({
        queryKey: ["volunteers", raceId, "select"],
        queryFn: () => getVolunteersExceptRaceId(raceId),
        enabled: !!raceId,
    });
}

export function useCreateVolunteers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createVolunteerAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: result.error,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["volunteers", variables.raceId] });

            addToast({
                title: "追加完了",
                description: `${variables.volunteerIds.length}名を追加しました。`,
                color: "success",
            });
        },
        onError: () => {
            addToast({ title: "エラー", description: "通信エラーが発生しました", color: "danger" });
        }
    });
}

export function useDeleteVolunteers() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteVolunteersAction,
        onSuccess: (result, variables) => {
            if (result?.error) {
                addToast({
                    title: "エラー",
                    description: `${result.error}`,
                    color: "danger",
                });
                return;
            }

            queryClient.invalidateQueries({ queryKey: ["volunteers", variables.raceId] });

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
