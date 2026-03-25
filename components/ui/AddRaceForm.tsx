'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Select, SelectItem} from "@heroui/select";
import {Input} from "@heroui/input";
import {Event} from "@/types/Event";
import {Status} from "@/types/Status";
import {createClient} from "@/utils/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";

const raceSchema = z.object({
    name: z.string().min(3, "名前は3文字以上で入力してください"),
    eventId: z.string().min(1, "イベントを選択してください"),
    statusId: z.string().min(1, "ステータスを選択してください"),
});

type RaceFormValues = z.infer<typeof raceSchema>;

interface AddRaceFormProps {
    id: string;
    events: Event[];
    status: Status[];
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddRaceForm({id, events, status, onClose, onLoadingChange}: AddRaceFormProps) {
    const {register, handleSubmit, formState: {errors}} = useForm<RaceFormValues>({
        resolver: zodResolver(raceSchema),
    });
    const supabase = createClient()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (values: RaceFormValues) => {
            const {error} = await supabase.from('races').insert([
                {
                    name: values.name,
                    event_id: values.eventId,
                    status_id: values.statusId
                }
            ]);
            if (error) throw error;
        },
        onMutate: () => onLoadingChange(true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["races"] });
            onLoadingChange(false);
            onClose();
        },
        onError: () => onLoadingChange(false),
    });

    const onSubmit = async (data: RaceFormValues) => {
        mutation.mutate(data);
    };

    return (
        <form id={id} onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
            <Input
                {...register("name")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                label="名前"
                labelPlacement="outside"
                name="name"
                type="text"
            />
            <Select
                label="イベント"
                labelPlacement="outside"
                {...register("eventId")}
                isInvalid={!!errors.eventId}
                errorMessage={errors.eventId?.message}
                listboxProps={{
                    emptyContent: "データなし"
                }}
            >
                {events.map((event) => (
                    <SelectItem key={event.id}>{event.name}</SelectItem>
                ))}
            </Select>
            <Select
                label="ステータス"
                labelPlacement="outside"
                {...register("statusId")}
                isInvalid={!!errors.statusId}
                errorMessage={errors.statusId?.message}
                listboxProps={{
                    emptyContent: "データなし"
                }}
            >
                {status.map((item) => (
                    <SelectItem key={item.id}>{item.label}</SelectItem>
                ))}
            </Select>
        </form>
    )
}