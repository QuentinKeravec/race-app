import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {TransformedUser} from "@/types/profile";
import {addToast} from "@heroui/toast";
import {getUsers, getVolunteerCount} from "@/utils/users/queries"
import {createUserAction, deleteUserAction} from "@/utils/users/actions";
import {getVolunteersByRaceId} from "@/utils/users/queries";

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

export function useVolunteers(raceId: string) {
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

