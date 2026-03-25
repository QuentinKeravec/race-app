'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Input} from "@heroui/input";
import {createClient} from "@/utils/client";
import {useMutation, useQueryClient} from "@tanstack/react-query";


const eventSchema = z.object({
    name: z.string().min(3, "名前は3文字以上で入力してください"),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface AddEventFormProps {
    id: string;
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddEventForm({id, onClose, onLoadingChange}: AddEventFormProps) {
    const {register, handleSubmit, formState: {errors}} = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
    });
    const supabase = createClient()
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (newEvent: EventFormValues) => {
            const { error } = await supabase.from('events').insert([newEvent]);
            if (error) throw error;
        },
        onMutate: () => onLoadingChange(true),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["events"] });
            onLoadingChange(false);
            onClose();
        },
        onError: () => onLoadingChange(false),
    });

    const onSubmit = (data: EventFormValues) => {
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
        </form>
    )
}