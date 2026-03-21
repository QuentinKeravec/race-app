'use client'

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod";
import {Select, SelectItem} from "@heroui/select"
import {Input} from "@heroui/input"
import {Event} from "@/types/Event"
import {Status} from "@/types/Status"
import {createClient} from "@/utils/client"
import {useRouter} from "next/navigation"

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
}

export function AddRaceForm({id, events, status, onClose}: AddRaceFormProps) {
    const {register, handleSubmit, formState: {errors, isLoading}} = useForm<RaceFormValues>({
        resolver: zodResolver(raceSchema),
        mode: "onChange"
    });
    const supabase = createClient()
    const router = useRouter()

    const onSubmit = async (data: RaceFormValues) => {
        try {
            const {error} = await supabase
                .from('races')
                .insert([
                    {
                        name: data.name,
                        event_id: data.eventId,
                        status_id: data.statusId
                    }
                ]);

            if (error) throw error;

            router.refresh();
            onClose();
        } catch (error: any) {
            console.error("Erreur lors de l'ajout :", error.message);
        }
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
            >
                {status.map((item) => (
                    <SelectItem key={item.id}>{item.name}</SelectItem>
                ))}
            </Select>
        </form>
    )
}