'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@heroui/input";
import {EventFormValues, eventSchema} from "@/schemas/eventSchema";
import {useCreateEvent} from "@/hooks/useEvents";
import {useEffect} from "react";

interface AddEventFormProps {
    id: string;
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddEventForm({id, onClose, onLoadingChange}: AddEventFormProps) {
    const { mutate, isPending } = useCreateEvent();
    const {register, handleSubmit, formState: {errors}, reset} = useForm<EventFormValues>({
        resolver: zodResolver(eventSchema),
    });

    useEffect(() => {
        onLoadingChange?.(isPending);
    }, [isPending, onLoadingChange]);

    const onSubmit = (data: EventFormValues) => {
        mutate(data, {
            onSuccess: () => {
                onClose();
                setTimeout(() => reset(), 300);
            }
        });
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