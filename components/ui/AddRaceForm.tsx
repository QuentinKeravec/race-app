'use client'

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectItem} from "@heroui/select";
import {Input} from "@heroui/input";
import {Event} from "@/types/Event";
import {Status} from "@/types/Status";
import {RaceFormValues, raceSchema} from "@/schemas/raceSchema";
import {useCreateRace} from "@/hooks/useRaces";
import {useEffect} from "react";

interface AddRaceFormProps {
    id: string;
    events: Event[];
    status: Status[];
    onClose: () => void;
    onLoadingChange:  (loading: boolean) => void;
}

export function AddRaceForm({id, events, status, onClose, onLoadingChange}: AddRaceFormProps) {
    const { mutate, isPending } = useCreateRace();
    const {register, handleSubmit, formState: {errors}, reset} = useForm<RaceFormValues>({
        resolver: zodResolver(raceSchema),
    });

    useEffect(() => {
        onLoadingChange?.(isPending);
    }, [isPending, onLoadingChange]);

    const onSubmit = async (data: RaceFormValues) => {
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